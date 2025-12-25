"use client";

import { PlusOutlined, EyeOutlined } from "@ant-design/icons";
import {
  CreateButton,
  DeleteButton,
  ImageField,
  List,
  useTable,
  useDrawerForm,
  EditButton,
} from "@refinedev/antd";
import { type BaseRecord } from "@refinedev/core";
import { Space, Table, Button } from "antd";
import { ProductEditDrawer, ProductCreateDrawer } from "@/components/shop";

export default function ShopProductList() {
  const { result, tableProps } = useTable({
    syncWithLocation: true,
    resource: "shop/products",
  });

  const {
    drawerProps: editDrawerProps,
    formProps: editFormProps,
    show: editShow,
    id: editId,
    query: editQuery,
  } = useDrawerForm({
    action: "edit",
    resource: "shop/products",
    redirect: false,
  });

  const {
    drawerProps: createDrawerProps,
    formProps: createFormProps,
    saveButtonProps: createSaveButtonProps,
    show: createShow,
  } = useDrawerForm({
    action: "create",
    resource: "shop/products",
    redirect: false,
  });

  return (
    <List
      headerButtons={({ createButtonProps }) => {
        if (createButtonProps) {
          return (
            <CreateButton
              {...createButtonProps}
              icon={<PlusOutlined />}
              onClick={() => createShow()}
            >
              {"Добавить товар"}
            </CreateButton>
          );
        }
      }}
    >
      <Table
        {...tableProps}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => editShow(record.id),
          style: { cursor: "pointer" },
        })}
      >
        <Table.Column
          render={(_, record) => (
            <div onClick={(e) => e.stopPropagation()}>
              <ImageField
                value={record.image_url}
                width={120}
                height={120}
                style={{ objectFit: "cover" }}
              />
            </div>
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
              <EditButton
                hideText
                size="small"
                recordItemId={record?.id}
                onClick={() => editShow(record?.id)}
              />
              <DeleteButton
                hideText
                size="small"
                recordItemId={record?.id}
                resource="shop/products"
              />
            </Space>
          )}
        />
      </Table>

      <ProductEditDrawer
        drawerProps={editDrawerProps}
        formProps={editFormProps}
        editQuery={editQuery}
        id={editId}
      />

      <ProductCreateDrawer
        drawerProps={createDrawerProps}
        formProps={createFormProps}
        saveButtonProps={createSaveButtonProps}
      />
    </List>
  );
}
