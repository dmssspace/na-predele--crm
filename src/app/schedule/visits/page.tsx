"use client";

import React from "react";
import { CheckCircleOutlined, HistoryOutlined, UserOutlined } from "@ant-design/icons";
import { List, useTable } from "@refinedev/antd";
import { DatePicker, Form, Space, Table, Tag, Card, Statistic, Row, Col } from "antd";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { useTranslations } from "next-intl";
import type { Visit } from "@/types/schedule";

const { RangePicker } = DatePicker;

export default function VisitsPage() {
  const t = useTranslations("schedule.visits");
  const [form] = Form.useForm();

  const { tableProps, searchFormProps } = useTable<Visit>({
    resource: "visits",
    syncWithLocation: true,
    onSearch: (values: any) => {
      const filters: any[] = [];

      if (values.dateRange) {
        filters.push({
          field: "from",
          operator: "eq" as const,
          value: values.dateRange[0].toISOString(),
        });
        filters.push({
          field: "to",
          operator: "eq" as const,
          value: values.dateRange[1].toISOString(),
        });
      }

      return filters;
    },
  });

  const visits = ((tableProps?.dataSource as any) || []) as Visit[];
  const totalVisits = visits.length;
  const totalCharged = visits.filter((v) => v.is_charged).length;

  return (
    <List
      title={
        <Space>
          <HistoryOutlined />
          {t("title", { default: "История посещений" })}
        </Space>
      }
    >
      <Form {...searchFormProps} form={form} layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item name="dateRange">
          <RangePicker
            placeholder={[t("filters.dateFrom"), t("filters.dateTo")]}
            format="DD.MM.YYYY"
          />
        </Form.Item>
      </Form>

      {totalVisits > 0 && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Card>
              <Statistic
                title={t("summary.total")}
                value={totalVisits}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title={t("summary.charged")}
                value={totalCharged}
                prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title={t("summary.free")}
                value={totalVisits - totalCharged}
                prefix={<CheckCircleOutlined style={{ color: "#1890ff" }} />}
              />
            </Card>
          </Col>
        </Row>
      )}

      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="customer_name"
          title={t("table.customer")}
          render={(value) => (
            <Space>
              <UserOutlined />
              {value}
            </Space>
          )}
        />

        <Table.Column
          dataIndex="session_date"
          title={t("table.session")}
          render={(value, record: Visit) => (
            <div>
              <div>{format(parseISO(value), "dd.MM.yyyy HH:mm", { locale: ru })}</div>
              <div style={{ fontSize: 12, color: "#888" }}>
                {record.session_training_spec}
              </div>
            </div>
          )}
        />

        <Table.Column
          dataIndex="session_trainer_name"
          title={t("table.trainer")}
        />

        <Table.Column
          dataIndex="visited_at"
          title={t("table.visitedAt")}
          render={(value) => format(parseISO(value), "dd.MM.yyyy HH:mm", { locale: ru })}
        />

        <Table.Column
          dataIndex="is_charged"
          title={t("table.charged")}
          render={(value) =>
            value ? (
              <Tag icon={<CheckCircleOutlined />} color="success">
                Списано
              </Tag>
            ) : (
              <Tag color="default">Бесплатно</Tag>
            )
          }
        />
      </Table>
    </List>
  );
}
