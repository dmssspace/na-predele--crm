"use client";

import { humanizeBlogCategoryTitle } from "@lib/format/humanize";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import MDEditor from "@uiw/react-md-editor";
import { Form, Input, Select } from "antd";

export default function BlogPostEdit() {
  const { formProps, saveButtonProps } = useForm({});

  const handleFinish = (values: any) => {
    const transformedValues = {
      ...values,
      attached_categories: Array.isArray(values.attached_categories)
        ? values.attached_categories
        : [values.attached_categories],
    };
    return formProps.onFinish?.(transformedValues);
  };

  const { selectProps: categorySelectProps } = useSelect({
    resource: "blog/categories",
    optionLabel: "title",
    optionValue: "id",
  });

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label={"Заголовок"}
          name={["title"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"Содержание"}
          name="body"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <MDEditor data-color-mode="light" />
        </Form.Item>
        <Form.Item
          label={"Категория"}
          name="attached_categories"
          initialValue={formProps?.initialValues?.categories?.[0]?.id}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            {...categorySelectProps}
            optionRender={({ label }) => {
              return humanizeBlogCategoryTitle(label?.toString() || "-");
            }}
            labelRender={({ label }) => {
              return humanizeBlogCategoryTitle(label?.toString() || "-");
            }}
          />
        </Form.Item>
        <Form.Item
          label={"Тип поста"}
          name={["type"]}
          initialValue={"post"}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            defaultValue={"post"}
            options={[
              { value: "post", label: "Пост" },
              { value: "video", label: "Видеопост" },
              { value: "gallery", label: "Пост-галлерея" },
            ]}
            style={{ width: 120 }}
          />
        </Form.Item>
      </Form>
    </Edit>
  );
}
