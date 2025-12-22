"use client";

import { humanizeBlogCategoryTitle } from "@lib/format/humanize";
import {
  DateField, // TODO: использовать для полей с датой
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  TextField,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord } from "@refinedev/core";
import { Space, Table } from "antd";

export default function BlogPostList() {
  const { result, tableProps } = useTable({
    syncWithLocation: true,
    resource: "blog",
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={"ID"} />
        <Table.Column dataIndex="title" title={"Заголовок"} />
        <Table.Column
          dataIndex="clipping"
          title={"Содержание"}
          render={(value: string) => {
            if (!value) return "-";

            return <TextField value={value.slice(0, 80) + "..."} />;
          }}
        />
        <Table.Column
          dataIndex={"category"}
          title={"Категория"}
          render={(_, record: BaseRecord) =>
            record?.categories && record?.categories.length > 0 ? (
              humanizeBlogCategoryTitle(record?.categories[0].title)
            ) : (
              <>-</>
            )
          }
        />
        <Table.Column dataIndex="user_id" title={"ID автора"} />
        <Table.Column
          dataIndex="type"
          title={"Тип"}
          render={(value: string) => {
            if (value === "post") {
              return "Пост";
            }

            if (value === "video") {
              return "Пост с видео";
            }

            if (value === "gallery") {
              return "Пост с галереей";
            }
          }}
        />
        <Table.Column
          dataIndex="status"
          title={"Статус"}
          render={(value: string) => {
            if (value === "draft") {
              return "Черновик";
            }

            if (value === "published") {
              return "Опубликовано";
            }

            return "-";
          }}
        />
        <Table.Column dataIndex="published_at" title={"Дата публикации"} />
        {/* <Table.Column dataIndex="created_at" title={"Дата создания"} /> */}
        <Table.Column dataIndex="updated_at" title={"Дата обновления"} />
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
