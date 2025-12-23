"use client";

import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";
import { MediaSelector } from "@components/media/MediaSelector";

export default function UserEdit() {
  const { formProps, saveButtonProps, queryResult } = useForm({});
  const userData = queryResult?.data?.data;

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Введите email" },
            { type: "email", message: "Некорректный email" },
          ]}
        >
          <Input placeholder="user@example.com" />
        </Form.Item>

        <Form.Item
          label="Полное имя"
          name="full_name"
          rules={[{ required: true, message: "Введите полное имя" }]}
        >
          <Input placeholder="Иван Иванов" />
        </Form.Item>

        <Form.Item
          label="Номер телефона"
          name="phone_number"
          rules={[{ required: false }]}
        >
          <Input placeholder="+7 (999) 123-45-67" />
        </Form.Item>

        <Form.Item
          label="Роль"
          name="role"
          rules={[{ required: true, message: "Выберите роль" }]}
        >
          <Select
            options={[
              { value: "admin", label: "Администратор" },
              { value: "moderator", label: "Модератор" },
              { value: "trainer", label: "Тренер" },
              { value: "customer", label: "Клиент" },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Аватар"
          name="avatar_media_id"
          tooltip="Выберите изображение для аватара из медиа-библиотеки"
        >
          <MediaSelector
            multiple={false}
            accept="image/*"
            buttonText="Выбрать аватар"
          />
        </Form.Item>
      </Form>
    </Edit>
  );
}