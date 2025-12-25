"use client";

import {
  FileOutlined,
  UserOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { DateField } from "@refinedev/antd";
import { useUpdate } from "@refinedev/core";
import {
  Drawer,
  Flex,
  Form,
  Input,
  Spin,
  Typography,
  message,
  Image,
  Tag,
  Descriptions,
} from "antd";
import { useState } from "react";
import { EditableField } from "@/components/customers/EditableField";

const { Title, Text } = Typography;

interface MediaEditDrawerProps {
  drawerProps: any;
  editQuery: any;
  formProps: any;
  id: any;
}

export const MediaEditDrawer = ({
  drawerProps,
  editQuery,
  formProps,
  id,
}: MediaEditDrawerProps) => {
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  const { mutate: updateMedia } = useUpdate();

  const handleSaveField = async (fieldName: string, value: any) => {
    try {
      await updateMedia(
        {
          resource: "media",
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

  const handleCancelEdit = (fieldName: string) => {
    setEditMode((prev) => ({ ...prev, [fieldName]: false }));
  };

  const mediaData = editQuery?.data?.data;

  const humanizeStatus = (status: string): string => {
    if (status === "pending") return "Обрабатывается";
    if (status === "ready") return "Загружен";
    if (status === "failed") return "Ошибка обработки";
    return "-";
  };

  const humanizeType = (type: string): string => {
    if (type === "image") return "Изображение";
    if (type === "file") return "Файл";
    if (type === "video") return "Видео";
    return "-";
  };

  const getStatusColor = (status: string): string => {
    if (status === "pending") return "yellow";
    if (status === "ready") return "green";
    if (status === "failed") return "red";
    return "blue";
  };

  const renderMetadata = (metadata: any) => {
    if (!metadata) return <Text type="secondary">-</Text>;

    let parsed: any = metadata;
    if (typeof parsed === "string") {
      try {
        parsed = JSON.parse(parsed);
      } catch (e) {
        return <Text>{String(parsed)}</Text>;
      }
    }

    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return (
        <Descriptions column={1} bordered size="small">
          {Object.entries(parsed).map(([key, value]) => (
            <Descriptions.Item label={key} key={key}>
              {value && typeof value === "object" ? (
                <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                  {JSON.stringify(value, null, 2)}
                </pre>
              ) : (
                String(value)
              )}
            </Descriptions.Item>
          ))}
        </Descriptions>
      );
    }

    if (Array.isArray(parsed) || typeof parsed === "object") {
      return (
        <pre
          style={{
            whiteSpace: "pre-wrap",
            background: "#fafafa",
            padding: 12,
            borderRadius: 4,
          }}
        >
          {JSON.stringify(parsed, null, 2)}
        </pre>
      );
    }

    return <Text>{String(parsed)}</Text>;
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
      <Spin spinning={editQuery?.isFetching}>
        <Flex align="center" gap={16} style={{ marginBottom: 24 }}>
          {mediaData?.type === "image" && mediaData?.public_url && (
            <Image
              src={mediaData.public_url}
              alt="Media preview"
              width={80}
              height={80}
              style={{ objectFit: "cover", borderRadius: 8 }}
            />
          )}
          <Flex vertical>
            <Title level={3} style={{ margin: 0 }}>
              {humanizeType(mediaData?.type)}
            </Title>
            <Tag color={getStatusColor(mediaData?.status)}>
              {humanizeStatus(mediaData?.status)}
            </Tag>
          </Flex>
        </Flex>

        <Flex vertical gap={24} style={{ marginTop: "16px" }}>
          <Form {...formProps} layout="vertical">
            <Flex vertical gap={16}>
              <Flex vertical>
                <Text strong style={{ marginBottom: 8 }}>
                  <FileOutlined style={{ marginRight: 8 }} />
                  Тип медиа
                </Text>
                <Text>{humanizeType(mediaData?.type)}</Text>
              </Flex>

              <Flex vertical>
                <Text strong style={{ marginBottom: 8 }}>
                  <InfoCircleOutlined style={{ marginRight: 8 }} />
                  Статус
                </Text>
                <Tag
                  color={getStatusColor(mediaData?.status)}
                  style={{ width: "fit-content" }}
                >
                  {humanizeStatus(mediaData?.status)}
                </Tag>
              </Flex>

              <Flex vertical>
                <Text strong style={{ marginBottom: 8 }}>
                  <UserOutlined style={{ marginRight: 8 }} />
                  ID автора
                </Text>
                <Text>{mediaData?.user_id || "-"}</Text>
              </Flex>

              {mediaData?.type === "image" && mediaData?.public_url && (
                <Flex vertical>
                  <Text strong style={{ marginBottom: 8 }}>
                    Предпросмотр
                  </Text>
                  <Image
                    src={mediaData.public_url}
                    alt="Media preview"
                    style={{ maxWidth: "100%", borderRadius: 8 }}
                  />
                </Flex>
              )}

              {mediaData?.type === "video" && (
                <Flex vertical>
                  <Text strong style={{ marginBottom: 8 }}>
                    Предпросмотр
                  </Text>
                  <Text type="secondary">Предпросмотр видео недоступен</Text>
                </Flex>
              )}

              {mediaData?.type === "file" && (
                <Flex vertical>
                  <Text strong style={{ marginBottom: 8 }}>
                    Предпросмотр
                  </Text>
                  <Text type="secondary">Предпросмотр файлов недоступен</Text>
                </Flex>
              )}

              <EditableField
                icon={<InfoCircleOutlined />}
                label="Метаданные"
                fieldKey="metadata"
                isEditing={editMode.metadata}
                onToggleEdit={() =>
                  setEditMode((prev) => ({
                    ...prev,
                    metadata: !prev.metadata,
                  }))
                }
                onSave={async () => {
                  const metadata = formProps.form?.getFieldValue("metadata");
                  try {
                    // Попытка распарсить как JSON
                    const parsed = JSON.parse(metadata);
                    await handleSaveField("metadata", parsed);
                  } catch {
                    // Если не JSON, сохраняем как строку
                    await handleSaveField("metadata", metadata);
                  }
                }}
                onCancel={() => handleCancelEdit("metadata")}
                displayValue={renderMetadata(mediaData?.metadata)}
                editComponent={
                  <Form.Item
                    name={["metadata"]}
                    style={{ marginBottom: 0 }}
                    initialValue={
                      mediaData?.metadata
                        ? typeof mediaData.metadata === "string"
                          ? mediaData.metadata
                          : JSON.stringify(mediaData.metadata, null, 2)
                        : ""
                    }
                  >
                    <Input.TextArea
                      placeholder="Метаданные (JSON или текст)"
                      rows={6}
                    />
                  </Form.Item>
                }
              />
            </Flex>
          </Form>
        </Flex>

        <Flex vertical style={{ marginTop: 24 }}>
          <Text type="secondary">
            Создан: <DateField type="secondary" value={mediaData?.created_at} />
          </Text>
          <Text type="secondary">
            Обновлен:{" "}
            <DateField type="secondary" value={mediaData?.updated_at} />
          </Text>
          <Text type="secondary">ID: {mediaData?.id}</Text>
        </Flex>
      </Spin>
    </Drawer>
  );
};
