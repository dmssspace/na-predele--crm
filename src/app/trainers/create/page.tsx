"use client";

import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Create, useForm } from "@refinedev/antd";
import MDEditor from "@uiw/react-md-editor";
import { Form, Input, Select, DatePicker, Space, Button } from "antd";
import dayjs from "dayjs";
import { useMemo } from "react";
import { CombinedMediaPicker } from "@/components/media";
import { PhoneInput } from "@/components/phone-input";

export default function BlogPostCreate() {
  const { formProps, saveButtonProps } = useForm({
    resource: "auth/register-trainer",
    action: "create",
    submitOnEnter: true,
    onMutationSuccess: () => {
      formProps.form?.resetFields();
    },
    successNotification: {
      message: "Тренер успешно зарегистрирован",
      type: "success",
    },
    errorNotification: {
      message: "Ошибка при регистрации тренера",
      type: "error",
    },
  });

  const modifiedFormProps = useMemo(
    () => ({
      ...formProps,
      initialValues: {
        gender: "male",
        spec: "box",
      },
      onFinish: async (values: any) => {
        // Note: форматируем дату в DD.MM.YYYY
        const formattedValues = {
          ...values,
          birth_date: values.birth_date
            ? dayjs(values.birth_date).format("DD.MM.YYYY")
            : undefined,
          training_exp_start_on: values.training_exp_start_on
            ? dayjs(values.training_exp_start_on).format("DD.MM.YYYY")
            : undefined,
          // Преобразовываем массив в строку для media ID
          avatar_media_id: Array.isArray(values.avatar_media_id)
            ? values.avatar_media_id[0]
            : values.avatar_media_id,
          intro_media_id: Array.isArray(values.intro_media_id)
            ? values.intro_media_id[0]
            : values.intro_media_id,
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
          <PhoneInput />
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
          label={"Направление"}
          name={["spec"]}
          rules={[
            {
              required: true,
            },
          ]}
          style={{ width: 240 }}
        >
          <Select
            defaultValue={"box"}
            options={[
              { value: "box", label: "Бокс" },
              { value: "thai", label: "Тайский бокс" },
              { value: "kickboxing", label: "Кикбоксинг" },
              { value: "mma", label: "ММА" },
              { value: "women_martial_arts", label: "Женские единоборства" },
            ]}
          />
        </Form.Item>
        <Form.Item
          label={"Дата начала тренерской деятельности"}
          name={["training_exp_start_on"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <DatePicker maxDate={dayjs()} />
        </Form.Item>
        <Form.Item
          label={"Регалии"}
          name={["regalia"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Form.List name="regalia">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name]}
                      rules={[{ required: true, message: "Введите регалию" }]}
                      style={{ marginBottom: 0 }}
                    >
                      <Input placeholder="Регалия" style={{ width: 400 }} />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Добавить регалию
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>
        <Form.Item
          label={"Описание особенностей подхода"}
          name={["approach"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <MDEditor data-color-mode="light" />
        </Form.Item>
        <Form.Item
          label={"Изображение профиля"}
          name={["avatar_media_id"]}
          rules={[
            {
              required: true,
              message: "Выберите изображение профиля",
            },
          ]}
          tooltip="Выберите фото тренера для профиля"
        >
          <CombinedMediaPicker
            multiple={false}
            accept="image/*"
            maxSize={5}
            uploaderMode="picture-card"
          />
        </Form.Item>
        <Form.Item
          label={"Видео с представлением тренера"}
          name={["intro_media_id"]}
          rules={[
            {
              required: true,
              message: "Выберите видео-представление",
            },
          ]}
          tooltip="Выберите видео-представление тренера"
        >
          <CombinedMediaPicker
            multiple={false}
            accept="video/*"
            maxSize={100}
            uploaderMode="picture-card"
          />
        </Form.Item>
      </Form>
    </Create>
  );
}
