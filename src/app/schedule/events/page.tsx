"use client";

import React from "react";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { CreateButton, List, useTable } from "@refinedev/antd";
import { useNavigation, useParsed, useGo } from "@refinedev/core";
import { Button, Card, Col, Row, Select, Space, Table, Tag, Form } from "antd";
import { useTranslations } from "next-intl";
import type { Event } from "@/types/schedule";

export default function EventsPage() {
  const t = useTranslations("schedule.events");
  const { create } = useNavigation();
  const go = useGo();
  const [form] = Form.useForm();

  const { tableProps, searchFormProps } = useTable<Event>({
    resource: "events",
    syncWithLocation: true,
    onSearch: (values: any) => {
      const filters: any[] = [];

      if (values.event_type) {
        filters.push({
          field: "event_type",
          operator: "eq" as const,
          value: values.event_type,
        });
      }

      return filters;
    },
  });

  const getWeekdayName = (weekday: number) => {
    const days = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];
    return days[weekday];
  };

  const getTrainingTypeColor = (type: string) => {
    switch (type) {
      case "individual":
        return "green";
      case "group_adult":
        return "blue";
      case "group_child":
        return "gold";
      default:
        return "default";
    }
  };

  return (
    <List
      title={
        <Space>
          <CalendarOutlined />
          {t("title", { default: "События расписания" })}
        </Space>
      }
      headerButtons={() => (
        <CreateButton
          icon={<PlusOutlined />}
          onClick={() => go({ to: "/schedule/events/create/recurring" })}
        >
          Создать регулярную тренировку
        </CreateButton>
      )}
    >
      <Form {...searchFormProps} form={form} layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item name="event_type">
          <Select
            allowClear
            placeholder={t("filters.eventType")}
            style={{ width: 200 }}
          >
            <Select.Option value="recurring">Регулярные</Select.Option>
            <Select.Option value="once">Разовые</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button htmlType="submit" type="primary">
            Фильтр
          </Button>
        </Form.Item>
      </Form>

      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="event_type"
          title={t("table.type")}
          render={(value) => (
            <Tag color={value === "recurring" ? "blue" : "cyan"}>
              {value === "recurring" ? "Регулярное" : "Разовое"}
            </Tag>
          )}
        />

        <Table.Column
          dataIndex="training_type"
          title={t("table.trainingType")}
          render={(value) => (
            <Tag color={getTrainingTypeColor(value)}>
              {value === "individual"
                ? "Индивидуальная"
                : value === "group_adult"
                ? "Групповая взрослых"
                : "Групповая детская"}
            </Tag>
          )}
        />

        <Table.Column
          dataIndex="training_spec"
          title={t("table.specialization")}
          render={(value) => <span style={{ textTransform: "uppercase" }}>{value}</span>}
        />

        <Table.Column
          title={t("table.trainer")}
          render={(_, record: Event) => (
            <Space>
              <UserOutlined />
              {record.trainer.full_name}
            </Space>
          )}
        />

        <Table.Column
          title={t("table.schedule")}
          render={(_, record: Event) => (
            <Space direction="vertical" size={0}>
              {record.event_type === "recurring" && record.weekday !== undefined && (
                <div>
                  <CalendarOutlined /> {getWeekdayName(record.weekday)}
                </div>
              )}
              <div>
                <ClockCircleOutlined /> {record.start_time} - {record.end_time}
              </div>
            </Space>
          )}
        />

        <Table.Column
          dataIndex="clients_cap"
          title={t("table.capacity")}
          render={(value) => (
            <Tag icon={<TeamOutlined />} color="purple">
              {value}
            </Tag>
          )}
        />

        <Table.Column
          title={t("table.actions")}
          render={(_, record: Event) => (
            <Button danger size="small" icon={<DeleteOutlined />}>
              Удалить
            </Button>
          )}
        />
      </Table>
    </List>
  );
}
