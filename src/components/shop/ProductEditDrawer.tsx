"use client";

import {
  ShoppingOutlined,
  DollarOutlined,
  PercentageOutlined,
  FileTextOutlined,
  PictureOutlined,
  StopOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { DateField } from "@refinedev/antd";
import { useUpdate, useCustomMutation } from "@refinedev/core";
import {
  Drawer,
  Flex,
  Form,
  Input,
  Spin,
  Typography,
  message,
  Image,
  Space,
  Card,
  Switch,
  Modal,
} from "antd";
import { useState, useEffect } from "react";
import { EditableField } from "@/components/customers/EditableField";
import { CombinedMediaPicker, MediaSelector } from "@/components/media";
import MDEditor from "@uiw/react-md-editor";

const { Title, Text } = Typography;

interface ProductEditDrawerProps {
  drawerProps: any;
  editQuery: any;
  formProps: any;
  id: any;
}

export const ProductEditDrawer = ({
  drawerProps,
  editQuery,
  formProps,
  id,
}: ProductEditDrawerProps) => {
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState("");
  const { mutate: updateProduct } = useUpdate();
  const { mutate: customMutate } = useCustomMutation();

  const handleSaveField = async (fieldName: string, value: any) => {
    try {
      await updateProduct(
        {
          resource: "shop/products",
          id: id!,
          values: { [fieldName]: value },
        },
        {
          onSuccess: () => {
            message.success("Поле успешно обновлено");
            setEditMode((prev) => ({ ...prev, [fieldName]: false }));
            editQuery.refetch();
          },
          onError: () => {
            message.error("Ошибка при обновлении поля");
          },
        }
      );
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleWithdrawToggle = async (checked: boolean) => {
    if (checked) {
      // Показываем модальное окно при попытке снять с продажи
      setWithdrawModalVisible(true);
    } else {
      // Возвращаем в продажу без модального окна
      await handleRestore();
    }
  };

  const handleWithdrawConfirm = async () => {
    try {
      await customMutate(
        {
          url: `/shop/products/${id}/withdraw`,
          method: "post",
          values: { reason: withdrawReason || "" },
        },
        {
          onSuccess: () => {
            message.success("Товар снят с продажи");
            setWithdrawModalVisible(false);
            setWithdrawReason("");
            editQuery.refetch();
          },
          onError: () => {
            message.error("Ошибка при снятии товара с продажи");
          },
        }
      );
    } catch (error) {
      console.error("Withdraw failed:", error);
    }
  };

  const handleRestore = async () => {
    try {
      await customMutate(
        {
          url: `/shop/products/${id}/restore`,
          method: "post",
          values: {},
        },
        {
          onSuccess: () => {
            message.success("Товар возвращен в продажу");
            editQuery.refetch();
          },
          onError: () => {
            message.error("Ошибка при возврате товара в продажу");
          },
        }
      );
    } catch (error) {
      console.error("Restore failed:", error);
    }
  };

  const handleCancelEdit = (fieldName: string) => {
    setEditMode((prev) => ({ ...prev, [fieldName]: false }));
  };

  const productData = editQuery?.data?.data;
  const discountedPrice =
    productData?.price && productData?.discount_percent
      ? productData.price * (1 - productData.discount_percent / 100)
      : productData?.price;

  // Устанавливаем значения медиа при входе в режим редактирования
  useEffect(() => {
    if (editMode.attached_media && productData?.media) {
      const mediaIds = productData.media.map((m: any) => m.id);
      formProps.form?.setFieldsValue({ attached_media_ids: mediaIds });
    }
  }, [editMode.attached_media, formProps.form, productData.media]);

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
      <Spin spinning={editQuery?.isFetching}>
        <Flex align="center" gap={16} style={{ marginBottom: 24 }}>
          {productData?.image_url && (
            <Image
              src={productData.image_url}
              alt={productData.title}
              width={80}
              height={80}
              style={{ objectFit: "cover", borderRadius: 8 }}
            />
          )}
          <Title level={3} style={{ margin: 0 }}>
            {productData?.title || "Товар"}
          </Title>
        </Flex>

        <Flex vertical gap={24} style={{ marginTop: "16px" }}>
          <Form {...formProps} layout="vertical">
            <EditableField
              icon={<ShoppingOutlined />}
              label="Наименование"
              fieldKey="title"
              isEditing={editMode.title}
              onToggleEdit={() =>
                setEditMode((prev) => ({
                  ...prev,
                  title: !prev.title,
                }))
              }
              onSave={async () => {
                const title = formProps.form?.getFieldValue("title");
                await handleSaveField("title", title);
              }}
              onCancel={() => handleCancelEdit("title")}
              displayValue={<Text>{productData?.title || "-"}</Text>}
              editComponent={
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
                  <Input placeholder="Наименование" />
                </Form.Item>
              }
            />

            <EditableField
              icon={<FileTextOutlined />}
              label="Описание"
              fieldKey="description"
              isEditing={editMode.description}
              onToggleEdit={() =>
                setEditMode((prev) => ({
                  ...prev,
                  description: !prev.description,
                }))
              }
              onSave={async () => {
                const description =
                  formProps.form?.getFieldValue("description");
                await handleSaveField("description", description);
              }}
              onCancel={() => handleCancelEdit("description")}
              displayValue={
                <div
                  style={{
                    maxHeight: "200px",
                    overflow: "auto",
                  }}
                >
                  {productData?.description ? (
                    <MDEditor.Markdown
                      source={productData.description}
                      style={{ whiteSpace: "pre-wrap" }}
                    />
                  ) : (
                    <Text type="secondary">-</Text>
                  )}
                </div>
              }
              editComponent={
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
              }
            />

            <Flex gap={8}>
              <EditableField
                icon={<DollarOutlined />}
                label="Цена"
                fieldKey="price"
                isEditing={editMode.price}
                onToggleEdit={() =>
                  setEditMode((prev) => ({
                    ...prev,
                    price: !prev.price,
                  }))
                }
                onSave={async () => {
                  const price = formProps.form?.getFieldValue("price");
                  await handleSaveField("price", parseFloat(price));
                }}
                onCancel={() => handleCancelEdit("price")}
                displayValue={
                  <Text>
                    {productData?.price ? `${productData.price} руб.` : "-"}
                  </Text>
                }
                editComponent={
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
                    <Input type="number" placeholder="Цена" />
                  </Form.Item>
                }
              />

              <EditableField
                icon={<PercentageOutlined />}
                label="Скидка (%)"
                fieldKey="discount_percent"
                isEditing={editMode.discount_percent}
                onToggleEdit={() =>
                  setEditMode((prev) => ({
                    ...prev,
                    discount_percent: !prev.discount_percent,
                  }))
                }
                onSave={async () => {
                  const discount =
                    formProps.form?.getFieldValue("discount_percent");
                  await handleSaveField(
                    "discount_percent",
                    discount ? parseFloat(discount) : 0
                  );
                }}
                onCancel={() => handleCancelEdit("discount_percent")}
                displayValue={
                  <Text>
                    {productData?.discount_percent
                      ? `${productData.discount_percent}%`
                      : "0%"}
                  </Text>
                }
                editComponent={
                  <Form.Item
                    name={["discount_percent"]}
                    style={{ marginBottom: 0 }}
                  >
                    <Input type="number" placeholder="Скидка (%)" />
                  </Form.Item>
                }
              />
            </Flex>

            {discountedPrice !== productData?.price && (
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

            <EditableField
              icon={<PictureOutlined />}
              label="Изображения товара"
              fieldKey="attached_media"
              isEditing={editMode.attached_media}
              onToggleEdit={() =>
                setEditMode((prev) => ({
                  ...prev,
                  attached_media: !prev.attached_media,
                }))
              }
              onSave={async () => {
                const mediaIds =
                  formProps.form?.getFieldValue("attached_media_ids");
                const attachedMedia =
                  mediaIds?.map((mediaId: string, index: number) => ({
                    media_id: mediaId,
                    role: index === 0 ? "cover" : "gallery",
                    sort_order: index,
                  })) || [];
                await handleSaveField("attached_media", attachedMedia);
              }}
              onCancel={() => handleCancelEdit("attached_media")}
              displayValue={
                productData?.gallery_url_list &&
                productData.gallery_url_list.length > 0 ? (
                  <Space wrap size={8}>
                    {productData.gallery_url_list.map(
                      (url: string, index: number) => (
                        <Image
                          key={index}
                          src={url}
                          alt={`Product image ${index + 1}`}
                          width={80}
                          height={80}
                          style={{ objectFit: "cover", borderRadius: 4 }}
                        />
                      )
                    )}
                  </Space>
                ) : (
                  <Text type="secondary">Изображения не загружены</Text>
                )
              }
              editComponent={
                <Form.Item
                  name="attached_media_ids"
                  style={{ marginBottom: 0 }}
                >
                  <CombinedMediaPicker multiple={true} accept="image" />
                </Form.Item>
              }
            />

            <Card
              size="small"
              style={{ backgroundColor: "#fff", marginBottom: 16 }}
            >
              <Flex justify="space-between" align="center">
                <Flex align="center" gap={8}>
                  <StopOutlined />
                  <Text strong>Снят с продажи</Text>
                </Flex>
                <Switch
                  checked={productData?.withdrawn || false}
                  onChange={handleWithdrawToggle}
                />
              </Flex>
            </Card>

            {productData?.withdrawn && (
              <Card size="small" style={{ marginBottom: 16 }}>
                <Flex vertical gap={8}>
                  <Text strong>Причина снятия с продажи:</Text>
                  <Text>{productData?.withdrawn_reason || "-"}</Text>
                </Flex>
              </Card>
            )}
          </Form>
        </Flex>

        <Flex vertical style={{ marginTop: 24 }}>
          <Text type="secondary">
            Создан:{" "}
            <DateField type="secondary" value={productData?.created_at} />
          </Text>
          <Text type="secondary">
            Обновлен:{" "}
            <DateField type="secondary" value={productData?.updated_at} />
          </Text>
          <Text type="secondary">ID: {productData?.id}</Text>
        </Flex>
      </Spin>

      <Modal
        title={
          <Flex align="center" gap={8}>
            <ExclamationCircleOutlined style={{ color: "#faad14" }} />
            <span>Снятие товара с продажи</span>
          </Flex>
        }
        open={withdrawModalVisible}
        onOk={handleWithdrawConfirm}
        onCancel={() => {
          setWithdrawModalVisible(false);
          setWithdrawReason("");
        }}
        okText="Снять с продажи"
        cancelText="Отмена"
        okButtonProps={{ danger: true }}
      >
        <Flex vertical gap={16} style={{ marginTop: 16 }}>
          <Text>Укажите причину снятия товара с продажи:</Text>
          <Input.TextArea
            value={withdrawReason}
            onChange={(e) => setWithdrawReason(e.target.value)}
            placeholder="Причина снятия с продажи"
            rows={4}
          />
        </Flex>
      </Modal>
    </Drawer>
  );
};
