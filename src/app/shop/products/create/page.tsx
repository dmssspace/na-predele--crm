"use client";

import { Create, useForm } from "@refinedev/antd";
import MDEditor from "@uiw/react-md-editor";
import { Form, Input, Space, Typography } from "antd";
import { useState, useEffect } from "react";
import { MediaSelector } from "@components/media/MediaSelector";

const { Text } = Typography;

export default function ShopProductCreate() {
  const { formProps, saveButtonProps, form } = useForm({
    resource: "shop/products",
    onMutationSuccess: () => {
      form?.resetFields();
    },
  });
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);

  const modifiedFormProps = {
    ...formProps,
    onFinish: async (values: any) => {
      const formattedValues = {
        title: values.title,
        price: values.price ? parseFloat(values.price) : undefined,
        discount_percent: values.discount_percent
          ? parseFloat(values.discount_percent)
          : undefined,
        description: values.description,
        attached_media:
          values.attached_media_ids?.map((mediaId: string, index: number) => ({
            media_id: mediaId,
            role: index === 0 ? "cover" : "gallery",
            sort_order: index,
          })) || [],
      };

      await formProps.onFinish?.(formattedValues);
    },
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
    <Create saveButtonProps={saveButtonProps}>
      <Form {...modifiedFormProps} layout="vertical">
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
          name={["description"]}
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
        <Form.Item
          label={"Изображения товара"}
          name="attached_media_ids"
          tooltip="Выберите изображения товара из медиа-библиотеки"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <MediaSelector
            multiple={true}
            accept="image"
            buttonText="Выбрать изображения товара"
          />
        </Form.Item>
      </Form>
    </Create>
  );
}
