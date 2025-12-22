"use client";

import {
  DateField,
  ImageField,
  MarkdownField,
  Show,
  TextField,
} from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, List } from "antd";
import ReactPlayer from "react-player";

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
    <Show isLoading={isLoading}>
      <Title level={5}>{"Фото профиля"}</Title>
      <ImageField value={record?.avatar_url} width={240} />
      <Title level={5}>{"ФИО"}</Title>
      <TextField value={record?.full_name} />
      <Title level={5}>{"Направление"}</Title>
      <TextField value={humanizeTrainingSpec(record?.spec)} />
      <Title level={5}>{"Номер телефона"}</Title>
      <TextField value={formatPhoneNumber(record?.user?.phone_number)} />
      <Title level={5}>{"Электронная почта"}</Title>
      <TextField value={record?.user?.email} />
      <Title level={5}>{"Пол"}</Title>
      <TextField value={humanizeGender(record?.gender)} />
      <Title level={5}>{"Дата рождения"}</Title>
      <DateField value={record?.birth_date} />
      <Title level={5}>{"Дата начала практики тренера"}</Title>
      <DateField value={record?.training_exp_start_on} />
      <Title level={5}>{"Регалии"}</Title>
      {record?.regalia && record?.regalia.length > 0 ? (
        <List
          size="small"
          bordered
          dataSource={record.regalia}
          renderItem={(item: string) => <List.Item>{item}</List.Item>}
        />
      ) : (
        <TextField value={"-"} />
      )}
      <Title level={5}>{"Описание особенностей подхода"}</Title>
      <MarkdownField value={record?.approach || "-"} />
      <Title level={5}>{"Видео с представлением тренера"}</Title>
      <ReactPlayer src={record?.intro_url} controls />
      <Title level={5}>{"ID"}</Title>
      <TextField value={record?.id} />
      <Title level={5}>{"ID пользователя"}</Title>
      <TextField value={record?.user_id} />
      <Title level={5}>{"Создан"}</Title>
      <DateField value={record?.created_at} />
      <Title level={5}>{"Обновлен"}</Title>
      <DateField value={record?.updated_at} />
    </Show>
  );
}
