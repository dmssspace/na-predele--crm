"use client";

import {
  ShoppingOutlined,
  DollarOutlined,
  PercentageOutlined,
  FileTextOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import {
  Drawer,
  Flex,
  Form,
  Input,
  Spin,
  Typography,
  message,
  Card,
  Button,
  Space,
} from "antd";
import { useState, useEffect } from "react";
import { CombinedMediaPicker, MediaSelector } from "@/components/media";
import MDEditor from "@uiw/react-md-editor";

const { Title, Text } = Typography;

interface ProductCreateDrawerProps {
  drawerProps: any;
  formProps: any;
  saveButtonProps: any;
}

export const ProductCreateDrawer = ({
  drawerProps,
  formProps,
  saveButtonProps,
}: ProductCreateDrawerProps) => {
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
    const price = formProps.form?.getFieldValue("price");
    const discount = formProps.form?.getFieldValue("discount_percent");

    if (price && !isNaN(price)) {
      const priceNum = parseFloat(price);
      const discountNum =
        discount && !isNaN(discount) ? parseFloat(discount) : 0;
      const calculated = priceNum * (1 - discountNum / 100);
      setDiscountedPrice(calculated);
    } else {
      setDiscountedPrice(null);
    }
  }, [formProps.form]);

  const handlePriceChange = () => {
    const price = formProps.form?.getFieldValue("price");
    const discount = formProps.form?.getFieldValue("discount_percent");
    if (price && !isNaN(price)) {
      const priceNum = parseFloat(price);
      const discountNum =
        discount && !isNaN(discount) ? parseFloat(discount) : 0;
      setDiscountedPrice(priceNum * (1 - discountNum / 100));
    } else {
      setDiscountedPrice(null);
    }
  };

  return (
    <Drawer
      {...drawerProps}
      width={700}
      styles={{
        body: {
          backgroundColor: "#f5f5f5",
        },
      }}
    >
      <Flex align="center" gap={16} style={{ marginBottom: 24 }}>
        <ShoppingOutlined style={{ fontSize: 32 }} />
        <Title level={3} style={{ margin: 0 }}>
          Создание товара
        </Title>
      </Flex>

      <Form {...modifiedFormProps} layout="vertical">
        <Card
          size="small"
          title={
            <Flex align="center" gap={8}>
              <ShoppingOutlined />
              <Text strong>Наименование</Text>
            </Flex>
          }
          style={{ marginBottom: 16 }}
        >
          <Form.Item
            name={["title"]}
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите наименование",
              },
            ]}
            style={{ marginBottom: 0 }}
          >
            <Input placeholder="Наименование товара" />
          </Form.Item>
        </Card>

        <Card
          size="small"
          title={
            <Flex align="center" gap={8}>
              <FileTextOutlined />
              <Text strong>Описание</Text>
            </Flex>
          }
          style={{ marginBottom: 16 }}
        >
          <Form.Item
            name={["description"]}
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите описание",
              },
            ]}
            style={{ marginBottom: 0 }}
          >
            <MDEditor data-color-mode="light" height={300} />
          </Form.Item>
        </Card>

        <Flex gap={8} style={{ marginBottom: 16 }}>
          <Card
            size="small"
            title={
              <Flex align="center" gap={8}>
                <DollarOutlined />
                <Text strong>Цена</Text>
              </Flex>
            }
            style={{ flex: 1 }}
          >
            <Form.Item
              name={["price"]}
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите цену",
                },
              ]}
              style={{ marginBottom: 0 }}
            >
              <Input
                type="number"
                placeholder="Цена"
                suffix="руб."
                onChange={handlePriceChange}
              />
            </Form.Item>
          </Card>

          <Card
            size="small"
            title={
              <Flex align="center" gap={8}>
                <PercentageOutlined />
                <Text strong>Скидка (%)</Text>
              </Flex>
            }
            style={{ flex: 1 }}
          >
            <Form.Item name={["discount_percent"]} style={{ marginBottom: 0 }}>
              <Input
                type="number"
                placeholder="Скидка"
                suffix="%"
                onChange={handlePriceChange}
              />
            </Form.Item>
          </Card>
        </Flex>

        {discountedPrice !== null &&
          discountedPrice !== formProps.form?.getFieldValue("price") && (
            <Card
              size="small"
              style={{ backgroundColor: "#f0f9ff", marginBottom: 16 }}
            >
              <Flex justify="space-between" align="center">
                <Text strong>Цена со скидкой:</Text>
                <Text strong style={{ fontSize: 16, color: "#52c41a" }}>
                  {discountedPrice?.toFixed(2)} руб.
                </Text>
              </Flex>
            </Card>
          )}

        <Card
          size="small"
          title={
            <Flex align="center" gap={8}>
              <PictureOutlined />
              <Text strong>Изображения товара</Text>
            </Flex>
          }
          style={{ marginBottom: 16 }}
        >
          <Form.Item
            name="attached_media_ids"
            tooltip="Выберите изображения товара из медиа-библиотеки"
            rules={[
              {
                required: true,
                message: "Пожалуйста, выберите хотя бы одно изображение",
              },
            ]}
            style={{ marginBottom: 0 }}
          >
            <CombinedMediaPicker multiple={true} accept="image" />
          </Form.Item>
        </Card>

        <Flex justify="flex-end" gap={8} style={{ marginTop: 24 }}>
          <Button onClick={() => drawerProps.onClose?.()}>Отмена</Button>
          <Button type="primary" {...saveButtonProps}>
            Создать товар
          </Button>
        </Flex>
      </Form>
    </Drawer>
  );
};
