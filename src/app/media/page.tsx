"use client";

import { FileAddOutlined } from "@ant-design/icons";
import {
  CreateButton,
  DateField,
  DeleteButton,
  EditButton,
  ImageField,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord } from "@refinedev/core";
import { Button, Space, Table, Tag } from "antd";

export default function MediaList() {
  const { result, tableProps } = useTable({
    syncWithLocation: true,
  });

  return (
    <List
      headerButtons={({ createButtonProps }) => {
        if (createButtonProps) {
          return (
            <CreateButton {...createButtonProps} icon={<FileAddOutlined />}>
              {"Загрузить файл"}
            </CreateButton>
          );
        }
      }}
    >
      <Table {...tableProps} rowKey="id">
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
                <ImageField
                  value={record.public_url}
                  width={120}
                  height={120}
                  style={{ objectFit: "cover" }}
                />
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
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
}
