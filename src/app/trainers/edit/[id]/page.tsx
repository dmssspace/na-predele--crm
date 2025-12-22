"use client";

import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select, DatePicker, Button, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useMemo } from "react";
import MDEditor from "@uiw/react-md-editor";

export default function TrainerProfileEdit() {
  const { formProps, saveButtonProps, query } = useForm({
    resource: "trainers",
    action: "edit",
    submitOnEnter: true,
    successNotification: {
      message: "Профиль тренера успешно обновлен",
      type: "success",
    },
    errorNotification: {
      message: "Ошибка при обновлении профиля тренера",
      type: "error",
    },
  });

  const data = query?.data;
  const isLoading = query?.isLoading;

  const modifiedFormProps = useMemo(() => {
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
            birth_date: data.data.birth_date
              ? dayjs(data.data.birth_date)
              : undefined,
            gender: data.data.gender || "male",
            avatar_media_id: "10dadc79-5963-4c35-baf9-cbdb19a14ff6", //data.data.avatar_media_id,
            intro_media_id: "b47a76bd-8461-46f6-a3c3-4c05da6186c4", //data.data.intro_media_id,
            spec: data.data.spec || "box",
            training_exp_start_on: data.data.training_exp_start_on
              ? dayjs(data.data.training_exp_start_on)
              : undefined,
            regalia: data.data.regalia || [],
            approach: data.data.approach || undefined,
          }
        : {},
      onFinish: async (values: any) => {
        const formattedValues = {
          ...values,
          birth_date: values.birth_date
            ? dayjs(values.birth_date).format("DD.MM.YYYY")
            : undefined,
          training_exp_start_on: values.training_exp_start_on
            ? dayjs(values.training_exp_start_on).format("DD.MM.YYYY")
            : undefined,
        };

        try {
          await formProps.onFinish?.(formattedValues);
        } catch (error) {
          console.error("Update failed:", error);
        }
      },
    };
  }, [formProps, data]);

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
          label={"Направление"}
          name={["spec"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            options={[
              { value: "box", label: "Бокс" },
              { value: "thai", label: "Тайский бокс" },
              { value: "kickboxing", label: "Кикбоксинг" },
              { value: "mma", label: "ММА" },
              { value: "women_martial_arts", label: "Женские единоборства" },
            ]}
            style={{ width: 240 }}
          />
        </Form.Item>
        <Form.Item
          label={"Дата начала практики тренера"}
          name={["training_exp_start_on"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <DatePicker maxDate={dayjs()} />
        </Form.Item>
        <Form.Item label={"Регалии"} rules={[{ required: true }]}>
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
              // required: true, // TODO:...
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"Изображение профиля"}
          name={["intro_media_id"]}
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
