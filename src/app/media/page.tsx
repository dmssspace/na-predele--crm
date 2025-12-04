"use client";

import { FileAddOutlined } from "@ant-design/icons";
import {
  CreateButton,
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord } from "@refinedev/core";
import { Button, Space, Table } from "antd";

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
        <Table.Column dataIndex="id" title={"ID"} />
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
          dataIndex="status"
          title={"Статус"}
          render={(value: string) => {
            if (value === "pending") {
              return "Обрабатывается";
            }

            if (value === "ready") {
              return "Загружен";
            }

            if (value === "failed") {
              return "Ошибка обработки";
            }

            return "-";
          }}
        />
        <Table.Column dataIndex="user_id" title={"ID автора"} />
        <Table.Column dataIndex="created_at" title={"Дата создания"} />
        <Table.Column dataIndex="updated_at" title={"Дата обновления"} />
        <Table.Column
          title={"Действия"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.uuid} />
              <ShowButton hideText size="small" recordItemId={record.uuid} />
              <DeleteButton hideText size="small" recordItemId={record.uuid} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
}
