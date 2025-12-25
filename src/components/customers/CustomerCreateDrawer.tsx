"use client";

import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  ManOutlined,
} from "@ant-design/icons";
import {
  Drawer,
  Flex,
  Form,
  Input,
  Typography,
  Card,
  Button,
  Select,
  DatePicker,
} from "antd";
import { PhoneInput } from "@/components/phone-input";
import dayjs from "dayjs";
import { useMemo } from "react";

const { Title, Text } = Typography;

interface CustomerCreateDrawerProps {
  drawerProps: any;
  formProps: any;
  saveButtonProps: any;
}

export const CustomerCreateDrawer = ({
  drawerProps,
  formProps,
  saveButtonProps,
}: CustomerCreateDrawerProps) => {
  const modifiedFormProps = useMemo(
    () => ({
      ...formProps,
      initialValues: {
        gender: "male",
      },
      onFinish: async (values: any) => {
        const formattedValues = {
          ...values,
          birth_date: values.birth_date
            ? dayjs(values.birth_date).format("DD.MM.YYYY")
            : undefined,
        };

        await formProps.onFinish?.(formattedValues);
      },
    }),
    [formProps]
  );

  return (
    <Drawer
      {...drawerProps}
      width={700}
      styles={{
        body: {
          backgroundColor: "#f5f5f5",
        },
      }}
    >
      <Flex align="center" gap={16} style={{ marginBottom: 24 }}>
        <UserOutlined style={{ fontSize: 32 }} />
        <Title level={3} style={{ margin: 0 }}>
          Регистрация клиента
        </Title>
      </Flex>

      <Form {...modifiedFormProps} layout="vertical">
        <Card
          size="small"
          title={
            <Flex align="center" gap={8}>
              <MailOutlined />
              <Text strong>Электронная почта</Text>
            </Flex>
          }
          style={{ marginBottom: 16 }}
        >
          <Form.Item
            name={["email"]}
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите электронную почту",
              },
              {
                type: "email",
                message: "Введите корректный email",
              },
            ]}
            style={{ marginBottom: 0 }}
          >
            <Input placeholder="email@example.com" />
          </Form.Item>
        </Card>

        <Card
          size="small"
          title={
            <Flex align="center" gap={8}>
              <PhoneOutlined />
              <Text strong>Номер телефона</Text>
            </Flex>
          }
          style={{ marginBottom: 16 }}
        >
          <Form.Item
            name={["phone_number"]}
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите номер телефона",
              },
            ]}
            style={{ marginBottom: 0 }}
          >
            <PhoneInput />
          </Form.Item>
        </Card>

        <Card
          size="small"
          title={
            <Flex align="center" gap={8}>
              <UserOutlined />
              <Text strong>ФИО</Text>
            </Flex>
          }
          style={{ marginBottom: 16 }}
        >
          <Form.Item
            label="Фамилия"
            name={["last_name"]}
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
            label="Имя"
            name={["first_name"]}
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите имя",
              },
            ]}
          >
            <Input placeholder="Имя" />
          </Form.Item>
          <Form.Item
            label="Отчество"
            name={["middle_name"]}
            style={{ marginBottom: 0 }}
          >
            <Input placeholder="Отчество (необязательно)" />
          </Form.Item>
        </Card>

        <Flex gap={8} style={{ marginBottom: 16 }}>
          <Card
            size="small"
            title={
              <Flex align="center" gap={8}>
                <CalendarOutlined />
                <Text strong>Дата рождения</Text>
              </Flex>
            }
            style={{ flex: 1 }}
          >
            <Form.Item
              name={["birth_date"]}
              rules={[
                {
                  required: true,
                  message: "Выберите дату рождения",
                },
              ]}
              style={{ marginBottom: 0 }}
            >
              <DatePicker
                format="DD.MM.YYYY"
                maxDate={dayjs()}
                style={{ width: "100%" }}
                placeholder="Выберите дату"
              />
            </Form.Item>
          </Card>

          <Card
            size="small"
            title={
              <Flex align="center" gap={8}>
                <ManOutlined />
                <Text strong>Пол</Text>
              </Flex>
            }
            style={{ flex: 1 }}
          >
            <Form.Item
              name={["gender"]}
              rules={[
                {
                  required: true,
                  message: "Выберите пол",
                },
              ]}
              style={{ marginBottom: 0 }}
            >
              <Select
                options={[
                  { value: "male", label: "Мужской" },
                  { value: "female", label: "Женский" },
                ]}
                placeholder="Выберите пол"
              />
            </Form.Item>
          </Card>
        </Flex>

        <Flex justify="flex-end" gap={8} style={{ marginTop: 24 }}>
          <Button onClick={() => drawerProps.onClose?.()}>Отмена</Button>
          <Button type="primary" {...saveButtonProps}>
            Зарегистрировать клиента
          </Button>
        </Flex>
      </Form>
    </Drawer>
  );
};
