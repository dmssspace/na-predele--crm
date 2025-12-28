"use client";

import React, { useState } from "react";
import {
  Card,
  List,
  Avatar,
  Tag,
  Spin,
  Alert,
  Space,
  Typography,
  Button,
  Popconfirm,
  message,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { scheduleApi } from "@/lib/api/schedule";
import CreateBookingModal from "@/components/schedule/CreateBookingModal";
import RegisterVisitModal from "@/components/schedule/RegisterVisitModal";
import type { BookingResponse } from "@/types/schedule";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";

const { Text } = Typography;

type Props = {
  sessionId?: string | null;
};

export default function BookingsCard({ sessionId }: Props) {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data, isLoading, error } = useQuery<
    import("@/types/schedule").ApiResponse<BookingResponse[]>,
    Error
  >({
    queryKey: ["sessionBookings", sessionId],
    queryFn: () => scheduleApi.getSessionBookings(sessionId!),
    enabled: !!sessionId,
  });

  const [processingCancelId, setProcessingCancelId] = useState<string | null>(
    null
  );
  const [registerModal, setRegisterModal] = useState<{
    bookingId: string | null;
    customerId: string | null;
  }>({ bookingId: null, customerId: null });

  const cancelMutation = useMutation({
    mutationFn: (bookingId: string) =>
      scheduleApi.cancelBooking(bookingId, { canceled_by: "trainer" }),
    onSuccess: () => {
      message.success("Запись отменена");
      queryClient.invalidateQueries({
        queryKey: ["sessionBookings", sessionId],
      });
    },
    onError: () => {
      message.error("Не удалось отменить запись");
    },
  });

  const bookings: BookingResponse[] = data?.data ?? [];

  if (!sessionId) return null;

  return (
    <Card
      title={`Записи (${bookings.length})`}
      extra={
        <Button type="link" onClick={() => setIsCreateOpen(true)}>
          Добавить запись
        </Button>
      }
      size="small"
      style={{ marginTop: 16 }}
    >
      {error && (
        <Alert
          type="error"
          message="Ошибка загрузки"
          description="Не удалось загрузить записи. Попробуйте обновить карточку."
          showIcon
          style={{ marginBottom: 12 }}
        />
      )}

      <Spin spinning={isLoading || processingCancelId !== null}>
        {bookings.length === 0 && !isLoading ? (
          <Text type="secondary">Нет записей</Text>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={bookings}
            renderItem={(b) => (
              <List.Item
                actions={[
                  b.status !== "canceled" && b.status !== "visited" && (
                    <Popconfirm
                      key="cancel"
                      title="Вы уверены, что хотите отменить запись?"
                      onConfirm={() => {
                        setProcessingCancelId(b.id);
                        cancelMutation.mutate(b.id, {
                          onSettled: () => setProcessingCancelId(null),
                        });
                      }}
                      okText="Да"
                      cancelText="Нет"
                    >
                      <Button
                        danger
                        size="small"
                        disabled={processingCancelId === b.id}
                      >
                        Отменить запись
                      </Button>
                    </Popconfirm>
                  ),
                  b.status === "confirmed" && (
                    <Button
                      key="register"
                      type="dashed"
                      color="default"
                      size="small"
                      onClick={() =>
                        setRegisterModal({
                          bookingId: b.id,
                          customerId: b.customer?.id ?? null,
                        })
                      }
                    >
                      Отметить визит
                    </Button>
                  ),
                  b.status === "visited" && (
                    <div key="visited">
                      <Button type="default" size="small" disabled>
                        Посещение отмечено
                      </Button>
                    </div>
                  ),
                ].filter(Boolean)}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={b.customer?.avatar_url}
                      icon={
                        !b.customer?.avatar_url ? <UserOutlined /> : undefined
                      }
                    />
                  }
                  title={
                    <Space>
                      <Text>{b.customer?.full_name ?? b.customer_id}</Text>
                      <Tag
                        color={
                          b.status === "confirmed"
                            ? "green"
                            : b.status === "requested"
                            ? "gold"
                            : b.status === "visited"
                            ? "blue"
                            : "default"
                        }
                      >
                        {b.status === "confirmed"
                          ? "Подтверждена"
                          : b.status === "requested"
                          ? "Запрошена"
                          : b.status === "visited"
                          ? "Посещена"
                          : "Отменена"}
                      </Tag>
                    </Space>
                  }
                  description={format(
                    parseISO(b.created_at),
                    "dd MMM yyyy HH:mm",
                    { locale: ru }
                  )}
                />
              </List.Item>
            )}
          />
        )}
      </Spin>

      <CreateBookingModal
        sessionId={sessionId}
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => {
          // ensure bookings list refreshes
          queryClient.invalidateQueries({
            queryKey: ["sessionBookings", sessionId],
          });
        }}
      />

      <RegisterVisitModal
        bookingId={registerModal.bookingId ?? undefined}
        customerId={registerModal.customerId ?? undefined}
        open={!!registerModal.bookingId}
        onClose={() => setRegisterModal({ bookingId: null, customerId: null })}
        onSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: ["sessionBookings", sessionId],
          });
          queryClient.invalidateQueries({ queryKey: ["visits"] });
          setRegisterModal({ bookingId: null, customerId: null });
        }}
      />
    </Card>
  );
}
