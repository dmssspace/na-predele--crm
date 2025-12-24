"use client";

import React from "react";
import {
  BookOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { List, useTable } from "@refinedev/antd";
import { useInvalidate, useNotification } from "@refinedev/core";
import { Button, DatePicker, Form, Select, Space, Table, Tag } from "antd";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { useTranslations } from "next-intl";
import type { Booking } from "@/types/schedule";
import { scheduleApi } from "@/lib/api/schedule";

const { RangePicker } = DatePicker;

export default function BookingsPage() {
  const t = useTranslations("schedule.bookings");
  const invalidate = useInvalidate();
  const { open } = useNotification();
  const [form] = Form.useForm();

  const { tableProps, searchFormProps, filters } = useTable<Booking>({
    resource: "schedule/bookings",
    syncWithLocation: true,
    onSearch: (values: any) => {
      const filters: any[] = [];

      if (values.status) {
        filters.push({
          field: "status",
          operator: "eq" as const,
          value: values.status,
        });
      }

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

  const handleRegisterVisit = async (bookingId: string) => {
    try {
      await scheduleApi.registerVisitFromBooking(bookingId);
      open?.({
        type: "success",
        message: t("visitRegistered"),
      });
      invalidate({ resource: "bookings", invalidates: ["list"] });
    } catch (error) {
      open?.({
        type: "error",
        message: t("visitError"),
      });
    }
  };

  const handleCancel = async (bookingId: string) => {
    try {
      await scheduleApi.cancelBooking(bookingId, { canceled_by: "user" });
      open?.({
        type: "success",
        message: t("cancelSuccess"),
      });
      invalidate({ resource: "bookings", invalidates: ["list"] });
    } catch (error) {
      open?.({
        type: "error",
        message: t("cancelError"),
      });
    }
  };

  return (
    <List
      title={
        <Space>
          <BookOutlined />
          {t("title", { default: "Бронирования" })}
        </Space>
      }
    >
      <Form
        {...searchFormProps}
        form={form}
        layout="inline"
        style={{ marginBottom: 16 }}
      >
        <Form.Item name="status">
          <Select
            allowClear
            placeholder={t("filters.status")}
            style={{ width: 200 }}
          >
            <Select.Option value="requested">Запрошено</Select.Option>
            <Select.Option value="confirmed">Подтверждено</Select.Option>
            <Select.Option value="canceled">Отменено</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="dateRange">
          <RangePicker
            placeholder={[t("filters.dateFrom"), t("filters.dateTo")]}
            format="DD.MM.YYYY"
          />
        </Form.Item>

        <Form.Item>
          <Button htmlType="submit" type="primary">
            Фильтр
          </Button>
        </Form.Item>
      </Form>

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
          render={(value, record: Booking) => (
            <div>
              <div>
                {format(parseISO(value), "dd.MM.yyyy HH:mm", { locale: ru })}
              </div>
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
          dataIndex="status"
          title={t("table.status")}
          render={(value) => {
            const colors: Record<string, string> = {
              confirmed: "success",
              requested: "warning",
              canceled: "error",
            };
            return <Tag color={colors[value] || "default"}>{value}</Tag>;
          }}
        />

        <Table.Column
          dataIndex="has_ticket"
          title={t("table.ticket")}
          render={(value) =>
            value ? (
              <Tag icon={<CheckCircleOutlined />} color="success">
                Есть
              </Tag>
            ) : (
              <Tag icon={<CloseCircleOutlined />} color="error">
                Нет
              </Tag>
            )
          }
        />

        <Table.Column
          title={t("table.actions")}
          render={(_, record: Booking) => (
            <Space>
              {record.status !== "canceled" && (
                <>
                  <Button
                    type="primary"
                    size="small"
                    icon={<CheckCircleOutlined />}
                    onClick={() => handleRegisterVisit(record.id)}
                  >
                    Посещение
                  </Button>
                  <Button
                    danger
                    size="small"
                    icon={<CloseCircleOutlined />}
                    onClick={() => handleCancel(record.id)}
                  >
                    Отменить
                  </Button>
                </>
              )}
            </Space>
          )}
        />
      </Table>
    </List>
  );
}
