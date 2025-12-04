"use client";

import { Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";

const { Title } = Typography;

export default function CategoryShow() {
  const { result: record, query } = useShow({});
  const { isLoading } = query;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>{"ID"}</Title>
      <TextField value={record?.id} />
      <Title level={5}>{"UUID"}</Title>
      <TextField value={record?.uuid} />
      <Title level={5}>{"Название"}</Title>
      <TextField value={record?.title} />
      <Title level={5}>{"Создан"}</Title>
      <TextField value={record?.created_at} />
      <Title level={5}>{"Обновлен"}</Title>
      <TextField value={record?.updated_at} />
    </Show>
  );
}
