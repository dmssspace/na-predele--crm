"use client";

import { UserAddOutlined } from "@ant-design/icons";
import {
  CreateButton,
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
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export default function BlogPostList() {
  const { result, tableProps } = useTable({
    syncWithLocation: true,
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
    <List
      headerButtons={({ createButtonProps }) => {
        if (createButtonProps) {
          return (
            <CreateButton {...createButtonProps} icon={<UserAddOutlined />}>
              {"Зарегистрировать тренера"}
            </CreateButton>
          );
        }
      }}
    >
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={"ID"} />
        <Table.Column dataIndex="full_name" title={"ФИО"} />
        <Table.Column
          dataIndex="spec"
          title={"Направление"}
          render={(value: string) => humanizeTrainingSpec(value)}
        />
        <Table.Column
          dataIndex={["user", "phone_number"]}
          title={"Номер телефона"}
          render={(value: string) => {
            const digits = value.replace(/\D/g, "");

            if (digits.length !== 11 || digits[0] !== "7") {
              return value;
            }

            const code = digits.slice(1, 4);
            const part1 = digits.slice(4, 7);
            const part2 = digits.slice(7, 9);
            const part3 = digits.slice(9, 11);

            return `+7 (${code}) ${part1}-${part2}-${part3}`;
          }}
        />
        <Table.Column dataIndex={["user", "email"]} title={"Эл. почта"} />
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
