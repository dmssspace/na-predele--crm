"use client";

import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { humanizeBlogCategoryTitle } from "@lib/format/humanize";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import MDEditor from "@uiw/react-md-editor";
import { Button, Form, Input, Select, Space, Typography } from "antd";
import { useEffect, useState } from "react";

const { Text } = Typography;

export default function BlogPostEdit() {
  const { formProps, saveButtonProps, query, form } = useForm({});
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);

  const handleFinish = (values: any) => {
    const transformedValues = {
      ...values,
      price: values.price ? parseFloat(values.price) : undefined,
      discount_percent: values.discount_percent
        ? parseFloat(values.discount_percent)
        : undefined,
    };
    return formProps.onFinish?.(transformedValues);
  };

  useEffect(() => {
    const price = form?.getFieldValue("price");
    const discount = form?.getFieldValue("discount_percent");

    if (price && !isNaN(price)) {
      const priceNum = parseFloat(price);
      const discountNum =
        discount && !isNaN(discount) ? parseFloat(discount) : 0;
      const calculated = priceNum * (1 - discountNum / 100);
      setDiscountedPrice(calculated);
    } else {
      setDiscountedPrice(null);
    }
  }, [form]);

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label={"Наименование"}
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
          label={"Описание"}
          name="description"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <MDEditor data-color-mode="light" />
        </Form.Item>
        <Form.Item
          label={"Цена"}
          name={["price"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input
            type="number"
            onChange={() => {
              const price = form?.getFieldValue("price");
              const discount = form?.getFieldValue("discount_percent");
              if (price && !isNaN(price)) {
                const priceNum = parseFloat(price);
                const discountNum =
                  discount && !isNaN(discount) ? parseFloat(discount) : 0;
                setDiscountedPrice(priceNum * (1 - discountNum / 100));
              } else {
                setDiscountedPrice(null);
              }
            }}
          />
        </Form.Item>
        <Form.Item
          label={"Скидка (процент)"}
          name={["discount_percent"]}
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input
            type="number"
            onChange={() => {
              const price = form?.getFieldValue("price");
              const discount = form?.getFieldValue("discount_percent");
              if (price && !isNaN(price)) {
                const priceNum = parseFloat(price);
                const discountNum =
                  discount && !isNaN(discount) ? parseFloat(discount) : 0;
                setDiscountedPrice(priceNum * (1 - discountNum / 100));
              } else {
                setDiscountedPrice(null);
              }
            }}
          />
        </Form.Item>
        {discountedPrice !== null && (
          <Space direction="vertical" style={{ marginBottom: 16 }}>
            <Text strong style={{ fontSize: 14 }}>
              Рассчитанная цена:
            </Text>
            <Text style={{ fontSize: 14, color: "#52c41a" }}>
              {discountedPrice.toFixed(2)} руб.
            </Text>
          </Space>
        )}
        <Form.Item label={"Прикрепленные изображения (UUID)"}>
          <Form.List name="attached_media">
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
                      rules={[
                        { required: true, message: "Введите UUID изображения" },
                      ]}
                      style={{ marginBottom: 0 }}
                    >
                      <Input
                        placeholder="UUID изображения"
                        style={{ width: 400 }}
                      />
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
                    Добавить изображение
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>
      </Form>
    </Edit>
  );
}
