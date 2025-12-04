"use client";

import { DateField, MarkdownField, Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";

const { Title } = Typography;

export default function CustomerShow() {
  const { result: record, query } = useShow({});
  const { isLoading } = query;

  const humanizeGender = (gender: string): string => {
    if (!gender) {
      return "-";
    }

    if (gender === "male") {
      return "Мужской";
    }

    if (gender === "female") {
      return "Женский";
    }

    return "-";
  };

  const formatPhoneNumber = (phoneNumber: string): string => {
    if (!phoneNumber) {
      return "-";
    }

    const digits = phoneNumber.replace(/\D/g, "");

    if (digits.length !== 11 || digits[0] !== "7") {
      return phoneNumber;
    }

    const code = digits.slice(1, 4);
    const part1 = digits.slice(4, 7);
    const part2 = digits.slice(7, 9);
    const part3 = digits.slice(9, 11);

    return `+7 (${code}) ${part1}-${part2}-${part3}`;
  };

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>{"ID"}</Title>
      <TextField value={record?.id} />
      <Title level={5}>{"UUID"}</Title>
      <TextField value={record?.uuid} />
      <Title level={5}>{"ФИО"}</Title>
      <TextField value={record?.full_name} />
      <Title level={5}>{"Номер телефона"}</Title>
      <TextField value={formatPhoneNumber(record?.user?.phone_number)} />
      <Title level={5}>{"Электронная почта"}</Title>
      <TextField value={record?.user?.email} />
      <Title level={5}>{"Пол"}</Title>
      <TextField value={humanizeGender(record?.gender)} />
      <Title level={5}>{"Дата рождения"}</Title>
      <DateField value={record?.birth_date} />
      <Title level={5}>{"ID пользователя"}</Title>
      <TextField value={record?.user_id} />
      <Title level={5}>{"Создан"}</Title>
      <DateField value={record?.created_at} />
      <Title level={5}>{"Обновлен"}</Title>
      <DateField value={record?.updated_at} />
    </Show>
  );
}
