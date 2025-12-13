"use client";

import {
  DateField,
  Show,
  TextField,
  BooleanField,
} from "@refinedev/antd";
import { useShow, useApiUrl } from "@refinedev/core";
import { Typography, Tag, Card, Row, Col, Space, Descriptions, message } from "antd";
import { useEffect, useState } from "react";

const { Title } = Typography;

interface TicketPlanPackage {
  id: number;
  uuid: string;
  plan_id: number;
  duration_days: number;
  price: number;
  total_sessions: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function TicketPlanShow() {
  const { result: record, query } = useShow({
    resource: "tickets/plans",
  });
  const { isLoading } = query;
  const apiUrl = useApiUrl();
  const [packages, setPackages] = useState<TicketPlanPackage[]>([]);

  useEffect(() => {
    const fetchPackages = async () => {
      if (record?.uuid) {
        try {
          const response = await fetch(
            `${apiUrl}/tickets/plans/${record.uuid}/packages`,
            {
              credentials: "include",
            }
          );
          const data = await response.json();
          setPackages(data.data || []);
        } catch (error) {
          message.error("Не удалось загрузить пакеты");
        }
      }
    };

    fetchPackages();
  }, [record?.uuid, apiUrl]);

  const humanizeType = (type: string): string => {
    switch (type) {
      case "club":
        return "Клубный";
      case "personal":
        return "Персональный";
      case "group":
        return "Групповой";
      default:
        return type || "-";
    }
  };

  const getThemeColor = (theme: string): string => {
    switch (theme) {
      case "yellow":
        return "yellow";
      case "accent":
        return "orange";
      case "default":
        return "gray";
      case "blue":
        return "blue";
      case "green":
        return "green";
      default:
        return "blue";
    }
  };

  return (
    <Show isLoading={isLoading}>
      <Descriptions column={1} bordered>
        <Descriptions.Item label="ID">
          <TextField value={record?.id} />
        </Descriptions.Item>
        <Descriptions.Item label="UUID">
          <TextField value={record?.uuid} />
        </Descriptions.Item>
        <Descriptions.Item label="Название">
          <TextField value={record?.name} />
        </Descriptions.Item>
        <Descriptions.Item label="Тип">
          <Tag color="blue">{humanizeType(record?.type)}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Описание">
          <TextField value={record?.description || "-"} />
        </Descriptions.Item>
        <Descriptions.Item label="Тема оформления">
          {record?.metadata?.theme ? (
            <Tag color={getThemeColor(record.metadata.theme)}>
              {record.metadata.theme}
            </Tag>
          ) : (
            "-"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Активен">
          <BooleanField value={record?.is_active} />
        </Descriptions.Item>
        <Descriptions.Item label="Дата создания">
          <DateField value={record?.created_at} format="DD.MM.YYYY HH:mm" />
        </Descriptions.Item>
        <Descriptions.Item label="Дата обновления">
          <DateField value={record?.updated_at} format="DD.MM.YYYY HH:mm" />
        </Descriptions.Item>
      </Descriptions>

      <Title level={4} style={{ marginTop: 24 }}>
        Пакеты абонемента
      </Title>

      <Row gutter={[16, 16]}>
        {packages.length > 0 ? (
          packages.map((pkg) => (
            <Col xs={24} sm={12} md={8} lg={6} key={pkg.uuid}>
              <Card
                size="small"
                title={`${pkg.duration_days} дней`}
                extra={
                  <Tag color={pkg.is_active ? "green" : "red"}>
                    {pkg.is_active ? "Активен" : "Неактивен"}
                  </Tag>
                }
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div>
                    <Typography.Text type="secondary">
                      Количество тренировок:
                    </Typography.Text>
                    <br />
                    <Typography.Text strong style={{ fontSize: 16 }}>
                      {pkg.total_sessions || "Неограниченно"}
                    </Typography.Text>
                  </div>
                  <div>
                    <Typography.Text type="secondary">Цена:</Typography.Text>
                    <br />
                    <Typography.Text strong style={{ fontSize: 18 }}>
                      {pkg.price} ₽
                    </Typography.Text>
                  </div>
                  <div>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      ID: {pkg.id}
                    </Typography.Text>
                  </div>
                </Space>
              </Card>
            </Col>
          ))
        ) : (
          <Col span={24}>
            <Typography.Text type="secondary">
              Нет доступных пакетов
            </Typography.Text>
          </Col>
        )}
      </Row>
    </Show>
  );
}
