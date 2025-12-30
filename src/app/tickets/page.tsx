"use client";

import { DateField, List, useTable } from "@refinedev/antd";
import {
  type BaseRecord,
  useNavigation,
  useCustomMutation,
  useInvalidate,
} from "@refinedev/core";
import { Button, Card, Col, Row, Space, Table, Tag, Typography } from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  ArrowRightOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { Ticket } from "@/types/ticket";

const { Text } = Typography;

export default function TicketList() {
  const { tableProps } = useTable<Ticket>({
    syncWithLocation: true,
    resource: "tickets",
  });

  const { show } = useNavigation();
  const invalidate = useInvalidate();
  const { mutate: freezeTicket } = useCustomMutation();
  const { mutate: unfreezeTicket } = useCustomMutation();

  const handleSuspendTicket = (id: string) => {
    freezeTicket(
      {
        url: `/tickets/${id}/freeze`,
        method: "post",
        values: {
          duration: "168m",
        },
        successNotification: {
          message: "Абонемент заморожен на 7 дней",
          type: "success",
        },
        errorNotification: {
          message: "Ошибка при заморозке абонемента",
          type: "error",
        },
      },
      {
        onSuccess: () => {
          invalidate({
            resource: "tickets",
            invalidates: ["list"],
          });
        },
      }
    );
  };

  const handleActivateTicket = (id: string) => {
    unfreezeTicket(
      {
        url: `/tickets/${id}/unfreeze`,
        method: "post",
        values: {},
        successNotification: {
          message: "Абонемент разморожен",
          type: "success",
        },
        errorNotification: {
          message: "Ошибка при разморозке абонемента",
          type: "error",
        },
      },
      {
        onSuccess: () => {
          invalidate({
            resource: "tickets",
            invalidates: ["list"],
          });
        },
      }
    );
  };

  const expandedRowRender = (record: BaseRecord) => {
    return (
      <Row gutter={[16, 16]} style={{ padding: "16px 0" }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            size="small"
            title={`Пакет "${record.package.plan.name} ${
              record.package.duration_days
            } дней${
              record.package.total_sessions && record.package.total_sessions > 0
                ? " " + `${record.package.total_sessions} занятий`
                : ""
            }"`}
            extra={
              <Button
                type="link"
                size="small"
                icon={<ArrowRightOutlined />}
                onClick={() => {
                  if (record.package?.plan?.id !== undefined) {
                    show("tickets/plans", record.package.plan.id);
                  }
                }}
              />
            }
            style={{ height: "100%" }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <div>
                <Text type="secondary">Осталось дней:</Text>
                <Space
                  style={{
                    width: "100%",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                  }}
                >
                  <Text strong style={{ fontSize: 18 }}>
                    {dayjs(record.end_date).diff(dayjs(), "day")}
                  </Text>
                </Space>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  ID: {record.package.id}
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            size="small"
            title={`Данные клиента`}
            extra={
              <Button
                type="link"
                size="small"
                icon={<ArrowRightOutlined />}
                onClick={() => show("customers", record.customer.id)}
              />
            }
            style={{ height: "100%" }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <div>
                <Text type="secondary">ФИО:</Text>
                <Space
                  style={{
                    width: "100%",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                  }}
                >
                  <Text strong style={{ fontSize: 18 }}>
                    {record.customer.full_name}
                  </Text>
                </Space>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  ID: {record.customer.id}
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    );
  };

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      active: { color: "success", text: "Активен" },
      expired: { color: "error", text: "Истёк" },
      frozen: { color: "warning", text: "Заморожен" },
    };

    const statusInfo = statusMap[status] || {
      color: "default",
      text: status,
    };
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
  };

  return (
    <List>
      <Table
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
          dataIndex="ticket_id"
          title="№ абонемента"
          width={120}
          render={(value: string) => {
            return String(value).replace(/(\d{3})(\d{2})(\d{2})/, "$1 $2 $3");
          }}
        />
        <Table.Column
          dataIndex={["customer", "short_name"]}
          title="Клиент"
          width={200}
        />
        <Table.Column
          dataIndex="status"
          title="Статус"
          width={120}
          render={(status: string) => getStatusTag(status)}
        />
        <Table.Column
          dataIndex="remaining_sessions"
          title="Осталось сессий"
          width={150}
          render={(sessions: number) => {
            if (sessions === null) {
              return <Tag color="blue">Неограниченно</Tag>;
            } else {
              return (
                <Tag color={sessions > 10 ? "blue" : "orange"}>{sessions}</Tag>
              );
            }
          }}
        />
        <Table.Column
          dataIndex="start_date"
          title="Дата начала"
          width={120}
          render={(date: string) => (
            <DateField value={date} format="DD.MM.YYYY" />
          )}
        />
        <Table.Column
          dataIndex="end_date"
          title="Дата окончания"
          width={120}
          render={(date: string) => (
            <DateField value={date} format="DD.MM.YYYY" />
          )}
        />
        <Table.Column
          title="Действия"
          dataIndex="actions"
          width={100}
          fixed="right"
          render={(_, record: Ticket) => (
            <Space>
              <Button
                size="small"
                icon={<UserOutlined />}
                onClick={() => {
                  if (record?.customer?.id !== undefined) {
                    show("customers", record.customer.id);
                  }
                }}
                title="Перейти к клиенту"
              />
              <Button
                size="small"
                icon={<FileTextOutlined />}
                onClick={() => {
                  if (record.package?.plan?.id !== undefined) {
                    show("tickets/plans", record.package.plan.id);
                  }
                }}
                title="Перейти к тарифу"
              />
              {record.status === "active" && (
                <Button
                  size="small"
                  icon={<PauseCircleOutlined />}
                  onClick={() => handleSuspendTicket(record.id)}
                  title="Заморозить абонемент"
                  danger
                />
              )}
              {record.status === "frozen" && (
                <Button
                  size="small"
                  icon={<PlayCircleOutlined />}
                  onClick={() => handleActivateTicket(record.id)}
                  title="Разморозить абонемент"
                  type="primary"
                />
              )}
            </Space>
          )}
        />
      </Table>
    </List>
  );
}
