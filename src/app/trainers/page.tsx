"use client";

import { CopyOutlined, UserAddOutlined } from "@ant-design/icons";
import {
  CreateButton,
  DateField, // TODO: использовать для полей с датой
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  TextField,
  useTable,
  useDrawerForm,
} from "@refinedev/antd";
import { type BaseRecord } from "@refinedev/core";
import { Button, Space, Table } from "antd";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Avatar } from "@/components/avatar";
import { TrainerEditDrawer, TrainerCreateDrawer } from "@/components/trainers";

export default function BlogPostList() {
  const { result, tableProps } = useTable({
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
    resource: "trainers",
    warnWhenUnsavedChanges: true,
    successNotification: {
      message: "Тренер успешно обновлен",
      type: "success",
    },
    errorNotification: {
      message: "Ошибка при обновлении тренера",
      type: "error",
    },
  });

  const {
    formProps: createFormProps,
    drawerProps: createDrawerProps,
    saveButtonProps: createSaveButtonProps,
    show: createShow,
  } = useDrawerForm({
    action: "create",
    resource: "auth/register-trainer",
    redirect: false,
    successNotification: {
      message: "Тренер успешно зарегистрирован",
      type: "success",
    },
    errorNotification: {
      message: "Ошибка при регистрации тренера",
      type: "error",
    },
  });

  const humanizeTrainingSpec = (spec: string): string => {
    switch (spec) {
      case "box":
        return "Бокс";
      case "thai":
        return "Тайский бокс";
      case "kickboxing":
        return "Кикбоксинг";
      case "mma":
        return "ММА";
      case "women_martial_arts":
        return "Женские единоборства";
      default:
        return "-";
    }
  };

  return (
    <>
      <List
        headerButtons={({ createButtonProps }) => {
          if (createButtonProps) {
            return (
              <CreateButton
                {...createButtonProps}
                icon={<UserAddOutlined />}
                onClick={() => createShow()}
              >
                {"Зарегистрировать тренера"}
              </CreateButton>
            );
          }
        }}
      >
        <Table
          {...tableProps}
          rowKey="id"
          onRow={(record) => ({
            onClick: () => {
              show(record.id);
            },
            style: { cursor: "pointer" },
          })}
        >
          <Table.Column
            dataIndex="full_name"
            title={"ФИО"}
            render={(fullName: string, record: BaseRecord) => (
              <Space size={16}>
                <Avatar src={record.avatar_url} fullName={fullName} size={40} />
                <span>{fullName}</span>
              </Space>
            )}
          />
          <Table.Column
            dataIndex="spec"
            title={"Направление"}
            render={(value: string) => humanizeTrainingSpec(value)}
          />
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
                  onClick={(e) => {
                    e.stopPropagation();
                    show(record.id);
                  }}
                />
                <DeleteButton
                  hideText
                  size="small"
                  recordItemId={record.id}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                />
              </Space>
            )}
          />
        </Table>
      </List>

      <TrainerEditDrawer
        drawerProps={drawerProps}
        editQuery={editQuery}
        formProps={formProps}
        id={id}
      />

      <TrainerCreateDrawer
        drawerProps={createDrawerProps}
        formProps={createFormProps}
        saveButtonProps={createSaveButtonProps}
      />
    </>
  );
}
