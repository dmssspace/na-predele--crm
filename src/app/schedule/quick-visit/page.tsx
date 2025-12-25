"use client";

import React, { useState } from "react";
import {
  CheckCircleOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Create } from "@refinedev/antd";
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Radio,
  Space,
  Typography,
  Spin,
  Empty,
  Tag,
  message,
} from "antd";
import { useTranslations } from "next-intl";
import { customersApi, ticketsApi, visitsApi } from "@/lib/api/schedule";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { CustomerSearchResult, CustomerTicket } from "@/types/schedule";

const { Text } = Typography;

export default function QuickVisitPage() {
  const t = useTranslations("schedule.quickVisit");
  const [form] = Form.useForm();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerSearchResult | null>(null);
  const [registrationMode, setRegistrationMode] = useState<
    "with_ticket" | "without_ticket"
  >("with_ticket");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<CustomerSearchResult[]>(
    []
  );

  // Get customer tickets
  const { data: ticketsResponse, isLoading: isLoadingTickets } = useQuery({
    queryKey: ["customer-tickets", selectedCustomer?.id],
    queryFn: () =>
      selectedCustomer
        ? ticketsApi.getCustomerTickets(selectedCustomer.id)
        : Promise.resolve({ status: "success", data: [] }),
    enabled: !!selectedCustomer && registrationMode === "with_ticket",
  });

  const tickets = ticketsResponse?.data || [];

  // Create visit mutation
  const createVisitMutation = useMutation({
    mutationFn: visitsApi.createVisit,
    onSuccess: () => {
      message.success("Визит успешно зарегистрирован!");
      form.resetFields();
      setSelectedCustomer(null);
      setSearchQuery("");
      setSearchResults([]);
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.error || "Ошибка при регистрации визита"
      );
    },
  });

  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) {
      message.warning("Введите минимум 2 символа для поиска");
      return;
    }

    setIsSearching(true);
    try {
      const response = await customersApi.searchCustomers(searchQuery);
      setSearchResults(response.data || []);
    } catch (error) {
      message.error("Ошибка поиска клиентов");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectCustomer = (customer: CustomerSearchResult) => {
    setSelectedCustomer(customer);
    setSearchResults([]);
    form.setFieldsValue({ customer_id: customer.id });
  };

  const handleSubmit = async (values: any) => {
    if (!selectedCustomer) {
      message.error("Выберите клиента");
      return;
    }

    const visitData = {
      customer_id: selectedCustomer.id,
      ticket_id:
        registrationMode === "with_ticket" ? values.ticket_id : undefined,
      is_charged: registrationMode === "without_ticket",
    };

    createVisitMutation.mutate(visitData);
  };

  return (
    <Create
      title={
        <Space>
          <CheckCircleOutlined />
          {t("title", { default: "Быстрая регистрация визита" })}
        </Space>
      }
      footerButtons={() => <></>}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Поиск клиента */}
        <Card title="1. Найдите клиента" style={{ marginBottom: 16 }}>
          <Space.Compact style={{ width: "100%" }}>
            <Input
              size="large"
              placeholder="Введите имя, телефон или email клиента"
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onPressEnter={handleSearch}
            />
            <Button
              size="large"
              type="primary"
              onClick={handleSearch}
              loading={isSearching}
            >
              Найти
            </Button>
          </Space.Compact>

          {/* Результаты поиска */}
          {searchResults.length > 0 && (
            <Card style={{ marginTop: 16 }} size="small">
              <Space direction="vertical" style={{ width: "100%" }}>
                {searchResults.map((customer) => (
                  <Card
                    key={customer.id}
                    size="small"
                    hoverable
                    onClick={() => handleSelectCustomer(customer)}
                    style={{
                      cursor: "pointer",
                      borderColor:
                        selectedCustomer?.id === customer.id
                          ? "#1890ff"
                          : undefined,
                    }}
                  >
                    <Space>
                      <UserOutlined />
                      <div>
                        <Text strong>{customer.full_name}</Text>
                        <br />
                        <Text type="secondary">
                          {customer.user?.phone_number || customer.phone_number}
                        </Text>
                      </div>
                    </Space>
                  </Card>
                ))}
              </Space>
            </Card>
          )}

          {/* Выбранный клиент */}
          {selectedCustomer && (
            <Alert
              message={
                <Space>
                  <UserOutlined />
                  <Text strong>Выбран: {selectedCustomer.full_name}</Text>
                </Space>
              }
              type="success"
              showIcon
              style={{ marginTop: 16 }}
              closable
              onClose={() => {
                setSelectedCustomer(null);
                form.resetFields();
              }}
            />
          )}
        </Card>

        {/* Тип регистрации */}
        {selectedCustomer && (
          <Card title="2. Выберите тип посещения" style={{ marginBottom: 16 }}>
            <Radio.Group
              value={registrationMode}
              onChange={(e) => {
                setRegistrationMode(e.target.value);
                form.resetFields(["ticket_id"]);
              }}
              style={{ width: "100%" }}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <Radio value="with_ticket">
                  <Space>
                    🎫 По абонементу
                    <Text type="secondary">(списать визит с абонемента)</Text>
                  </Space>
                </Radio>
                <Radio value="without_ticket">
                  <Space>
                    💰 Разовое посещение
                    <Text type="secondary">(оплачено)</Text>
                  </Space>
                </Radio>
              </Space>
            </Radio.Group>
          </Card>
        )}

        {/* Выбор абонемента */}
        {selectedCustomer && registrationMode === "with_ticket" && (
          <Card title="3. Выберите абонемент" style={{ marginBottom: 16 }}>
            {isLoadingTickets ? (
              <Spin />
            ) : tickets.length === 0 ? (
              <Empty description="У клиента нет активных абонементов" />
            ) : (
              <Form.Item
                name="ticket_id"
                rules={[{ required: true, message: "Выберите абонемент" }]}
              >
                <Radio.Group style={{ width: "100%" }}>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {tickets
                      .filter((ticket) => ticket.status === "active")
                      .map((ticket) => (
                        <Card key={ticket.id} size="small">
                          <Radio value={ticket.id} style={{ width: "100%" }}>
                            <Space direction="vertical">
                              <Text strong>
                                {ticket.plan?.title || "Абонемент"}
                              </Text>
                              <Space>
                                <Tag color="blue">
                                  Осталось визитов: {ticket.remaining_visits}
                                </Tag>
                                <Tag
                                  color={
                                    new Date(ticket.end_date) > new Date()
                                      ? "green"
                                      : "red"
                                  }
                                >
                                  До:{" "}
                                  {new Date(ticket.end_date).toLocaleDateString(
                                    "ru"
                                  )}
                                </Tag>
                              </Space>
                            </Space>
                          </Radio>
                        </Card>
                      ))}
                  </Space>
                </Radio.Group>
              </Form.Item>
            )}
          </Card>
        )}

        {/* Кнопка регистрации */}
        {selectedCustomer && (
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            icon={<CheckCircleOutlined />}
            loading={createVisitMutation.isPending}
            block
          >
            Зарегистрировать визит
          </Button>
        )}
      </Form>
    </Create>
  );
}
