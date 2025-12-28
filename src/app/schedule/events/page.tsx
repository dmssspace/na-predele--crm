"use client";

import React, { useState } from "react";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { CreateButton, DateField, List, useTable } from "@refinedev/antd";
import { Button, Space, Table, Tag } from "antd";
import type { Event } from "@/types/schedule";
import { RecurringCreateDrawer } from "@/components/schedule/RecurringCreateDrawer";

export default function EventsPage() {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const { tableProps } = useTable<Event>({
    resource: "schedule/events",
    syncWithLocation: true,
  });

  const getWeekdayName = (weekday: number) => {
    const days = [
      "Понедельник",
      "Вторник",
      "Среда",
      "Четверг",
      "Пятница",
      "Суббота",
      "Воскресенье",
    ];
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

  const humanizeTrainingSpec = (spec: string) => {
    switch (spec) {
      case "box":
        return "Бокс";
      case "thai":
        return "Тайский бокс";
      case "kickboxing":
        return "Кикбоксинг";
      case "mma":
        return "ММА";
      case "women_martial_arts":
        return "Женские единоборства";
      default:
        return "-";
    }
  };

  const humanizeTrainingType = (type: string) => {
    switch (type) {
      case "individual":
        return "Индивидуальная";
      case "group_adult":
        return "Групповая взрослые";
      case "group_child":
        return "Групповая детская";
      default:
        return "-";
    }
  };

  return (
    <List
      title={
        <Space>
          <CalendarOutlined />
          {"События"}
        </Space>
      }
      headerButtons={() => (
        <>
          <CreateButton
            icon={<PlusOutlined />}
            onClick={() => setDrawerVisible(true)}
          >
            Создать регулярную тренировку
          </CreateButton>

          <RecurringCreateDrawer
            drawerProps={{
              visible: Boolean(drawerVisible),
              onClose: () => setDrawerVisible(false),
            }}
          />
        </>
      )}
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="type"
          title="Тип"
          render={(value) => {
            return (
              <Tag color={value === "recurring" ? "blue" : "cyan"}>
                {value === "recurring" ? "Регулярное" : "Разовое"}
              </Tag>
            );
          }}
        />

        <Table.Column
          dataIndex="training_type"
          title="Тип тренировки"
          render={(value) => (
            <Tag color={getTrainingTypeColor(value)}>
              {humanizeTrainingType(value)}
            </Tag>
          )}
        />

        <Table.Column
          dataIndex="training_spec"
          title="Специализация"
          render={(value) => (
            <span style={{ textTransform: "uppercase" }}>
              {humanizeTrainingSpec(value)}
            </span>
          )}
        />

        <Table.Column
          title="Тренер"
          render={(_, record: Event) => (
            <Space>
              <UserOutlined />
              <span>{record.trainer.short_name}</span>
            </Space>
          )}
        />

        <Table.Column
          title="Расписание"
          render={(_, record: Event) => (
            <Space direction="vertical" size={0}>
              {record.type === "recurring" && record.weekday !== undefined && (
                <Space>
                  <CalendarOutlined />
                  <span>{getWeekdayName(record.weekday)}</span>
                </Space>
              )}
              <Space>
                <ClockCircleOutlined />
                {record.type === "recurring" ? (
                  <>
                    {record.start_time}
                    {" - "}
                    {record.end_time}
                  </>
                ) : (
                  <>
                    <DateField
                      format="DD.MM.YYYY HH:mm"
                      value={record.start_at}
                    />
                    {" - "}
                    <DateField
                      format="DD.MM.YYYY HH:mm"
                      value={record.end_at}
                    />
                  </>
                )}
              </Space>
            </Space>
          )}
        />

        <Table.Column
          dataIndex="clients_cap"
          title="Вместимость"
          render={(value) => (
            <Tag icon={<TeamOutlined />} color="purple">
              {value}
            </Tag>
          )}
        />

        <Table.Column
          title="Действия"
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
