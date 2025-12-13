"use client";

import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, Switch, Space, Button, InputNumber } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

export default function TicketPlanEdit() {
  const { formProps, saveButtonProps, query } = useForm({
    resource: "tickets/plans",
    action: "edit",
    submitOnEnter: true,
    successNotification: {
      message: "Абонемент успешно обновлен",
      type: "success",
    },
    errorNotification: {
      message: "Ошибка при обновлении абонемента",
      type: "error",
    },
  });

  const data = query?.data;
  const isLoading = query?.isLoading;

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={isLoading}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={"Название"}
          name={["name"]}
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите название абонемента",
            },
          ]}
        >
          <Input placeholder="Например: Базовый абонемент" />
        </Form.Item>

        <Form.Item
          label={"Описание"}
          name={["description"]}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Описание абонемента"
          />
        </Form.Item>

        <Form.Item
          label={"Тема оформления"}
          name={["metadata", "theme"]}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Select
            placeholder="Выберите цветовую тему"
            options={[
              { value: "default", label: "По умолчанию" },
              { value: "yellow", label: "Желтая" },
              { value: "accent", label: "Акцентная" },
            ]}
          />
        </Form.Item>
      </Form>
    </Edit>
  );
}
