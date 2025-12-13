"use client";

import { DateField, ImageField, MarkdownField, Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";

const { Title } = Typography;

// 	Slug            string    `json:"slug"`
// 	ImageURL        string    `json:"image_url"`
// 	GalleryURLList  []string  `json:"gallery_url_list"`


export default function ShopProductShow() { 
  const { result: record, query } = useShow({
    resource: "shop/products",
  });
  const { isLoading } = query;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>{"Изображение товара"}</Title>
      <ImageField value={record?.image_url} width={240}  />
      <Title level={5}>{"Галерея изображений"}</Title>
      {record?.gallery_url_list && record?.gallery_url_list.length > 0 ? (
        record.gallery_url_list.map((url: string, index: number) => (
          <ImageField key={index} value={url} style={{ marginRight: 8 }} width={240} />
        ))
      ) : (
        <TextField value={"-"} />
      )}
      <Title level={5}>{"Наименование"}</Title>
      <TextField value={record?.title} />
      <Title level={5}>{"Цена"}</Title>
      <TextField value={record?.price ? `${record?.price} руб.` : "-"} />
      <Title level={5}>{"Действующая скидка"}</Title>
      <TextField
        value={
          record?.discount_percent
            ? `${record?.discount_percent}%`
            : "0%"
        }
      />
      <Title level={5}>{"Цена с учетом скидки"}</Title>
      <TextField
        value={
          record?.price
            ? `${(
                record.price *
                (1 - (record.discount_percent || 0) / 100)
              ).toFixed(2)} руб.`
            : "-"
        }
      />
      <Title level={5}>{"Описание"}</Title>
      <MarkdownField value={record?.description} />
      <Title level={5}>{"Снят с продажи"}</Title>
      <TextField value={record?.withdrawn ? "Да" : "Нет"} />
      {record?.withdrawn && (
        <>
          <Title level={5}>{"Причина снятия с продажи"}</Title>
          <TextField value={record?.withdrawn_reason} />
        </>
      )}
      <Title level={5}>{"ID"}</Title>
      <TextField value={record?.id} />
      <Title level={5}>{"UUID"}</Title>
      <TextField value={record?.uuid} />
      <Title level={5}>{"Создан"}</Title>
      <DateField value={record?.created_at} />
      <Title level={5}>{"Обновлен"}</Title>
      <DateField value={record?.updated_at} />
    </Show>
  );
}