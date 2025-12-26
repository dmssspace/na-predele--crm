"use client";

import React from "react";
import { Create } from "@refinedev/antd";
import { Button, Card, Form, Input, DatePicker, message, Space } from "antd";
import { useTranslations } from "next-intl";
import { scheduleApi } from "@/lib/api/schedule";
import { useRouter } from "next/navigation";
import type { CreateOnceEventRequest } from "@/types/schedule";

export default function CreateOnceEventPage() {
  const t = useTranslations("schedule.createEvent");
  const [form] = Form.useForm();
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    const payload: CreateOnceEventRequest = {
      trainer_id: values.trainer_id,
      customer_id: values.customer_id,
      start_time: values.start_time.toISOString(),
    };

    try {
      await scheduleApi.createOnceEvent(payload);
      message.success("Разовая тренировка успешно создана");
      router.push("/schedule/events");
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Ошибка при создании события");
    }
  };

  return (
    <Create title={<Space>Создать разовую тренировку</Space>} footerButtons={() => <></>}>
      <Card>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="trainer_id"
            label="Тренер"
            rules={[{ required: true, message: "Выберите тренера" }]}
          >
            <Input placeholder="ID тренера" />
          </Form.Item>

          <Form.Item name="customer_id" label="Клиент (опционально)">
            <Input placeholder="ID клиента" />
          </Form.Item>

          <Form.Item
            name="start_time"
            label="Дата и время"
            rules={[{ required: true, message: "Укажите дату и время" }]}
          >
            <DatePicker showTime style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Создать
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Create>
  );
}
