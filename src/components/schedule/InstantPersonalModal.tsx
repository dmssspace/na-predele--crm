"use client";

import React, { useState } from "react";
import {
  CheckCircleOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Modal,
  Form,
  Input,
  Button,
  Space,
  Select,
  DatePicker,
  Switch,
  Card,
  List,
  Alert,
  message,
} from "antd";
import { useTranslations } from "next-intl";
import dayjs from "dayjs";
import type { CustomerSearchResult, Ticket } from "@/types/schedule";
import { scheduleApi, customersApi, ticketsApi } from "@/lib/api/schedule";
import { useSelect } from "@refinedev/antd";
import { useInvalidate } from "@refinedev/core";
import { useRouter } from "next/navigation";

interface InstantPersonalModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function InstantPersonalModal({
  onClose,
  onSuccess,
}: InstantPersonalModalProps) {
  const t = useTranslations("schedule.calendar");
  const [form] = Form.useForm();
  const invalidate = useInvalidate();
  const router = useRouter();

  const { selectProps: trainerSelectProps } = useSelect({
    resource: "trainers",
    optionLabel: (trainer: any) => `${trainer.short_name}`,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CustomerSearchResult[]>(
    []
  );
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerSearchResult | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) {
      message.warning("Введите минимум 2 символа для поиска");
      return;
    }

    try {
      const response = await customersApi.searchCustomers(searchQuery);
      setSearchResults(response.data || []);
    } catch (error) {
      message.error("Ошибка поиска клиентов");
      setSearchResults([]);
    }
  };

  const handleSelectCustomer = async (customer: CustomerSearchResult) => {
    setSelectedCustomer(customer);
    form.setFieldsValue({ customer_id: customer.id });

    try {
      const resp = await ticketsApi.getCustomerTickets(customer.id);
      setTickets(resp.data || []);
    } catch (err) {
      setTickets([]);
    }
  };

  const handleCreateInstant = async () => {
    try {
      const values = await form.validateFields();

      const payload: any = {
        trainer_id: values.trainer_id,
        customer_id: values.customer_id,
        start_time: dayjs(values.start_time).toISOString(),
      };

      if (values.ticket_id) payload.ticket_id = values.ticket_id;
      if (values.is_charged) payload.is_charged = true;

      await scheduleApi.createInstantEvent(payload);

      message.success(t("instantModal.success") || "Персональный визит создан");
      invalidate({ resource: "sessions", invalidates: ["list"] });
      invalidate({ resource: "bookings", invalidates: ["list"] });
      invalidate({ resource: "visits", invalidates: ["list"] });

      onSuccess?.();
      onClose();

      router.push("/schedule/visits");
    } catch (error: any) {
      const status = error?.response?.status;
      const errCode = error?.response?.data?.error?.code;
      const errMsg =
        error?.response?.data?.error?.message || error?.response?.data?.message;

      if (status === 403) {
        message.error(t("instantModal.onlyStaff") || "Только сотрудник");
      } else if (
        status === 409 ||
        errCode === "busy" ||
        (errMsg && errMsg.toLowerCase().includes("busy"))
      ) {
        message.error(
          t("instantModal.trainerBusy") || "Тренер занят в это время"
        );
      } else if (status === 400) {
        message.error(
          t("instantModal.invalidTime") || "Неверный формат времени"
        );
      } else {
        message.error(errMsg || "Ошибка создания мгновенной записи");
      }
    }
  };

  // Watch form values so button enable state updates when user fills fields
  const trainerId = Form.useWatch("trainer_id", form);
  const startTime = Form.useWatch("start_time", form);
  const isSubmitDisabled = !selectedCustomer || !trainerId || !startTime;

  return (
    <Modal
      title={
        <Space>
          <CheckCircleOutlined />
          {t("instantModal.title")}
        </Space>
      }
      open={true}
      onCancel={onClose}
      width={820}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Отмена
        </Button>,
        <Button
          key="create"
          type="primary"
          onClick={handleCreateInstant}
          disabled={isSubmitDisabled}
        >
          Создать
        </Button>,
      ]}
    >
      <Card size="small" style={{ marginBottom: 12 }}>
        <Form form={form} layout="vertical">
          <Form.Item
            label={t("instantModal.trainer")}
            name="trainer_id"
            rules={[{ required: true, message: "Выберите тренера" }]}
          >
            <Select
              {...trainerSelectProps}
              size="large"
              placeholder="Выберите тренера"
            />
          </Form.Item>

          <Form.Item label={t("instantModal.customer")}>
            <Space.Compact style={{ width: "100%" }}>
              <Input
                placeholder="ФИО или телефон"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onPressEnter={handleSearch}
                prefix={<SearchOutlined />}
              />
              <Button type="primary" onClick={handleSearch}>
                Найти
              </Button>
            </Space.Compact>

            {searchResults.length > 0 && (
              <Card size="small" style={{ marginTop: 8 }}>
                <List
                  dataSource={searchResults}
                  renderItem={(c: CustomerSearchResult) => (
                    <List.Item
                      onClick={() => handleSelectCustomer(c)}
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          selectedCustomer?.id === c.id ? "#e6f7ff" : undefined,
                      }}
                    >
                      <List.Item.Meta
                        avatar={<UserOutlined />}
                        title={c.full_name}
                        description={c.user?.phone_number || c.phone_number}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            )}

            {selectedCustomer && (
              <Alert
                message={`Выбран: ${selectedCustomer.full_name}`}
                type="success"
                showIcon
                style={{ marginTop: 8 }}
                closable
                onClose={() => {
                  setSelectedCustomer(null);
                  form.resetFields(["customer_id"]);
                }}
              />
            )}
          </Form.Item>

          <Form.Item
            label={t("instantModal.startTime")}
            name="start_time"
            rules={[{ required: true, message: "Укажите дату и время" }]}
          >
            <DatePicker showTime style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label={t("instantModal.chargeNow")}
            name="is_charged"
            valuePropName="checked"
          >
            <Switch defaultChecked />
          </Form.Item>

          {selectedCustomer && (
            <Form.Item label={t("instantModal.selectTicket")} name="ticket_id">
              {tickets.length === 0 ? (
                <Alert
                  message="У клиента нет активных абонементов"
                  type="warning"
                  showIcon
                />
              ) : (
                <Select size="large" placeholder="Выберите абонемент">
                  {tickets.map((ticket) => (
                    <Select.Option key={ticket.id} value={ticket.id}>
                      {ticket.plan_name} (осталось: {ticket.remaining_visits})
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          )}

          <Form.Item name="customer_id" hidden>
            <Input />
          </Form.Item>
        </Form>
      </Card>
    </Modal>
  );
}
