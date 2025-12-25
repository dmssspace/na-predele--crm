"use client";

import React, { useState } from "react";
import {
  HistoryOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { List } from "@refinedev/antd";
import { Card, Space, Table, Tag, Statistic, Row, Col, Alert } from "antd";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { useTranslations } from "next-intl";
import type { Visit } from "@/types/schedule";
import { visitsApi } from "@/lib/api/schedule";
import { useQuery } from "@tanstack/react-query";
import type { TablePaginationConfig } from "antd";

export default function VisitsPage() {
  const t = useTranslations("schedule.visits");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });

  // Fetch visits data
  const {
    data: visitsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["visits", pagination.current, pagination.pageSize],
    queryFn: () => visitsApi.getVisits(pagination.current, pagination.pageSize),
  });

  const visits = visitsResponse?.data || [];
  const totalVisits = visits.length;
  const totalCharged = visits.filter((v) => v.is_charged).length;
  const totalFree = totalVisits - totalCharged;

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination({
      current: newPagination.current || 1,
      pageSize: newPagination.pageSize || 20,
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      render: (id: string) => (
        <span style={{ fontFamily: "monospace", fontSize: "0.85em" }}>
          {id.substring(0, 8)}...
        </span>
      ),
    },
    {
      title: "Клиент",
      dataIndex: "customer_id",
      key: "customer_id",
      render: (customerId: string | undefined) => (
        <Space>
          {customerId ? (
            <span>{customerId.substring(0, 8)}...</span>
          ) : (
            <Tag color="default">Не указан</Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Абонемент",
      dataIndex: "ticket_id",
      key: "ticket_id",
      render: (ticketId: string | null | undefined) =>
        ticketId ? (
          <Tag color="blue">🎫 {ticketId.substring(0, 8)}...</Tag>
        ) : (
          <Tag color="default">Разовое</Tag>
        ),
    },
    {
      title: "Тип оплаты",
      dataIndex: "is_charged",
      key: "is_charged",
      render: (isCharged: boolean) =>
        isCharged ? (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            Оплачено
          </Tag>
        ) : (
          <Tag color="processing" icon={<CloseCircleOutlined />}>
            Бесплатно
          </Tag>
        ),
    },
    {
      title: "Дата посещения",
      dataIndex: "created_at",
      key: "created_at",
      sorter: (a: Visit, b: Visit) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      defaultSortOrder: "descend" as const,
      render: (createdAt: string) => (
        <span>
          {format(parseISO(createdAt), "dd MMMM yyyy, HH:mm", { locale: ru })}
        </span>
      ),
    },
  ];

  return (
    <List
      title={
        <Space>
          <HistoryOutlined />
          {t("title", { default: "История посещений" })}
        </Space>
      }
    >
      {error && (
        <Alert
          message="Ошибка загрузки"
          description="Не удалось загрузить историю визитов. Проверьте подключение к серверу."
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {totalVisits > 0 && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Всего посещений"
                value={totalVisits}
                prefix={<HistoryOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Оплаченные"
                value={totalCharged}
                valueStyle={{ color: "#52c41a" }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Бесплатные"
                value={totalFree}
                valueStyle={{ color: "#1890ff" }}
                prefix={<CloseCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>
      )}

      <Card>
        <Table
          columns={columns}
          dataSource={visits}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            showSizeChanger: true,
            showTotal: (total) => `Всего: ${total} записей`,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
          onChange={handleTableChange}
        />
      </Card>
    </List>
  );
}
