"use client";

import React, { useState } from "react";
import {
  SearchOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useCustom, useInvalidate } from "@refinedev/core";
import {
  Modal,
  Form,
  Input,
  Select,
  Radio,
  Space,
  Button,
  List,
  Card,
  Descriptions,
  Tag,
  Alert,
  message,
} from "antd";
import type { ScheduleSession } from "@/types/schedule";
import { scheduleApi } from "@/lib/api/schedule";
import { Customer } from "@/types/customer";
import { Ticket } from "@/types/ticket";

interface BookSessionModalProps {
  session: ScheduleSession;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function BookSessionModal({
  session,
  onClose,
  onSuccess,
}: BookSessionModalProps) {
  const invalidate = useInvalidate();
  const [form] = Form.useForm();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [useTicket, setUseTicket] = useState(true);

  const searchQueryCustom = useCustom<{
    data: Customer[];
  }>({
    url: "/customers/search",
    method: "get",
    config: {
      query: { q: searchQuery },
    },
    queryOptions: {
      enabled: false,
    },
  });

  const searchResults = searchQueryCustom.query.data;
  const searchCustomers = searchQueryCustom.query.refetch;

  // Get active tickets
  const ticketsQueryCustom = useCustom<{ data: Ticket[] }>({
    url: "/tickets",
    method: "get",
    config: {
      query: {
        customer_id: selectedCustomer?.id,
        status: "active",
      },
    },
    queryOptions: {
      enabled: !!selectedCustomer && useTicket,
    },
  });

  const ticketsData = ticketsQueryCustom.query.data;

  const handleSearch = () => {
    if (searchQuery.trim().length >= 2) {
      searchCustomers();
    }
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    form.setFieldsValue({ customer_id: customer.id });
  };

  const handleBookSession = async () => {
    try {
      const values = await form.validateFields();

      const bookingData: { customer_id: string; ticket_id?: string } = {
        customer_id: values.customer_id,
      };

      if (useTicket && values.ticket_id) {
        bookingData.ticket_id = values.ticket_id;
      }

      await scheduleApi.bookSession(session.id, bookingData);

      message.success("Тренировка успешно забронирована");
      invalidate({ resource: "sessions", invalidates: ["list"] });
      invalidate({ resource: "bookings", invalidates: ["list"] });

      onSuccess?.();
      onClose();
    } catch (error: any) {
      // Handle known backend errors
      const errCode = error?.response?.data?.error?.code;
      const errMsg =
        error?.response?.data?.error?.message || error?.response?.data?.message;

      if (
        errCode === "session_full" ||
        errMsg?.toLowerCase()?.includes("full")
      ) {
        message.error("Тренировка заполнена");
      } else if (
        errCode === "ticket_invalid" ||
        errMsg?.toLowerCase()?.includes("ticket")
      ) {
        message.error("Проблема с абонементом");
      } else {
        message.error("Ошибка бронирования тренировки");
      }
    }
  };

  const activeTickets = ticketsData?.data || [];
  const isFull = session.bookings_count >= session.event.clients_cap;
  const canBook =
    selectedCustomer && (!useTicket || form.getFieldValue("ticket_id"));

  return (
    <Modal
      title={
        <Space>
          <CheckCircleOutlined />
          Забронировать тренировку
        </Space>
      }
      open={true}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Отмена
        </Button>,
        <Button
          key="book"
          type="primary"
          onClick={handleBookSession}
          disabled={!canBook || isFull}
        >
          Забронировать
        </Button>,
      ]}
    >
      {/* Session Info */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Descriptions column={2} size="small">
          <Descriptions.Item label="Тренер">
            {session.event.trainer.first_name} {session.event.trainer.last_name}
          </Descriptions.Item>
          <Descriptions.Item label="Время">
            <ClockCircleOutlined />{" "}
            {format(parseISO(session.start_at), "dd.MM.yyyy HH:mm", {
              locale: ru,
            })}{" "}
            - {format(parseISO(session.end_at), "HH:mm", { locale: ru })}
          </Descriptions.Item>
          <Descriptions.Item label="Тип">
            <Tag color="blue">{session.event.training_type}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Загруженность">
            <Tag color={isFull ? "error" : "success"}>
              {session.bookings_count}/{session.event.clients_cap}
            </Tag>
          </Descriptions.Item>
        </Descriptions>

        {isFull && (
          <Alert
            message="Тренировка заполнена"
            description="Все места заняты"
            type="error"
            showIcon
            style={{ marginTop: 8 }}
          />
        )}
      </Card>

      <Form form={form} layout="vertical">
        {/* Customer Search */}
        <Form.Item label="1. Поиск клиента">
          <Space.Compact style={{ width: "100%" }}>
            <Input
              placeholder="ФИО или номер телефона"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onPressEnter={handleSearch}
              prefix={<SearchOutlined />}
            />
            <Button type="primary" onClick={handleSearch}>
              Найти
            </Button>
          </Space.Compact>

          {searchResults?.data && searchResults.data.length > 0 && (
            <Card size="small" style={{ marginTop: 8 }}>
              <List
                dataSource={searchResults.data}
                renderItem={(customer: Customer) => (
                  <List.Item
                    onClick={() => handleSelectCustomer(customer)}
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedCustomer?.id === customer.id
                          ? "#e6f7ff"
                          : undefined,
                      padding: 8,
                    }}
                  >
                    <List.Item.Meta
                      avatar={<UserOutlined />}
                      title={`${customer.first_name} ${customer.last_name}`}
                      description={customer.phone}
                    />
                  </List.Item>
                )}
              />
            </Card>
          )}
        </Form.Item>

        {selectedCustomer && (
          <>
            <Form.Item name="customer_id" hidden>
              <Input />
            </Form.Item>

            {/* Ticket Selection */}
            <Form.Item label="2. Использование абонемента">
              <Radio.Group
                value={useTicket}
                onChange={(e) => setUseTicket(e.target.value)}
              >
                <Space direction="vertical">
                  <Radio value={true}>С абонементом</Radio>
                  <Radio value={false}>Без абонемента (бесплатно)</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>

            {useTicket && (
              <Form.Item
                label="3. Выбор абонемента"
                name="ticket_id"
                rules={[{ required: true, message: "Выберите абонемент" }]}
              >
                {activeTickets.length === 0 ? (
                  <Alert
                    message="У клиента нет активных абонементов"
                    type="warning"
                    showIcon
                  />
                ) : (
                  <Select placeholder="Выберите абонемент" size="large">
                    {activeTickets.map((ticket: Ticket) => (
                      <Select.Option key={ticket.id} value={ticket.id}>
                        {ticket.plan_name} (осталось: {ticket.remaining_visits})
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            )}
          </>
        )}
      </Form>
    </Modal>
  );
}
