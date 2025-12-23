"use client";

import { CopyOutlined, UserAddOutlined } from "@ant-design/icons";
import {
  CreateButton,
  DeleteButton,
  EditButton,
  List,
  useDrawerForm,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord } from "@refinedev/core";
import { Button, Space, Table } from "antd";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CustomerEditDrawer } from "@/components/customers/CustomerEditDrawer";

export default function CustomersList() {
  const { result, tableProps } = useTable<Customer>({
    syncWithLocation: true,
  });

  const {
    query: editQuery,
    formProps,
    drawerProps,
    show,
    id,
  } = useDrawerForm({
    action: "edit",
    resource: "customers",
    warnWhenUnsavedChanges: true,
    successNotification: {
      message: "Клиент успешно обновлен",
      type: "success",
    },
    errorNotification: {
      message: "Ошибка при обновлении клиента",
      type: "error",
    },
  });

  return (
    <>
      <List
        headerButtons={({ createButtonProps }) => {
          if (createButtonProps) {
            return (
              <CreateButton {...createButtonProps} icon={<UserAddOutlined />}>
                {"Зарегистрировать клиента"}
              </CreateButton>
            );
          }
        }}
      >
        <Table {...tableProps} rowKey="id">
          <Table.Column dataIndex="full_name" title={"ФИО"} />
          <Table.Column
            dataIndex={["user", "phone_number"]}
            title={"Номер телефона"}
            render={(value: string) => {
              if (value === "") {
                return "-";
              }

              const formatted = value.replace(/\D/g, "");

              if (formatted.length === 11 && formatted.startsWith("7")) {
                const displayNumber = `+7 (${formatted.slice(
                  1,
                  4
                )}) ${formatted.slice(4, 7)}-${formatted.slice(
                  7,
                  9
                )}-${formatted.slice(9, 11)}`;

                return (
                  <Space size="small">
                    <a href={`tel:+${formatted}`}>{displayNumber}</a>
                    <Button
                      type="text"
                      size="small"
                      title="Скопировать номер телефона"
                      icon={<CopyOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(displayNumber);
                      }}
                    />
                  </Space>
                );
              }

              return value;
            }}
          />
          <Table.Column
            dataIndex={["user", "email"]}
            title={"Эл. почта"}
            render={(value: string) => {
              if (value !== "") {
                return (
                  <Space size="small">
                    <a href={`mailto:${value}`}>{value}</a>
                    <Button
                      type="text"
                      size="small"
                      title="Скопировать эл. почту"
                      icon={<CopyOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(value);
                      }}
                    />
                  </Space>
                );
              }

              return "-";
            }}
          />
          {/* TODO: пометить когда у человека день рождения */}
          <Table.Column
            dataIndex="birth_date"
            title={"Дата рождения"}
            render={(value: string) => {
              const date = new Date(value);

              if (isNaN(date.getDate())) {
                return "-";
              }

              return format(date, "dd.MM.yyyy", { locale: ru });
            }}
          />
          <Table.Column
            dataIndex="gender"
            title={"Пол"}
            render={(value: string) => {
              if (value === "male") {
                return "муж.";
              }

              if (value) {
                return "жен.";
              }

              return "-";
            }}
          />
          <Table.Column
            title={"Действия"}
            dataIndex="actions"
            render={(_, record: BaseRecord) => (
              <Space>
                <EditButton
                  hideText
                  size="small"
                  recordItemId={record.id}
                  onClick={() => show(record.id)}
                />
                <DeleteButton hideText size="small" recordItemId={record.id} />
              </Space>
            )}
          />
        </Table>
      </List>
      <CustomerEditDrawer
        drawerProps={drawerProps}
        editQuery={editQuery}
        formProps={formProps}
        id={id}
      />
    </>
  );
}
