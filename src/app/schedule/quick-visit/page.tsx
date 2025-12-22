"use client";

import React, { useState } from "react";
import { CheckCircleOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { Create, useForm } from "@refinedev/antd";
import { useCustom, useInvalidate } from "@refinedev/core";
import {
  Alert,
  Button,
  Card,
  Divider,
  Form,
  Input,
  List as AntList,
  Radio,
  Select,
  Space,
  Typography,
  message,
} from "antd";
import { useTranslations } from "next-intl";
import { scheduleApi } from "@/lib/api/schedule";
import type { CustomerSearchResult, Ticket } from "@/types/schedule";

const { Text, Title } = Typography;

export default function QuickVisitPage() {
  const t = useTranslations("schedule.quickVisit");
  const invalidate = useInvalidate();
  const [form] = Form.useForm();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerSearchResult | null>(null);
  const [registrationMode, setRegistrationMode] = useState<"with_ticket" | "without_ticket">(
    "with_ticket"
  );

  // Search customers
  const searchQuery_custom = useCustom<{
    data: CustomerSearchResult[];
  }>({
    url: "customers/search",
    method: "get",
    config: {
      query: { q: searchQuery },
    },
    queryOptions: {
      enabled: false,
    },
  });

  const searchResults = searchQuery_custom.query.data;
  const searchCustomers = searchQuery_custom.query.refetch;

  // Get active tickets
  const ticketsQuery = useCustom<{ data: Ticket[] }>({
    url: "tickets",
    method: "get",
    config: {
      query: {
        customer_id: selectedCustomer?.id,
        status: "active",
      },
    },
    queryOptions: {
      enabled: !!selectedCustomer && registrationMode === "with_ticket",
    },
  });

  const ticketsData = ticketsQuery.query.data;

  const { formProps, saveButtonProps, onFinish } = useForm({
    action: "create",
    resource: "visits",
    redirect: false,
    onMutationSuccess: () => {
      message.success(t("success"));
      form.resetFields();
      setSelectedCustomer(null);
      setSearchQuery("");
      invalidate({ resource: "schedule/visits", invalidates: ["list"] });
    },
  });

  const handleSearch = () => {
    if (searchQuery.trim().length >= 2) {
      searchCustomers();
    }
  };

  const handleSelectCustomer = (customer: CustomerSearchResult) => {
    setSelectedCustomer(customer);
    form.setFieldsValue({ customer_id: customer.id });
  };

  const handleSubmit = async (values: any) => {
    try {
      if (registrationMode === "with_ticket") {
        await scheduleApi.registerVisit({
          customer_id: values.customer_id,
          ticket_id: values.ticket_id,
        });
      } else {
        await scheduleApi.registerVisit({
          customer_id: values.customer_id,
        });
      }
      message.success("Посещение зарегистрировано");
      form.resetFields();
      setSelectedCustomer(null);
      setSearchQuery("");
      invalidate({ resource: "visits", invalidates: ["list"] });
    } catch (error) {
      message.error("Ошибка регистрации");
    }
  };

  const activeTickets = ticketsData?.data?.data || [];

  return (
    <Create
      title={
        <Space>
          <CheckCircleOutlined />
          {t("title", { default: "Быстрая регистрация посещения" })}
        </Space>
      }
      saveButtonProps={{ style: { display: "none" } }}
    >
      <Card>
        {/* Customer Search */}
        <div style={{ marginBottom: 24 }}>
          <Title level={5}>1. Поиск клиента</Title>
          <Space.Compact style={{ width: "100%" }}>
            <Input
              size="large"
              placeholder="ФИО или номер телефона"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onPressEnter={handleSearch}
              prefix={<SearchOutlined />}
            />
            <Button size="large" type="primary" onClick={handleSearch}>
              Найти
            </Button>
          </Space.Compact>

          {searchResults?.data?.data && searchResults.data.data.length > 0 && (
            <Card size="small" style={{ marginTop: 16 }}>
              <AntList
                dataSource={searchResults.data.data}
                renderItem={(customer: CustomerSearchResult) => (
                  <AntList.Item
                    onClick={() => handleSelectCustomer(customer)}
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedCustomer?.id === customer.id ? "#e6f7ff" : undefined,
                    }}
                  >
                    <AntList.Item.Meta
                      avatar={<UserOutlined style={{ fontSize: 24 }} />}
                      title={`${customer.first_name} ${customer.last_name}`}
                      description={customer.phone}
                    />
                  </AntList.Item>
                )}
              />
            </Card>
          )}
        </div>

        {selectedCustomer && (
          <>
            <Divider />

            {/* Registration Mode */}
            <div style={{ marginBottom: 24 }}>
              <Title level={5}>2. Тип посещения</Title>
              <Radio.Group
                value={registrationMode}
                onChange={(e) => setRegistrationMode(e.target.value)}
              >
                <Space direction="vertical">
                  <Radio value="with_ticket">С абонементом</Radio>
                  <Radio value="without_ticket">Без абонемента (бесплатно)</Radio>
                </Space>
              </Radio.Group>
            </div>

            {/* Ticket Selection */}
            {registrationMode === "with_ticket" && (
              <>
                <Divider />
                <div style={{ marginBottom: 24 }}>
                  <Title level={5}>3. Выбор абонемента</Title>
                  {activeTickets.length === 0 ? (
                    <Alert
                      message="У клиента нет активных абонементов"
                      type="warning"
                      showIcon
                    />
                  ) : (
                    <Form form={form} onFinish={handleSubmit}>
                      <Form.Item name="customer_id" hidden>
                        <Input />
                      </Form.Item>
                      <Form.Item
                        name="ticket_id"
                        rules={[{ required: true, message: "Выберите абонемент" }]}
                      >
                        <Select size="large" placeholder="Выберите абонемент">
                          {activeTickets.map((ticket: Ticket) => (
                            <Select.Option key={ticket.id} value={ticket.id}>
                              {ticket.plan_name} (осталось: {ticket.remaining_visits})
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Button
                        type="primary"
                        size="large"
                        htmlType="submit"
                        block
                        icon={<CheckCircleOutlined />}
                      >
                        Зарегистрировать посещение
                      </Button>
                    </Form>
                  )}
                </div>
              </>
            )}

            {registrationMode === "without_ticket" && (
              <>
                <Divider />
                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<CheckCircleOutlined />}
                  onClick={() =>
                    handleSubmit({ customer_id: selectedCustomer.id })
                  }
                >
                  Зарегистрировать бесплатное посещение
                </Button>
              </>
            )}
          </>
        )}
      </Card>
    </Create>
  );
}
