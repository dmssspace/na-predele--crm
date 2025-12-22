"use client";

import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select, DatePicker } from "antd";
import dayjs from "dayjs";
import { useMemo } from "react";

export default function BlogPostCreate() {
  const { formProps, saveButtonProps } = useForm({
    resource: "auth/register-customer",
    action: "create",
    submitOnEnter: true,
    onMutationSuccess: () => {
      formProps.form?.resetFields();
    },
    successNotification: {
      message: "Клиент успешно зарегистрирован",
      type: "success",
    },
    errorNotification: {
      message: "Ошибка при регистрации клиента",
      type: "error",
    },
  });

  const modifiedFormProps = useMemo(
    () => ({
      ...formProps,
      initialValues: {
        gender: "male",
      },
      onFinish: async (values: any) => {
        // Note: форматируем дату в DD.MM.YYYY
        const formattedValues = {
          ...values,
          birth_date: values.birth_date
            ? dayjs(values.birth_date).format("DD.MM.YYYY")
            : undefined,
        };

        try {
          await formProps.onFinish?.(formattedValues);
        } catch (error) {
          console.error("Registration failed:", error);
        }
      },
    }),
    [formProps]
  );

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...modifiedFormProps} layout="vertical">
        <Form.Item
          label={"Электронная почта"}
          name={["email"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"Номер телефона"}
          name={["phone_number"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"Фамилия"}
          name={["last_name"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"Имя"}
          name={["first_name"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label={"Отчество"} name={["middle_name"]} rules={[{}]}>
          <Input />
        </Form.Item>
        <Form.Item
          label={"Дата рождения"}
          name={["birth_date"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <DatePicker maxDate={dayjs()} />
        </Form.Item>
        <Form.Item
          label={"Пол"}
          name={["gender"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            defaultValue={"male"}
            options={[
              { value: "male", label: "Мужской" },
              { value: "female", label: "Женский" },
            ]}
            style={{ width: 120 }}
          />
        </Form.Item>
        <Form.Item
          label={"Изображение профиля"}
          name={["avatar_media_id"]}
          rules={[
            {
              // required: true, // TODO:...
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Create>
  );
}
