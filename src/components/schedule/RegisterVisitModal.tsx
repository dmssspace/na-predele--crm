"use client";

import { useEffect, useMemo } from "react";
import { Modal, Form, Select, Button, Radio, message } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";

import { scheduleApi } from "@/lib/api/schedule";
import { ticketsApi } from "@/lib/api/tickets";

import type { Ticket } from "@/types/ticket";

type Props = {
  bookingId?: string | null;
  customerId?: string | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function RegisterVisitModal({
  bookingId,
  customerId,
  open,
  onClose,
  onSuccess,
}: Props) {
  const [form] = Form.useForm();

  const { data: ticketsResponse, isLoading: isTicketsLoading } = useQuery({
    queryKey: ["customer-tickets", customerId],
    queryFn: () =>
      customerId
        ? ticketsApi.getCustomerTickets(customerId)
        : Promise.resolve({ status: "success", data: [] }),
    enabled: !!customerId,
  });

  const tickets: Ticket[] = useMemo(
    () => ticketsResponse?.data ?? [],
    [ticketsResponse?.data]
  );

  const mutation = useMutation({
    mutationFn: (payload: { ticket_id?: string | null; is_charged: boolean }) =>
      scheduleApi.registerVisitFromBooking(bookingId!, payload),
    onSuccess: () => {
      message.success("Визит зарегистрирован");
      onSuccess && onSuccess();
      form.resetFields();
      onClose();
    },
    onError: () => {
      message.error("Не удалось зарегистрировать визит");
    },
  });

  const paymentType = Form.useWatch("payment_type", form) as
    | "ticket"
    | "charged"
    | "trial"
    | undefined;

  useEffect(() => {
    if (!form.getFieldValue("payment_type")) {
      form.setFieldsValue({
        payment_type: tickets.length > 0 ? "ticket" : "charged",
      });
    }
  }, [tickets, form]);

  const handleFinish = (values: any) => {
    if (!bookingId) return message.error("ID брони не указан");

    const pt: "ticket" | "charged" | "trial" = values.payment_type;

    if (pt === "ticket") {
      if (!values.ticket_id) return message.warning("Выберите абонемент");
      mutation.mutate({ ticket_id: values.ticket_id, is_charged: false });
      return;
    }

    if (pt === "charged") {
      mutation.mutate({ ticket_id: null, is_charged: true });
      return;
    }

    mutation.mutate({ ticket_id: null, is_charged: false });
  };

  return (
    <Modal
      title="Отметить визит"
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          payment_type: tickets.length > 0 ? "ticket" : "charged",
        }}
      >
        <Form.Item name="ticket_id" label="Абонемент">
          <Select
            showSearch
            placeholder="Выберите абонемент (необязательно)"
            options={tickets.map((t) => ({
              label: `${t.package?.plan?.name} ${t.package?.duration_days} дней (Осталось ${t.remaining_sessions} визитов)`,
              value: t.id,
            }))}
            loading={isTicketsLoading}
            allowClear
            disabled={paymentType !== "ticket"}
          />
        </Form.Item>

        <Form.Item
          name="payment_type"
          label="Тип визита / оплаты"
          rules={[{ required: true }]}
        >
          <Radio.Group>
            <Radio value="ticket">Списать с абонемента</Radio>
            <Radio value="charged">
              Оплатить/Отметить как разовый (оплата)
            </Radio>
            <Radio value="trial">Бесплатный пробный визит</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={mutation.status === "pending"}
            block
          >
            Отметить визит
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
