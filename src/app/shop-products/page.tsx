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

export default function ShopProductList() {
  const { result, tableProps } = useTable({
    syncWithLocation: true,
    resource: "shop/products",
  });

  return (
    <List
      headerButtons={({ createButtonProps }) => {
        if (createButtonProps) {
          return (
            <CreateButton {...createButtonProps} icon={<PlusOutlined />}>
              {"Добавить товар"}
            </CreateButton>
          );
        }
      }}
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={"ID"} />
        <Table.Column
          render={(_, record) => (
            <ImageField
              value={record.image_url}
              width={120}
              height={120}
              style={{ objectFit: "cover" }}
            />
          )}
          title={"Изображение"}
        />
        <Table.Column dataIndex="title" title={"Наименование"} />
        <Table.Column
          dataIndex="price"
          title={"Цена"}
          render={(value: number) => {
            return `${value} руб.`;
          }}
        />
        <Table.Column
          dataIndex="discount_percent"
          title={"Действующая скидка"}
          render={(value: number) => {
            return `${value}%`;
          }}
        />
        <Table.Column
          title={"Цена с учетом скидки"}
          render={(_: any, record: any) => {
            const discountedPrice =
              record.price * (1 - record.discount_percent / 100);
            return `${discountedPrice.toFixed(2)} руб.`;
          }}
        />
        <Table.Column dataIndex="clipping" title={"Краткое описание"} />
        <Table.Column
          dataIndex="withdrawn"
          title={"Снят с продажи"}
          render={(value: boolean) => (value ? "Да" : "Нет")}
        />
        <Table.Column
          title={"Действия"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record?.uuid} />
              <ShowButton hideText size="small" recordItemId={record?.uuid} />
              <DeleteButton
                hideText
                size="small"
                recordItemId={record?.uuid}
                resource="shop/products"
              />
            </Space>
          )}
        />
      </Table>
    </List>
  );
}
