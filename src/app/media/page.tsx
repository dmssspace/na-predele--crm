"use client";

import { FileAddOutlined, EyeOutlined } from "@ant-design/icons";
import {
  DateField,
  DeleteButton,
  EditButton,
  ImageField,
  List,
  useTable,
  useDrawerForm,
} from "@refinedev/antd";
import {
  type BaseRecord,
  useInvalidate,
  useNotification,
} from "@refinedev/core";
import { Button, Space, Table, Tag, Modal } from "antd";
import { useState } from "react";
import { MediaUploader } from "@components/media";
import { MediaEditDrawer } from "@/components/media-drawer";

export default function MediaList() {
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const invalidate = useInvalidate();
  const { open } = useNotification();
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  const {
    drawerProps: editDrawerProps,
    formProps: editFormProps,
    show: editShow,
    id: editId,
    query: editQuery,
  } = useDrawerForm({
    action: "edit",
    resource: "media",
    redirect: false,
  });

  return (
    <List
      headerButtons={() => (
        <Button
          type="primary"
          icon={<FileAddOutlined />}
          onClick={() => setUploaderOpen(true)}
        >
          Загрузить файл
        </Button>
      )}
    >
      <Modal
        title="Загрузить медиа файлы"
        open={uploaderOpen}
        onCancel={() => setUploaderOpen(false)}
        footer={null}
        width={700}
        destroyOnHidden
      >
        <MediaUploader
          key={uploaderOpen ? "open" : "closed"}
          mode="dragger"
          maxCount={10}
          accept="image/*,video/*,.pdf"
          maxSize={50}
          uploadText="Нажмите или перетащите файлы сюда"
          uploadHint="Поддерживаются изображения, видео и PDF до 50МБ"
          showUploadMessages={false}
          onUploadSuccess={(files) => {
            setUploaderOpen(false);
            open?.({
              type: "success",
              message: "Успешно загружено",
              description: `Загружено файлов: ${files.length}`,
            });
            invalidate({
              resource: "media",
              invalidates: ["list"],
            });
          }}
        />
      </Modal>
      <Table
        {...tableProps}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => editShow(record.id),
          style: { cursor: "pointer" },
        })}
      >
        <Table.Column
          dataIndex="type"
          title={"Тип медиа"}
          render={(value: string) => {
            if (value === "image") {
              return "Изображение";
            }

            if (value === "file") {
              return "Файл";
            }

            if (value === "video") {
              return "Видео";
            }

            return "-";
          }}
        />
        <Table.Column
          render={(_, record) => {
            if (record.type === "image") {
              return (
                <div onClick={(e) => e.stopPropagation()}>
                  <ImageField
                    value={record.public_url}
                    width={120}
                    height={120}
                    style={{ objectFit: "cover" }}
                  />
                </div>
              );
            }

            return "-";
          }}
          title={"Предпросмотр"}
        />
        <Table.Column
          dataIndex="status"
          title={"Статус"}
          render={(value: string) => {
            let readableValue = "-";
            let tagColor = "blue";

            switch (value) {
              case "pending":
                readableValue = "Обрабатывается";
                tagColor = "yellow";

                break;
              case "ready":
                readableValue = "Загружен";
                tagColor = "green";

                break;
              case "failed":
                readableValue = "Ошибка обработки";
                tagColor = "red";

                break;
            }

            return <Tag color={tagColor}>{readableValue}</Tag>;
          }}
        />
        <Table.Column
          dataIndex="created_at"
          title={"Дата загрузки"}
          render={(value: string) => {
            return <DateField value={value} />;
          }}
        />
        <Table.Column
          title={"Действия"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space onClick={(e) => e.stopPropagation()}>
              <EditButton
                hideText
                size="small"
                recordItemId={record.id}
                onClick={() => {
                  editShow(record.id);
                }}
              />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>

      <MediaEditDrawer
        drawerProps={editDrawerProps}
        formProps={editFormProps}
        editQuery={editQuery}
        id={editId}
      />
    </List>
  );
}
