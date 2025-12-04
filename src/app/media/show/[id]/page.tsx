"use client";

import { DateField, ImageField, Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Descriptions } from "antd";

const { Title } = Typography;

export default function MediaShow() {
  const { result: record, query } = useShow({});
  const { isLoading } = query;

  const humanizeStatus = (status: string): string => {
    if (status === "pending") {
      return "Обрабатывается";
    }

    if (status === "ready") {
      return "Загружен";
    }

    if (status === "failed") {
      return "Ошибка обработки";
    }

    return "-";
  };

  const humanizeType = (type: string): string => {
    if (type === "image") {
      return "Изображение";
    }

    if (type === "file") {
      return "Файл";
    }

    if (type === "video") {
      return "Видео";
    }

    return "-";
  };

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>{"ID"}</Title>
      <TextField value={record?.id} />
      <Title level={5}>{"UUID"}</Title>
      <TextField value={record?.uuid} />
      <Title level={5}>{"Тип медиа"}</Title>
      <TextField value={humanizeType(record?.type)} />
      <Title level={5}>{"Статус"}</Title>
      <TextField value={humanizeStatus(record?.status)} />
      <Title level={5}>{"ID автора"}</Title>
      <TextField value={record?.user_id} />
      <Title level={5}>{"Мета-данные"}</Title>
      {record?.metadata ? (
        (() => {
          let parsed: any = record.metadata;
          if (typeof parsed === "string") {
            try {
              parsed = JSON.parse(parsed);
            } catch (e) {
              // Note: оставим строкой
            }
          }

          if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
            return (
              <Descriptions column={1} bordered size="small">
                {Object.entries(parsed).map(([key, value]) => (
                  <Descriptions.Item label={key} key={key}>
                    {value && typeof value === "object" ? (
                      <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                        {JSON.stringify(value, null, 2)}
                      </pre>
                    ) : (
                      String(value)
                    )}
                  </Descriptions.Item>
                ))}
              </Descriptions>
            );
          }

          if (Array.isArray(parsed) || typeof parsed === "object") {
            return (
              <pre style={{ whiteSpace: "pre-wrap", background: "#fafafa", padding: 12, borderRadius: 4 }}>
                {JSON.stringify(parsed, null, 2)}
              </pre>
            );
          }

          return <TextField value={String(parsed)} />;
        })()
      ) : (
        <TextField value={"-"} />
      )}
      <Title level={5}>{"Предпросмотр"}</Title>
      {record?.type === "image" && <ImageField value={record?.public_url} width={240} />}
      {record?.type === "video" && (
        <TextField value={"Предпросмотр видео недоступен"} />
      )}
      {record?.type === "file" && (
        <TextField value={"Предпросмотр файлов недоступен"} />
      )}
      <Title level={5}>{"Создано"}</Title>
      <DateField value={record?.created_at} />
      <Title level={5}>{"Обновлено"}</Title>
      <DateField value={record?.updated_at} />
    </Show>
  );
}
