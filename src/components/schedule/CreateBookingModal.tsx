"use client";

import React, { useState } from "react";
import { Modal, Form, Select, Button, message, Spin } from "antd";
import { customersApi, scheduleApi } from "@/lib/api/schedule";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Props = {
  sessionId?: string | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function CreateBookingModal({
  sessionId,
  open,
  onClose,
  onSuccess,
}: Props) {
  const [form] = Form.useForm();
  const [options, setOptions] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [isSearching, setIsSearching] = useState(false);

  const queryClient = useQueryClient();

  const bookMutation = useMutation({
    mutationFn: (customerId: string) =>
      scheduleApi.bookSession(sessionId!, { customer_id: customerId }),
    onSuccess: () => {
      message.success("Запись создана");
      queryClient.invalidateQueries({
        queryKey: ["sessionBookings", sessionId],
      });
      onSuccess && onSuccess();
      form.resetFields();
      onClose();
    },
    onError: (err: any) => {
      message.error(err?.response?.data?.error || "Ошибка при создании записи");
    },
  });

  const handleSearch = async (value: string) => {
    if (!value || value.length < 2) {
      setOptions([]);
      return;
    }

    setIsSearching(true);
    try {
      const res = await customersApi.searchCustomers(value);
      const opts = (res.data || []).map((c: any) => ({
        label: c.full_name,
        value: c.id,
      }));
      setOptions(opts);
    } catch (e) {
      setOptions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFinish = (values: any) => {
    if (!sessionId) return message.error("Сессия не выбрана");
    const customerId = values.customer_id;
    if (!customerId) return message.warning("Выберите клиента");
    bookMutation.mutate(customerId);
  };

  return (
    <Modal
      title="Добавить запись"
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="customer_id"
          label="Клиент"
          rules={[{ required: true, message: "Выберите клиента" }]}
        >
          <Select
            showSearch
            placeholder="Поиск по имени, телефону или email"
            onSearch={handleSearch}
            options={options}
            filterOption={false}
            notFoundContent={isSearching ? <Spin size="small" /> : null}
            allowClear
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={bookMutation.status === "pending"}
            block
          >
            Создать запись
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
