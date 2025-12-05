"use client";

import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, DatePicker } from "antd";
import dayjs from "dayjs";
import { useMemo } from "react";

export default function CustomerEdit() {
  const { formProps, saveButtonProps, query } = useForm({
    resource: "customers",
    action: "edit",
    submitOnEnter: true,
    successNotification: {
      message: "Клиент успешно обновлен",
      type: "success",
    },
    errorNotification: {
      message: "Ошибка при обновлении клиента",
      type: "error",
    },
  });

  const { data, isLoading } = query;

  const modifiedFormProps = useMemo(
    () => {
      let firstName = "";
      let lastName = "";
      let middleName = "";

      if (data?.data?.full_name) {
        const nameParts = data.data.full_name.trim().split(/\s+/);
        if (nameParts.length === 2) {
          firstName = nameParts[0] || "";
          lastName = nameParts[1] || "";
        } else {
          firstName = nameParts[0] || "";
          middleName = nameParts[1] || "";
          lastName = nameParts[2] || "";
        }
      }

      return {
        ...formProps,
        initialValues: data?.data
          ? {
              first_name: firstName,
              last_name: lastName,
              middle_name: middleName === "" ? undefined : middleName,
              birth_date: data.data.birth_date ? dayjs(data.data.birth_date) : undefined,
              gender: data.data.gender || "male",
              avatar_media_uuid: data.data.avatar_media_uuid,
            }
          : {},
        onFinish: async (values: any) => {
          const formattedValues = {
            ...values,
            birth_date: values.birth_date
              ? dayjs(values.birth_date).format("DD.MM.YYYY")
              : undefined,
          };

          try {
            await formProps.onFinish?.(formattedValues);
          } catch (error) {
            console.error("Update failed:", error);
          }
        },
      };
    },
    [formProps, data]
  );

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={isLoading}>
      <Form {...modifiedFormProps} layout="vertical">
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
            options={[
              { value: "male", label: "Мужской" },
              { value: "female", label: "Женский" },
            ]}
            style={{ width: 120 }}
          />
        </Form.Item>
        <Form.Item
          label={"Изображение профиля"}
          name={["avatar_media_uuid"]}
          rules={[
            {
              // required: true, // TODO:...
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Edit>
  );
}