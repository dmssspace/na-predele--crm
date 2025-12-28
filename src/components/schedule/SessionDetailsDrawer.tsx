"use client";

import React from "react";
import { Drawer, Space, Button, Tag, Card, List, Flex, Typography } from "antd";
import {
  ClockCircleOutlined,
  TagOutlined,
  UserOutlined,
} from "@ant-design/icons";
import BookingsCard from "@/components/schedule/BookingsCard";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import type { ScheduleSession } from "@/types/schedule";
import { DateField } from "@refinedev/antd";

const { Text } = Typography;

type Props = {
  session: ScheduleSession | null;
  open: boolean;
  onClose: () => void;
  onBook: () => void;
};

export default function SessionDetailsDrawer({
  session,
  open,
  onClose,
  onBook,
}: Props) {
  const disabled =
    !session ||
    ((session as any)?.bookings_count ?? 0) >=
      (session?.event?.clients_cap ?? 0);

  return (
    <Drawer
      title={"Детали тренировки"}
      open={open}
      onClose={onClose}
      width={700}
    >
      {session && session.event && (
        <>
          <Space style={{ marginBottom: 16 }}>
            <Tag
              color={
                session.status === "scheduled"
                  ? "green"
                  : session.status === "completed"
                  ? "blue"
                  : "default"
              }
            >
              {session.status === "scheduled"
                ? "Запланирована"
                : session.status === "canceled"
                ? "Отменена"
                : session.status === "completed"
                ? "Завершена"
                : session.status}
            </Tag>
            <Tag
              color={
                session.event.type === "recurring"
                  ? "magenta"
                  : session.event.type === "once"
                  ? "purple"
                  : "default"
              }
            >
              {session.event.type === "recurring"
                ? "Повторяющаяся"
                : "Единоразовая"}
            </Tag>
          </Space>
          <Card title={"Детали тренировки"}>
            <List>
              <List.Item>
                <Flex gap={8}>
                  <Space style={{ width: 150 }}>
                    <UserOutlined />
                    <Text type="secondary">Тренер</Text>
                  </Space>
                  <Space>
                    {session.event.trainer?.full_name || "Не указан"}
                  </Space>
                </Flex>
              </List.Item>
              <List.Item>
                <Flex gap={8}>
                  <Space style={{ width: 150 }}>
                    <ClockCircleOutlined />
                    <Text type="secondary">Время тренировки</Text>
                  </Space>
                  <Space>
                    {format(parseISO(session.start_at), "HH:mm", {
                      locale: ru,
                    })}{" "}
                    -{" "}
                    {format(parseISO(session.end_at), "HH:mm", { locale: ru })}
                  </Space>
                </Flex>
              </List.Item>
              <List.Item>
                <Flex gap={8}>
                  <Space style={{ width: 150 }}>
                    <TagOutlined />
                    <Text type="secondary">Тип тренировки</Text>
                  </Space>
                  <Space>
                    <Tag
                      color={
                        session.event.training_type === "individual"
                          ? "green"
                          : session.event.training_type === "group_adult"
                          ? "blue"
                          : session.event.training_type === "group_child"
                          ? "gold"
                          : "default"
                      }
                    >
                      {session.event.training_type === "individual"
                        ? "Индивидуальная"
                        : session.event.training_type === "group_adult"
                        ? "Групповая (взрослые)"
                        : session.event.training_type === "group_child"
                        ? "Групповая (дети)"
                        : session.event.training_type}
                    </Tag>
                  </Space>
                </Flex>
              </List.Item>
              <List.Item>
                <Flex gap={8}>
                  <Space style={{ width: 150 }}>
                    <TagOutlined />
                    <Text type="secondary">Направление</Text>
                  </Space>
                  <Space>
                    <Text>
                      {(() => {
                        switch (session.event.training_spec) {
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
                            return session.event.training_spec;
                        }
                      })()}
                    </Text>
                  </Space>
                </Flex>
              </List.Item>
              <List.Item>
                <Flex gap={8}>
                  <Space style={{ width: 150 }}>
                    <TagOutlined />
                    <Text type="secondary">Вместимость</Text>
                  </Space>
                  <Space>
                    <Text>{session.event.clients_cap} мест</Text>
                  </Space>
                </Flex>
              </List.Item>
            </List>
          </Card>

          <BookingsCard sessionId={session.id} />

          <Card
            title="Дополнительная информация"
            style={{ marginTop: 16 }}
            size="small"
          >
            <List>
              <List.Item>
                <Flex gap={8}>
                  <Space style={{ width: 150 }}>
                    <Text type="secondary">Создана</Text>
                  </Space>
                  <Space>
                    <DateField
                      format="DD.MM.YYYY HH:mm"
                      value={session.created_at}
                    />
                  </Space>
                </Flex>
              </List.Item>
              <List.Item>
                <Flex gap={8}>
                  <Space style={{ width: 150 }}>
                    <Text type="secondary">ID тренировки</Text>
                  </Space>
                  <Space>
                    <Text>{session.id}</Text>
                  </Space>
                </Flex>
              </List.Item>
              <List.Item>
                <Flex gap={8}>
                  <Space style={{ width: 150 }}>
                    <Text type="secondary">ID события</Text>
                  </Space>
                  <Space>
                    <Text>{session.event.id}</Text>
                  </Space>
                </Flex>
              </List.Item>
            </List>
          </Card>
        </>
      )}
    </Drawer>
  );
}
