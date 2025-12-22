"use client";

import { humanizeBlogCategoryTitle } from "@lib/format/humanize";
import { Create, useForm, useSelect } from "@refinedev/antd";
import MDEditor from "@uiw/react-md-editor";
import { Form, Input, Select, Upload, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export default function BlogPostCreate() {
  const { formProps, saveButtonProps } = useForm({});
  const form = formProps.form;
  const postType = Form.useWatch("type", form);

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const { selectProps: categorySelectProps } = useSelect({
    resource: "blog/categories",
    optionLabel: "title",
    optionValue: "id",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
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

        {postType === "video" && (
          <Form.Item
            label={"Видео (URL)"}
            name={["video_url"]}
            rules={[{ required: true }]}
          >
            <Input placeholder={"https://youtube.com/..."} />
          </Form.Item>
        )}

        {postType === "gallery" && (
          <Form.Item
            label={"Галерея"}
            name={"gallery"}
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true }]}
          >
            <Upload listType="picture-card" multiple beforeUpload={() => false}>
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Загрузить</div>
              </div>
            </Upload>
          </Form.Item>
        )}

        {postType === "post" && (
          <Form.Item
            label={"Изображение"}
            name={"cover_image"}
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true }]}
          >
            <Upload listType="picture" beforeUpload={() => false} maxCount={1}>
              <Button>Загрузить изображение</Button>
            </Upload>
          </Form.Item>
        )}
      </Form>
    </Create>
  );
}
