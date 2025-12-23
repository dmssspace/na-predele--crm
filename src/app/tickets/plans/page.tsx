"use client";

import { PlusOutlined } from "@ant-design/icons";
import {
  CreateButton,
  DeleteButton,
  EditButton,
  ImageField,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord, useApiUrl } from "@refinedev/core";
import {
  Space,
  Table,
  Tag,
  Typography,
  Button,
  InputNumber,
  message,
  Card,
  Row,
  Col,
} from "antd";
import { useState } from "react";

const { Text, Title } = Typography;

interface TicketPlanPackage {
  id: string;
  plan_id: string;
  duration_days: number;
  price: number;
  total_sessions: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function TicketPlanList() {
  const { result, tableProps } = useTable({
    syncWithLocation: true,
    resource: "tickets/plans",
  });

  const apiUrl = useApiUrl();
  const [expandedPackages, setExpandedPackages] = useState<
    Record<string, TicketPlanPackage[]>
  >({});
  const [editingPrice, setEditingPrice] = useState<Record<string, number>>({});
  const [editingSessions, setEditingSessions] = useState<
    Record<string, number | null>
  >({});
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});

  const fetchPackages = async (planId: string) => {
    try {
      const response = await fetch(
        `${apiUrl}/tickets/plans/${planId}/packages`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      setExpandedPackages((prev) => ({ ...prev, [planId]: data.data || [] }));
    } catch (error) {
      message.error("Не удалось загрузить пакеты");
    }
  };

  const handlePriceUpdate = async (
    ticketId: string,
    packageId: string,
    newPrice: number
  ) => {
    setIsUpdating((prev) => ({ ...prev, [packageId]: true }));

    try {
      const response = await fetch(
        `${apiUrl}/tickets/plans/${ticketId}/packages/${packageId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ price: newPrice }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      message.success("Цена успешно обновлена");

      await fetchPackages(ticketId);

      setEditingPrice((prev) => {
        const newState = { ...prev };
        delete newState[packageId];
        return newState;
      });
    } catch (error) {
      console.error("Error updating price:", error);
      message.error("Ошибка при обновлении цены");
    } finally {
      setIsUpdating((prev) => ({ ...prev, [packageId]: false }));
    }
  };

  const handleSessionsUpdate = async (
    ticketId: string,
    packageId: string,
    newSessions: number | null
  ) => {
    setIsUpdating((prev) => ({ ...prev, [`sessions_${packageId}`]: true }));

    try {
      const response = await fetch(
        `${apiUrl}/tickets/plans/${ticketId}/packages/${packageId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ total_sessions: newSessions ?? 0 }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      message.success("Количество занятий успешно обновлено");

      await fetchPackages(ticketId);

      setEditingSessions((prev) => {
        const newState = { ...prev };
        delete newState[packageId];
        return newState;
      });
    } catch (error) {
      console.error("Error updating sessions:", error);
      message.error("Ошибка при обновлении количества занятий");
    } finally {
      setIsUpdating((prev) => ({ ...prev, [`sessions_${packageId}`]: false }));
    }
  };

  const expandedRowRender = (record: BaseRecord) => {
    const packages = expandedPackages[record.id] || [];

    if (packages.length === 0) {
      return <Text type="secondary">Загрузка пакетов...</Text>;
    }

    return (
      <Row gutter={[16, 16]} style={{ padding: "16px 0" }}>
        {packages.map((pkg: TicketPlanPackage) => (
          <Col xs={24} sm={12} md={8} lg={6} key={pkg.id}>
            <Card
              size="small"
              title={`${pkg.duration_days} дней`}
              extra={
                <Tag color={pkg.is_active ? "green" : "red"}>
                  {pkg.is_active ? "Активен" : "Неактивен"}
                </Tag>
              }
              style={{ height: "100%" }}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <div>
                  <Text type="secondary">Количество тренировок:</Text>
                  <br />
                  {editingSessions[pkg.id] !== undefined ? (
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <InputNumber
                        value={editingSessions[pkg.id]}
                        onChange={(value) =>
                          setEditingSessions((prev) => ({
                            ...prev,
                            [pkg.id]: value,
                          }))
                        }
                        placeholder="Пусто = неограниченно"
                        style={{ width: "100%" }}
                        min={0}
                        precision={0}
                      />
                      <Space
                        style={{
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <Button
                          type="primary"
                          size="small"
                          loading={isUpdating[`sessions_${pkg.id}`]}
                          onClick={() =>
                            handleSessionsUpdate(
                              record.id,
                              pkg.id,
                              editingSessions[pkg.id]
                            )
                          }
                        >
                          Сохранить
                        </Button>
                        <Button
                          size="small"
                          onClick={() =>
                            setEditingSessions((prev) => {
                              const newState = { ...prev };
                              delete newState[pkg.id];
                              return newState;
                            })
                          }
                        >
                          Отмена
                        </Button>
                      </Space>
                    </Space>
                  ) : (
                    <Space
                      style={{
                        width: "100%",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                      }}
                    >
                      <Text strong style={{ fontSize: 18 }}>
                        {pkg.total_sessions || "Неограниченно"}
                      </Text>
                      <Button
                        type="link"
                        size="small"
                        onClick={() =>
                          setEditingSessions((prev) => ({
                            ...prev,
                            [pkg.id]: pkg.total_sessions,
                          }))
                        }
                      >
                        Изменить
                      </Button>
                    </Space>
                  )}
                </div>
                <div>
                  <Text type="secondary">Цена:</Text>
                  <br />
                  {editingPrice[pkg.id] !== undefined ? (
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <InputNumber
                        value={editingPrice[pkg.id]}
                        onChange={(value) =>
                          setEditingPrice((prev) => ({
                            ...prev,
                            [pkg.id]: value || 0,
                          }))
                        }
                        style={{ width: "100%" }}
                        min={0}
                        precision={2}
                      />
                      <Space
                        style={{
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <Button
                          type="primary"
                          size="small"
                          loading={isUpdating[pkg.id]}
                          onClick={() =>
                            handlePriceUpdate(
                              record.id,
                              pkg.id,
                              editingPrice[pkg.id]
                            )
                          }
                        >
                          Сохранить
                        </Button>
                        <Button
                          size="small"
                          onClick={() =>
                            setEditingPrice((prev) => {
                              const newState = { ...prev };
                              delete newState[pkg.id];
                              return newState;
                            })
                          }
                        >
                          Отмена
                        </Button>
                      </Space>
                    </Space>
                  ) : (
                    <Space
                      style={{
                        width: "100%",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                      }}
                    >
                      <Text strong style={{ fontSize: 18 }}>
                        {pkg.price} {"₽"}
                      </Text>
                      <Button
                        type="link"
                        size="small"
                        onClick={() =>
                          setEditingPrice((prev) => ({
                            ...prev,
                            [pkg.id]: pkg.price,
                          }))
                        }
                      >
                        Изменить
                      </Button>
                    </Space>
                  )}
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    ID: {pkg.id}
                  </Text>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  const metadataThemeToColor = (theme: string) => {
    switch (theme) {
      case "yellow":
        return "yellow";
      case "accent":
        return "orange";
      case "default":
        return "gray";
      default:
        return "blue";
    }
  };

  return (
    <List>
      <Table
        {...tableProps}
        rowKey="id"
        onRow={(record) => ({
          onClick: (event) => {
            // Не разворачивать, если клик был на кнопке действия
            const target = event.target as HTMLElement;
            if (target.closest("button") || target.closest(".ant-space")) {
              return;
            }

            const key = record.id;
            if (!key) return;

            const isExpanded = expandedRowKeys.includes(key);

            if (isExpanded) {
              setExpandedRowKeys(expandedRowKeys.filter((k) => k !== key));
            } else {
              setExpandedRowKeys([...expandedRowKeys, key]);
              if (record.id && !expandedPackages[record.id]) {
                fetchPackages(record.id);
              }
            }
          },
          style: { cursor: "pointer" },
        })}
        expandable={{
          expandedRowRender,
          expandedRowKeys,
          onExpand: (expanded, record) => {
            if (expanded && !expandedPackages[record.id]) {
              fetchPackages(record.id);
            }
          },
          rowExpandable: () => true,
        }}
      >
        <Table.Column dataIndex="name" title={"Название"} />
        <Table.Column
          dataIndex="description"
          title={"Описание"}
          render={(value: string) => {
            if (!value || value === "") {
              return "-";
            }

            return value;
          }}
        />
        <Table.Column
          dataIndex="type"
          title={"Тип"}
          width={120}
          render={(value: string) => {
            if (value === "club") {
              return <Tag color="blue">Клубный</Tag>;
            }
            return <Tag>Другой</Tag>;
          }}
        />
        <Table.Column
          dataIndex="metadata"
          title={"Тема"}
          width={100}
          render={(metadata: any) => {
            if (metadata?.theme) {
              return (
                <Tag color={metadataThemeToColor(metadata.theme)}>
                  {metadata.theme}
                </Tag>
              );
            }
            return "-";
          }}
        />
        <Table.Column
          title={"Действия"}
          dataIndex="actions"
          width={150}
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record?.id} />
              <ShowButton hideText size="small" recordItemId={record?.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
}
