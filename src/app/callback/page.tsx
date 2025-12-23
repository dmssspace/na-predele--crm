"use client";

import { DateField, List, useTable } from "@refinedev/antd";
import {
  type BaseRecord,
  useNavigation,
  useCustomMutation,
  useInvalidate,
  useList,
  useOne,
  useGetIdentity,
  useCustom,
} from "@refinedev/core";
import {
  Button,
  Card,
  Col,
  Row,
  Space,
  Table,
  Tag,
  Typography,
  Modal,
  Input,
} from "antd";
import {
  ArrowRightOutlined,
  CheckOutlined,
  EditOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";

const { Text } = Typography;

interface Callback extends BaseRecord {
  id: string;
  user_full_name: string;
  user_phone_number: string;
  user_email: string;
  type: string;
  status: string;
  comment?: string;
  metadata: CallbackMetadata;
  created_at: string;
  updated_at: string;
  assignee_user?: AssigneeUser;
}

interface AssigneeUser {
  id: string;
  email: string;
  phone_number?: string;
  role: string;
}

interface CallbackMetadata {
  trainer_id?: string;
  ticket_plan_id?: string;
  duration_days?: number;
}

export default function CallbackRequestList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [comment, setComment] = useState("");

  const { data: identity } = useGetIdentity<{
    id: string;
    email: string;
    role: string;
  }>();

  const { tableProps } = useTable<Callback>({
    syncWithLocation: true,
    resource: "callback",
  });

  const { show } = useNavigation();
  const invalidate = useInvalidate();
  const { mutate: assignCallback } = useCustomMutation();
  const { mutate: solveCallback } = useCustomMutation();

  const humanizeCallbackStatus = (status: string) => {
    switch (status) {
      case "new":
        return "Новая";
      case "processing":
        return "В обработке";
      case "completed":
        return "Обработана";
      default:
        return status;
    }
  };

  const handleAssign = (id: string) => {
    assignCallback(
      {
        url: `/callback/${id}/assign`,
        method: "post",
        values: {},
        successNotification: {
          message: "Заявка взята в обработку",
          type: "success",
        },
        errorNotification: {
          message: "Ошибка при попытке взять заявку в обработку",
          type: "error",
        },
      },
      {
        onSuccess: () => {
          invalidate({
            resource: "callback",
            invalidates: ["all"],
          });
        },
      }
    );
  };

  const handleOpenCloseModal = (id: string) => {
    setSelectedRequestId(id);
    setIsModalOpen(true);
  };

  const handleCloseRequest = () => {
    if (!selectedRequestId) return;

    solveCallback(
      {
        url: `/callback/${selectedRequestId}/solve`,
        method: "post",
        values: {
          comment: comment !== "" ? comment : null,
        },
        successNotification: {
          message: "Заявка закрыта",
          type: "success",
        },
        errorNotification: {
          message: "Ошибка при закрытии заявки",
          type: "error",
        },
      },
      {
        onSuccess: () => {
          invalidate({
            resource: "callback",
            invalidates: ["all"],
          });
          setIsModalOpen(false);
          setComment("");
          setSelectedRequestId(null);
        },
      }
    );
  };

  const ExpandedRowCustomer = ({ callback }: { callback: Callback }) => {
    const { query } = useCustom({
      url: "/customers/search",
      method: "get",
      config: {
        query: {
          q: callback.user_phone_number || callback.user_email,
        },
      },
    });

    const { data: customerData, isLoading } = query;
    const customer = customerData?.data?.[0];

    if (isLoading) {
      return (
        <Card
          size="small"
          title="Клиент"
          loading={true}
          style={{ height: "100%" }}
        >
          <div style={{ height: 100 }} />
        </Card>
      );
    }

    if (!customer) {
      return (
        <Card size="small" title="Клиент" style={{ height: "100%" }}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Text type="secondary">
              Клиент с таким номером телефона или эл. почтой не найден
            </Text>
            <Button
              type="primary"
              size="small"
              href={`/customers/create?phone=${callback.user_phone_number}&email=${callback.user_email}&name=${callback.user_full_name}`}
            >
              Создать клиента
            </Button>
          </Space>
        </Card>
      );
    }

    return (
      <Card
        size="small"
        title="Клиент"
        extra={
          <Button
            type="link"
            size="small"
            icon={<ArrowRightOutlined />}
            onClick={() => show("customers", customer.id)}
          />
        }
        style={{ height: "100%" }}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <div>
            <Text type="secondary">ФИО</Text>
            <div>
              <Text strong style={{ fontSize: 16 }}>
                {customer.full_name || customer.short_name || "-"}
              </Text>
            </div>
          </div>
          <div>
            <Text type="secondary">Телефон</Text>
            <div>
              <Text>{customer.phone_number || "-"}</Text>
            </div>
          </div>
          <div>
            <Text type="secondary">Email</Text>
            <div>
              <Text>{customer.email || "-"}</Text>
            </div>
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              ID: {customer.id}
            </Text>
          </div>
        </Space>
      </Card>
    );
  };

  const TrainerInfo = ({ trainerID }: { trainerID: string }) => {
    const { query } = useOne({
      resource: "trainers",
      id: trainerID,
    });

    const { data: trainerData, isLoading } = query;

    if (isLoading) {
      return <Text>Загрузка...</Text>;
    }

    const trainer = trainerData?.data;

    if (!trainer) {
      return <Text>Тренер не найден</Text>;
    }

    return (
      <Space direction="vertical" style={{ width: "100%" }}>
        <Text strong style={{ fontSize: 18 }}>
          {trainer.full_name || trainer.short_name || "-"}
        </Text>
        <Button
          type="link"
          size="small"
          icon={<ArrowRightOutlined />}
          onClick={() => show("trainers", trainer.id)}
        >
          Перейти к тренеру
        </Button>
      </Space>
    );
  };

  const TicketPlanInfo = ({ planID }: { planID: string }) => {
    const { query } = useOne({
      resource: "tickets/plans",
      id: planID,
    });

    const { data: planData, isLoading } = query;

    if (isLoading) {
      return <Text>Загрузка...</Text>;
    }

    const plan = planData?.data;

    if (!plan) {
      return <Text>Тариф не найден</Text>;
    }

    return (
      <Space direction="vertical" style={{ width: "100%" }}>
        <Text strong style={{ fontSize: 18 }}>
          {plan.name || "-"}
        </Text>
        <Button
          type="link"
          size="small"
          icon={<ArrowRightOutlined />}
          onClick={() => show("tickets/plans", plan.id)}
        >
          Перейти к тарифу
        </Button>
      </Space>
    );
  };

  const expandedRowRender = (record: Callback) => {
    return (
      <Row gutter={[16, 16]} style={{ padding: "16px 0" }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card size="small" title={`Детали заявки`} style={{ height: "100%" }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <div>
                {record.type === "trainer_signup" && (
                  <>
                    <Text type="secondary">Тренер</Text>
                    {record.metadata.trainer_id ? (
                      <TrainerInfo trainerID={record.metadata.trainer_id} />
                    ) : (
                      <Text>-</Text>
                    )}
                  </>
                )}
                {record.type === "ticket_request" && (
                  <>
                    <Text type="secondary">Тариф абонемента</Text>
                    {record.metadata.ticket_plan_id ? (
                      <TicketPlanInfo
                        planID={record.metadata.ticket_plan_id}
                      />
                    ) : (
                      <Text>-</Text>
                    )}
                    <Text type="secondary">Длительность абонемента</Text>
                    <Space
                      style={{
                        width: "100%",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                      }}
                    >
                      <Text strong style={{ fontSize: 18 }}>
                        {record.metadata.duration_days
                          ? record.metadata.duration_days + " дней"
                          : "-"}
                      </Text>
                    </Space>
                  </>
                )}
                <Text type="secondary">Обновлено</Text>
                <Space
                  style={{
                    width: "100%",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                  }}
                >
                  <Text strong style={{ fontSize: 18 }}>
                    {dayjs(record.updated_at).format("DD.MM.YYYY HH:mm:ss")}
                  </Text>
                </Space>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  ID: {record.id}
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card size="small" title={`Статус заявки`} style={{ height: "100%" }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <div>
                <Text type="secondary">Статус</Text>
                <Space
                  style={{
                    width: "100%",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                  }}
                >
                  <Text strong style={{ fontSize: 18 }}>
                    {humanizeCallbackStatus(record.status)}
                  </Text>
                </Space>
                <Text type="secondary">Ответственный</Text>
                <Space
                  style={{
                    width: "100%",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                  }}
                >
                  <Text strong style={{ fontSize: 18 }}>
                    {record.assignee_user
                      ? record.assignee_user.email
                      : "Не назначен"}
                  </Text>
                </Space>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card size="small" title={`Комментарий`} style={{ height: "100%" }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Space
                style={{
                  width: "100%",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <Text strong style={{ fontSize: 18 }}>
                  {record.comment ? record.comment : "Комментарий отсутствует"}
                </Text>
              </Space>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <ExpandedRowCustomer callback={record} />
        </Col>
      </Row>
    );
  };

  return (
    <List>
      <Table<Callback>
        {...tableProps}
        rowKey="id"
        expandable={{
          expandedRowRender,
          rowExpandable: () => true,
        }}
        onRow={(record) => ({
          onClick: (event) => {
            const target = event.target as HTMLElement;
            if (!target.closest("button") && !target.closest("a")) {
              const expandIcon = document.querySelector(
                `[data-row-key="${record.id}"] .ant-table-row-expand-icon`
              );
              if (expandIcon) {
                (expandIcon as HTMLElement).click();
              }
            }
          },
          style: { cursor: "pointer" },
        })}
      >
        <Table.Column
          dataIndex="type"
          title="Тип заявки"
          render={(value: string) => {
            let tagColor = "default";
            let humanReadableType = value;

            switch (value) {
              case "trainer_request":
                tagColor = "yellow";
                humanReadableType = "Запрос выбора тренера";
                break;
              case "trainer_signup":
                tagColor = "red";
                humanReadableType = "Запись к тренеру";
                break;
              case "ticket_request":
                tagColor = "orange";
                humanReadableType = "Запрос абонемента";
                break;
              case "trial":
                tagColor = "green";
                humanReadableType = "Пробное занятие";
                break;
              default:
                tagColor = "default";
            }

            return <Tag color={tagColor}>{humanReadableType}</Tag>;
          }}
        />
        <Table.Column dataIndex="user_full_name" title="Имя клиента" />
        <Table.Column
          dataIndex="user_phone_number"
          title="Телефон клиента"
          render={(value: string) => {
            if (value === "") {
              return "-";
            }

            const formatted = value.replace(/\D/g, "");

            if (formatted.length === 11 && formatted.startsWith("7")) {
              const displayNumber = `+7 (${formatted.slice(
                1,
                4
              )}) ${formatted.slice(4, 7)}-${formatted.slice(
                7,
                9
              )}-${formatted.slice(9, 11)}`;

              return (
                <Space size="small">
                  <a href={`tel:+${formatted}`}>{displayNumber}</a>
                  <Button
                    type="text"
                    size="small"
                    title="Скопировать номер телефона"
                    icon={<CopyOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(displayNumber);
                    }}
                  />
                </Space>
              );
            }

            return value;
          }}
        />
        <Table.Column
          dataIndex="user_email"
          title="Эл. почта клиента"
          render={(value: string) => {
            if (value !== "") {
              return (
                <Space size="small">
                  <a href={`mailto:${value}`}>{value}</a>
                  <Button
                    type="text"
                    size="small"
                    title="Скопировать эл. почту"
                    icon={<CopyOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(value);
                    }}
                  />
                </Space>
              );
            }

            return "-";
          }}
        />
        <Table.Column
          dataIndex="status"
          title="Статус заявки"
          render={(value: string) => {
            let tagColor = "default";
            let humanReadableStatus = value;

            switch (value) {
              case "new":
                tagColor = "blue";
                humanReadableStatus = "Новая";

                break;
              case "processing":
                tagColor = "orange";
                humanReadableStatus = "В обработке";

                break;
              case "completed":
                tagColor = "green";
                humanReadableStatus = "Обработана";

                break;
              default:
                tagColor = "default";
            }

            return <Tag color={tagColor}>{humanReadableStatus}</Tag>;
          }}
        />
        <Table.Column
          dataIndex="created_at"
          title="Отправлено"
          render={(date: string) => (
            <DateField value={date} format="DD.MM.YYYY HH:mm" />
          )}
        />{" "}
        <Table.Column
          title="Действия"
          dataIndex="actions"
          width={150}
          render={(_, record: Callback) => {
            const canManage =
              identity?.role === "admin" ||
              (identity?.role === "moderator" &&
                record.assignee_user?.id === identity?.id);

            return (
              <Space>
                {record.status === "new" && (
                  <Button
                    size="small"
                    variant="filled"
                    color="primary"
                    icon={<EditOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAssign(record.id);
                    }}
                    title="Взять в обработку"
                    style={{ width: 140 }}
                  >
                    В обработку
                  </Button>
                )}
                {record.status === "processing" && canManage && (
                  <Button
                    size="small"
                    variant="filled"
                    color="blue"
                    icon={<CheckOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenCloseModal(record.id);
                    }}
                    title="Закрыть"
                    style={{ width: 140 }}
                  >
                    Закрыть заявку
                  </Button>
                )}
              </Space>
            );
          }}
        />{" "}
      </Table>
      <Modal
        title="Закрыть заявку"
        open={isModalOpen}
        onOk={handleCloseRequest}
        onCancel={() => {
          setIsModalOpen(false);
          setComment("");
          setSelectedRequestId(null);
        }}
        okText="Закрыть заявку"
        cancelText="Отмена"
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text>Введите комментарий к заявке:</Text>
          <Input.TextArea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Комментарий..."
          />
        </Space>
      </Modal>
    </List>
  );
}
