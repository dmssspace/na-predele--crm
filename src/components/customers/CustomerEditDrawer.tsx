"use client";

import {
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  CalendarOutlined,
  ManOutlined,
  WomanOutlined,
  CreditCardOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { DateField } from "@refinedev/antd";
import { useUpdate, useList, useCustom } from "@refinedev/core";
import {
  Avatar,
  Card,
  DatePicker,
  Drawer,
  Flex,
  Form,
  Input,
  List,
  Select,
  Tag,
  Typography,
  message,
} from "antd";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { EditableField } from "./EditableField";
import styles from "@/app/customers/customers.module.css";

const { Title, Text } = Typography;

interface CustomerEditDrawerProps {
  drawerProps: any;
  editQuery: any;
  formProps: any;
  id: any;
}

export const CustomerEditDrawer = ({
  drawerProps,
  editQuery,
  formProps,
  id,
}: CustomerEditDrawerProps) => {
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});

  const { mutate: updateCustomer } = useUpdate();

  const { data: visitsData, isLoading: visitsLoading } = useList({
    resource: `visits/customer/${id}`,
    queryOptions: {
      enabled: !!id,
    },
  });

  const { query } = useCustom({
    url: `/tickets/customer/${id}`,
    method: "get",
    queryOptions: {
      enabled: !!id,
    },
  });

  const ticketsIsLoading = query.isLoading;
  const ticketsData = query.data?.data?.data;

  const handleSaveField = async (fieldName: string, value: any) => {
    try {
      await updateCustomer(
        {
          resource: "customers",
          id: id!,
          values: { [fieldName]: value },
        },
        {
          onSuccess: () => {
            message.success("Поле успешно обновлено");
            setEditMode((prev) => ({ ...prev, [fieldName]: false }));
            editQuery.refetch();
          },
          onError: () => {
            message.error("Ошибка при обновлении поля");
          },
        }
      );
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleCancelEdit = (fieldName: string) => {
    setEditMode((prev) => ({ ...prev, [fieldName]: false }));
    setFieldValues((prev) => ({ ...prev, [fieldName]: undefined }));
  };

  const modifiedEditFormProps = useMemo(() => {
    let firstName = "";
    let lastName = "";
    let middleName = "";

    const editQueryData = editQuery?.data;

    if (editQueryData?.data?.full_name) {
      const nameParts = editQueryData.data.full_name.trim().split(/\s+/);
      if (nameParts.length === 2) {
        firstName = nameParts[0] || "";
        lastName = nameParts[1] || "";
      } else {
        firstName = nameParts[0] || "";
        middleName = nameParts[1] || "";
        lastName = nameParts[2] || "";
      }
    }

    return {
      ...formProps,
      initialValues: editQueryData?.data
        ? {
            first_name: firstName,
            last_name: lastName,
            middle_name: middleName === "" ? undefined : middleName,
            birth_date: editQueryData.data.birth_date
              ? dayjs(editQueryData.data.birth_date)
              : undefined,
            gender: editQueryData.data.gender || "male",
            avatar_media_id: editQueryData.data.avatar_media_id,
          }
        : {},
      onFinish: async (values: any) => {
        const formattedValues = {
          ...values,
          birth_date: values.birth_date
            ? dayjs(values.birth_date).format("DD.MM.YYYY")
            : undefined,
        };

        try {
          await formProps.onFinish?.(formattedValues);
        } catch (error) {
          console.error("Update failed:", error);
        }
      },
    };
  }, [formProps, editQuery]);

  return (
    <Drawer
      {...drawerProps}
      width={600}
      className={styles.drawer}
      styles={{
        body: {
          backgroundColor: "#f5f5f5",
        },
      }}
    >
      <Flex align="center" gap={16} className={styles.header}>
        <Avatar
          size={64}
          icon={<UserOutlined />}
          src={editQuery?.data?.data?.avatar_media_id}
          className={styles.avatar}
        />
        <Title level={3} className={styles.headerTitle}>
          {editQuery?.data?.data?.full_name || "Имя не указано"}
        </Title>
      </Flex>
      <Flex
        vertical
        gap={24}
        style={{ marginTop: "16px" }}
        className={styles.drawerContent}
      >
        <Form {...modifiedEditFormProps} layout="vertical">
          <EditableField
            icon={<UserOutlined />}
            label="ФИО"
            fieldKey="fullName"
            isEditing={editMode.fullName}
            onToggleEdit={() =>
              setEditMode((prev) => ({
                ...prev,
                fullName: !prev.fullName,
              }))
            }
            onSave={async () => {
              const firstName = formProps.form?.getFieldValue("first_name");
              const lastName = formProps.form?.getFieldValue("last_name");
              const middleName = formProps.form?.getFieldValue("middle_name");

              try {
                await updateCustomer(
                  {
                    resource: "customers",
                    id: id!,
                    values: {
                      first_name: firstName,
                      last_name: lastName,
                      middle_name: middleName,
                    },
                  },
                  {
                    onSuccess: () => {
                      message.success("Поле успешно обновлено");
                      setEditMode((prev) => ({ ...prev, fullName: false }));
                      editQuery.refetch();
                    },
                    onError: () => {
                      message.error("Ошибка при обновлении поля");
                    },
                  }
                );
              } catch (error) {
                console.error("Update failed:", error);
              }
            }}
            onCancel={() => handleCancelEdit("fullName")}
            displayValue={
              <Text>{editQuery?.data?.data?.full_name || "-"}</Text>
            }
            editComponent={
              <Flex vertical gap={8} className={styles.formItemGroup}>
                <Form.Item
                  name={["last_name"]}
                  className={styles.formItem}
                  rules={[
                    {
                      required: true,
                      message: "Пожалуйста, введите фамилию",
                    },
                  ]}
                >
                  <Input placeholder="Фамилия" />
                </Form.Item>
                <Form.Item
                  name={["first_name"]}
                  className={styles.formItem}
                  rules={[
                    {
                      required: true,
                      message: "Пожалуйста, введите имя",
                    },
                  ]}
                >
                  <Input placeholder="Имя" />
                </Form.Item>
                <Form.Item name={["middle_name"]} className={styles.formItem}>
                  <Input placeholder="Отчество" />
                </Form.Item>
              </Flex>
            }
          />

          <Flex gap={8}>
            <EditableField
              icon={<MailOutlined />}
              label="Email"
              fieldKey="email"
              isEditing={editMode.email}
              onToggleEdit={() =>
                setEditMode((prev) => ({
                  ...prev,
                  email: !prev.email,
                }))
              }
              onSave={async () => {
                const email = formProps.form?.getFieldValue("email");

                try {
                  // TODO: Реализовать отдельный эндпоинт для изменения email
                  // await fetch(`/api/customers/${id}/update-email`, {
                  //   method: 'POST',
                  //   body: JSON.stringify({ email })
                  // });

                  message.info("Изменение email временно недоступно");
                  setEditMode((prev) => ({ ...prev, email: false }));

                  // Временно используем общий эндпоинт
                  // await updateCustomer(...)
                } catch (error) {
                  console.error("Update failed:", error);
                  message.error("Ошибка при обновлении email");
                }
              }}
              onCancel={() => handleCancelEdit("email")}
              displayValue={
                <Text>{editQuery?.data?.data?.user?.email || "-"}</Text>
              }
              editComponent={
                <Form.Item name={["email"]} className={styles.formItem}>
                  <Input placeholder="Email" />
                </Form.Item>
              }
            />

            <EditableField
              icon={<PhoneOutlined />}
              label="Телефон"
              fieldKey="phone"
              isEditing={editMode.phone}
              onToggleEdit={() =>
                setEditMode((prev) => ({
                  ...prev,
                  phone: !prev.phone,
                }))
              }
              onSave={async () => {
                const phone = formProps.form?.getFieldValue("phone");

                try {
                  // TODO: Реализовать отдельный эндпоинт для изменения номера телефона
                  // await fetch(`/api/customers/${id}/update-phone`, {
                  //   method: 'POST',
                  //   body: JSON.stringify({ phone_number: phone })
                  // });

                  message.info("Изменение номера телефона временно недоступно");
                  setEditMode((prev) => ({ ...prev, phone: false }));

                  // Временно используем общий эндпоинт
                  // await updateCustomer(...)
                } catch (error) {
                  console.error("Update failed:", error);
                  message.error("Ошибка при обновлении номера телефона");
                }
              }}
              onCancel={() => handleCancelEdit("phone")}
              displayValue={
                <Text>
                  {editQuery?.data?.data?.user?.phone_number
                    ? (() => {
                        const value = editQuery.data.data.user.phone_number;
                        const digits = value.replace(/\D/g, "");

                        if (digits.length !== 11 || digits[0] !== "7") {
                          return value;
                        }

                        const code = digits.slice(1, 4);
                        const part1 = digits.slice(4, 7);
                        const part2 = digits.slice(7, 9);
                        const part3 = digits.slice(9, 11);

                        return `+7 (${code}) ${part1}-${part2}-${part3}`;
                      })()
                    : "-"}
                </Text>
              }
              editComponent={
                <Form.Item name={["phone"]} className={styles.formItem}>
                  <Input placeholder="Телефон" />
                </Form.Item>
              }
            />
          </Flex>

          <Flex gap={8}>
            <EditableField
              icon={<CalendarOutlined />}
              label="Дата рождения"
              fieldKey="birthDate"
              isEditing={editMode.birthDate}
              onToggleEdit={() =>
                setEditMode((prev) => ({
                  ...prev,
                  birthDate: !prev.birthDate,
                }))
              }
              onSave={async () => {
                const birthDate = formProps.form?.getFieldValue("birth_date");
                const formattedDate = birthDate
                  ? dayjs(birthDate).format("DD.MM.YYYY")
                  : undefined;
                await handleSaveField("birth_date", formattedDate);
              }}
              onCancel={() => handleCancelEdit("birthDate")}
              displayValue={
                <Text>
                  {editQuery?.data?.data?.birth_date
                    ? format(
                        new Date(editQuery.data.data.birth_date),
                        "dd.MM.yyyy",
                        {
                          locale: ru,
                        }
                      )
                    : "-"}
                </Text>
              }
              editComponent={
                <Form.Item
                  name={["birth_date"]}
                  className={styles.formItem}
                  rules={[
                    {
                      required: true,
                      message: "Пожалуйста, выберите дату рождения",
                    },
                  ]}
                >
                  <DatePicker
                    maxDate={dayjs()}
                    className={styles.fullWidthInput}
                  />
                </Form.Item>
              }
            />

            <EditableField
              icon={
                editQuery?.data?.data?.gender === "male" ? (
                  <ManOutlined />
                ) : (
                  <WomanOutlined />
                )
              }
              label="Пол"
              fieldKey="gender"
              isEditing={editMode.gender}
              onToggleEdit={() =>
                setEditMode((prev) => ({
                  ...prev,
                  gender: !prev.gender,
                }))
              }
              onSave={async () => {
                const gender = formProps.form?.getFieldValue("gender");
                await handleSaveField("gender", gender);
              }}
              onCancel={() => handleCancelEdit("gender")}
              displayValue={
                <Text>
                  {editQuery?.data?.data?.gender === "male"
                    ? "Мужской"
                    : editQuery?.data?.data?.gender === "female"
                    ? "Женский"
                    : "-"}
                </Text>
              }
              editComponent={
                <Form.Item
                  name={["gender"]}
                  className={styles.formItem}
                  rules={[
                    {
                      required: true,
                      message: "Пожалуйста, выберите пол",
                    },
                  ]}
                >
                  <Select
                    options={[
                      { value: "male", label: "Мужской" },
                      { value: "female", label: "Женский" },
                    ]}
                    className={styles.fullWidthInput}
                  />
                </Form.Item>
              }
            />
          </Flex>
        </Form>

        {/* Текущий абонемент */}
        <Card
          title={
            <Flex align="center" gap={8}>
              <CreditCardOutlined />
              <Text strong>Текущий абонемент</Text>
            </Flex>
          }
          size="small"
          style={{ backgroundColor: "white" }}
          loading={ticketsIsLoading}
        >
          {ticketsData && ticketsData.length > 0 ? (
            (() => {
              const activeTicket =
                ticketsData.find((ticket: any) => ticket.status === "active") ||
                ticketsData[0];
              return (
                <Flex vertical gap={8}>
                  <Flex justify="space-between">
                    <Text type="secondary">Номер абонемента:</Text>
                    <Text strong>{activeTicket.ticket_id}</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text type="secondary">Тариф:</Text>
                    <Text strong>
                      {`${activeTicket.package.plan.name} - ${activeTicket.package.duration_days} дня(-ей)`}
                    </Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text type="secondary">Статус:</Text>
                    <Tag
                      color={
                        activeTicket.status === "active"
                          ? "green"
                          : activeTicket.status === "expired"
                          ? "red"
                          : "orange"
                      }
                    >
                      {activeTicket.status === "active"
                        ? "Активен"
                        : activeTicket.status === "expired"
                        ? "Истёк"
                        : activeTicket.status}
                    </Tag>
                  </Flex>
                  <Flex justify="space-between">
                    <Text type="secondary">Осталось визитов:</Text>
                    <Text>
                      {activeTicket.remaining_sessions || 0} /{" "}
                      {activeTicket.package.total_sessions || 0}
                    </Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text type="secondary">Действителен до:</Text>
                    <Text>
                      {activeTicket.end_date
                        ? format(
                            new Date(activeTicket.end_date),
                            "dd.MM.yyyy",
                            { locale: ru }
                          )
                        : "-"}
                    </Text>
                  </Flex>
                </Flex>
              );
            })()
          ) : (
            <Text type="secondary">Нет активного абонемента</Text>
          )}
        </Card>

        {/* История визитов */}
        <Card
          title={
            <Flex align="center" gap={8}>
              <HistoryOutlined />
              <Text strong>История визитов</Text>
            </Flex>
          }
          size="small"
          style={{ backgroundColor: "white" }}
          loading={visitsLoading}
        >
          {visitsData?.data && visitsData.data.length > 0 ? (
            <List
              size="small"
              dataSource={visitsData.data}
              renderItem={(visit: any) => (
                <List.Item>
                  <Flex justify="space-between" style={{ width: "100%" }}>
                    <Text>
                      {visit.check_in_time || visit.date || visit.created_at
                        ? format(
                            new Date(
                              visit.check_in_time ||
                                visit.date ||
                                visit.created_at
                            ),
                            "dd.MM.yyyy HH:mm",
                            {
                              locale: ru,
                            }
                          )
                        : "-"}
                    </Text>
                    <Tag
                      color={
                        visit.status === "checked_in"
                          ? "blue"
                          : visit.status === "checked_out"
                          ? "green"
                          : "default"
                      }
                    >
                      {visit.status === "checked_in"
                        ? "Вход"
                        : visit.status === "checked_out"
                        ? "Выход"
                        : visit.status || "Визит"}
                    </Tag>
                  </Flex>
                </List.Item>
              )}
            />
          ) : (
            <Text type="secondary">История визитов пуста</Text>
          )}
        </Card>
      </Flex>
      <Flex
        vertical
        style={{
          marginTop: "16px",
        }}
      >
        <Text type="secondary">
          Создан:{" "}
          <DateField
            type="secondary"
            value={editQuery?.data?.data?.created_at}
          />
        </Text>
        <Text type="secondary">
          Обновлен:{" "}
          <DateField
            type="secondary"
            value={editQuery?.data?.data?.updated_at}
          />
        </Text>
        <Text type="secondary">ID: {editQuery?.data?.data?.id}</Text>
      </Flex>
    </Drawer>
  );
};
