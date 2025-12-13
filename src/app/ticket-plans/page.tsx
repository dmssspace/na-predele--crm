"use client";

import { PlusOutlined } from "@ant-design/icons";
import {
  CreateButton,
  DeleteButton,
  EditButton,
  ImageField,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord } from "@refinedev/core";
import { Space, Table } from "antd";

export default function TicketPlanList() {
  const { result, tableProps } = useTable({
    syncWithLocation: true,
    resource: "tickets/plans",
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={"ID"} />
        {/* 
          created_at: "2025-10-29T22:52:52.435363Z"
          metadata: {theme: "yellow"}
          updated_at: "2025-11-01T17:16:05.390934Z"
          uuid: "4b0bc54a-c856-473c-8f69-2ded084fcf82"
        */}
        <Table.Column dataIndex="name" title={"Название"} />
        <Table.Column
          dataIndex="type"
          title={"Тип"}
          render={(value: string) => {
            if (value === "club") {
              return "Клубный";
            }

            return "-";
          }}
        />
        <Table.Column
          title={"Действия"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record?.uuid} />
              <ShowButton hideText size="small" recordItemId={record?.uuid} />
              <DeleteButton hideText size="small" recordItemId={record?.uuid} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
}
