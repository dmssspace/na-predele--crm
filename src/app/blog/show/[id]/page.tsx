"use client";

import { humanizeBlogCategoryTitle } from "@lib/format/humanize";
import { DateField, MarkdownField, Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";

const { Title } = Typography;

export default function BlogPostShow() {
  const { result: record, query } = useShow({});
  const { isLoading } = query;

  // TODO: ...
  //       "media": null

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>{"ID"}</Title>
      <TextField value={record?.id} />
      <Title level={5}>{"UUID"}</Title>
      <TextField value={record?.uuid} />
      <Title level={5}>{"Просмотр"}</Title>
      <TextField value={`${"https://localhost:8080"}/blog/${record?.slug}`} />
      <Title level={5}>{"ID автора"}</Title>
      <TextField value={record?.user_id} />
      <Title level={5}>{"Тип поста"}</Title>
      <TextField value={record?.type} />
      <Title level={5}>{"Статус"}</Title>
      <TextField value={record?.status} />
      {record?.status === "published" && (
        <>
          <Title level={5}>{"Дата публикации"}</Title>
          <DateField value={record?.published_at} />
        </>
      )}
      <Title level={5}>{"Заголовок"}</Title>
      <TextField value={record?.title} />
      <Title level={5}>{"Категория"}</Title>
      <TextField
        value={
          record?.categories && record?.categories.length > 0
            ? humanizeBlogCategoryTitle(record?.categories[0].title)
            : "-"
        }
      />
      <Title level={5}>{"Краткое содержимое"}</Title>
      <TextField value={record?.clipping} />
      <Title level={5}>{"Содержание"}</Title>
      <MarkdownField value={record?.body} />
      <Title level={5}>{"Создано"}</Title>
      <DateField value={record?.created_at} />
      <Title level={5}>{"Обновлено"}</Title>
      <DateField value={record?.updated_at} />
    </Show>
  );
}
