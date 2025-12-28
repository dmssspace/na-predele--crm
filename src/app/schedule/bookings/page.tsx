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
import type { Booking } from "@/types/schedule";
import { scheduleApi } from "@/lib/api/schedule";

const { RangePicker } = DatePicker;


export default function BookingsPage() {
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
        message: "Посещение зарегистрирован",
      });
      invalidate({ resource: "bookings", invalidates: ["list"] });
    } catch (error) {
      open?.({
        type: "error",
        message: "Ошибка при регистрации посещения",
      });
    }
  };

  const handleCancel = async (bookingId: string) => {
    try {
      await scheduleApi.cancelBooking(bookingId, { canceled_by: "user" });
      open?.({
        type: "success",
        message: "Бронирование отменено",
      });
      invalidate({ resource: "bookings", invalidates: ["list"] });
    } catch (error) {
      open?.({
        type: "error",
        message: "Ошибка при отмене бронированияы",
      });
    }
  };

  return (
    <List
      title={
        <Space>
          <BookOutlined />
          {"Бронирования"}
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
          <Select allowClear placeholder="Статус" style={{ width: 200 }}>
            <Select.Option value="requested">Запрошено</Select.Option>
            <Select.Option value="confirmed">Подтверждено</Select.Option>
            <Select.Option value="canceled">Отменено</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="dateRange">
          <RangePicker
            placeholder={["Дата с", "Дата по"]}
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
{/* //
//     "data": [
//         {
//             "id": "49a281fe-a233-4461-ad06-05222bcbd113",
//             "session_id": "0cc82c7a-e910-4650-a745-3cdd5df50207",
//             "customer_id": "cc229bea-ab73-4da3-8c6a-b75eadfa50bf",
//             "status": "confirmed",
//             "created_at": "2025-12-26T21:39:46.192068Z",
//             "updated_at": "2025-12-26T21:39:46.192068Z",
//             "session": {
//                 "id": "0cc82c7a-e910-4650-a745-3cdd5df50207",
//                 "start_at": "2025-12-28T10:45:00Z",
//                 "end_at": "2025-12-28T11:45:00Z",
//                 "status": "scheduled"
//             }
//         }
//     ],
//     "pagination": {
//         "total": 1,
//         "per_page": 10,
//         "page": 1,
//         "last_page": 1
//     },
//     "status": "success"
// } */}


        {/* <Table.Column
          dataIndex="session_date"
          title="Сессия"
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
        /> */}

        {/* <Table.Column dataIndex="session_trainer_name" title="Тренер" /> */}

        <Table.Column
          dataIndex="status"
          title="Статус"
          render={(value) => {
            const colors: Record<string, string> = {
              confirmed: "success",
              requested: "warning",
              canceled: "error",
            };

            const humanReadableStatus: Record<string, string> = {
              confirmed: "Подтверждено",
              requested: "Запрошено",
              canceled: "Отменено",
            };

            return <Tag color={colors[value] || "default"}>{humanReadableStatus[value]}</Tag>;
          }}
        />

        <Table.Column />

        <Table.Column
          title="Действия"
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
