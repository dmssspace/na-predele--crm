"use client";

import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  ManOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  FileTextOutlined,
  TrophyOutlined,
  MinusCircleOutlined,
  PlusOutlined,
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
  Space,
} from "antd";
import { PhoneInput } from "@/components/phone-input";
import { CombinedMediaPicker } from "@/components/media";
import MDEditor from "@uiw/react-md-editor";
import dayjs from "dayjs";
import { useMemo } from "react";

const { Title, Text } = Typography;

interface TrainerCreateDrawerProps {
  drawerProps: any;
  formProps: any;
  saveButtonProps: any;
}

export const TrainerCreateDrawer = ({
  drawerProps,
  formProps,
  saveButtonProps,
}: TrainerCreateDrawerProps) => {
  const modifiedFormProps = useMemo(
    () => ({
      ...formProps,
      initialValues: {
        gender: "male",
        spec: "box",
      },
      onFinish: async (values: any) => {
        const formattedValues = {
          ...values,
          birth_date: values.birth_date
            ? dayjs(values.birth_date).format("DD.MM.YYYY")
            : undefined,
          training_exp_start_on: values.training_exp_start_on
            ? dayjs(values.training_exp_start_on).format("DD.MM.YYYY")
            : undefined,
          avatar_media_id: Array.isArray(values.avatar_media_id)
            ? values.avatar_media_id[0]
            : values.avatar_media_id,
          intro_media_id: Array.isArray(values.intro_media_id)
            ? values.intro_media_id[0]
            : values.intro_media_id,
        };

        await formProps.onFinish?.(formattedValues);
      },
    }),
    [formProps]
  );

  return (
    <Drawer
      {...drawerProps}
      width={800}
      styles={{
        body: {
          backgroundColor: "#f5f5f5",
        },
      }}
    >
      <Flex align="center" gap={16} style={{ marginBottom: 24 }}>
        <UserOutlined style={{ fontSize: 32 }} />
        <Title level={3} style={{ margin: 0 }}>
          Регистрация тренера
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

        <Card
          size="small"
          title={
            <Flex align="center" gap={8}>
              <TrophyOutlined />
              <Text strong>Направление</Text>
            </Flex>
          }
          style={{ marginBottom: 16 }}
        >
          <Form.Item
            name={["spec"]}
            rules={[
              {
                required: true,
                message: "Выберите направление",
              },
            ]}
            style={{ marginBottom: 0 }}
          >
            <Select
              options={[
                { value: "box", label: "Бокс" },
                { value: "thai", label: "Тайский бокс" },
                { value: "kickboxing", label: "Кикбоксинг" },
                { value: "mma", label: "ММА" },
                { value: "women_martial_arts", label: "Женские единоборства" },
              ]}
              placeholder="Выберите направление"
            />
          </Form.Item>
        </Card>

        <Card
          size="small"
          title={
            <Flex align="center" gap={8}>
              <CalendarOutlined />
              <Text strong>Начало тренерской деятельности</Text>
            </Flex>
          }
          style={{ marginBottom: 16 }}
        >
          <Form.Item
            name={["training_exp_start_on"]}
            rules={[
              {
                required: true,
                message: "Выберите дату начала тренерской деятельности",
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
              <TrophyOutlined />
              <Text strong>Регалии</Text>
            </Flex>
          }
          style={{ marginBottom: 16 }}
        >
          <Form.List name="regalia">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name]}
                      rules={[{ required: true, message: "Введите регалию" }]}
                      style={{ marginBottom: 0, flex: 1 }}
                    >
                      <Input placeholder="Регалия" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item style={{ marginBottom: 0 }}>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Добавить регалию
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>

        <Card
          size="small"
          title={
            <Flex align="center" gap={8}>
              <FileTextOutlined />
              <Text strong>Описание особенностей подхода</Text>
            </Flex>
          }
          style={{ marginBottom: 16 }}
        >
          <Form.Item
            name={["approach"]}
            rules={[
              {
                required: true,
                message: "Пожалуйста, опишите подход к тренировкам",
              },
            ]}
            style={{ marginBottom: 0 }}
          >
            <MDEditor data-color-mode="light" height={300} />
          </Form.Item>
        </Card>

        <Card
          size="small"
          title={
            <Flex align="center" gap={8}>
              <PictureOutlined />
              <Text strong>Изображение профиля</Text>
            </Flex>
          }
          style={{ marginBottom: 16 }}
        >
          <Form.Item
            name={["avatar_media_id"]}
            rules={[
              {
                required: true,
                message: "Выберите изображение профиля",
              },
            ]}
            tooltip="Выберите фото тренера для профиля"
            style={{ marginBottom: 0 }}
          >
            <CombinedMediaPicker
              multiple={false}
              accept="image/*"
              maxSize={5}
              uploaderMode="picture-card"
            />
          </Form.Item>
        </Card>

        <Card
          size="small"
          title={
            <Flex align="center" gap={8}>
              <VideoCameraOutlined />
              <Text strong>Видео с представлением тренера</Text>
            </Flex>
          }
          style={{ marginBottom: 16 }}
        >
          <Form.Item
            name={["intro_media_id"]}
            rules={[
              {
                required: true,
                message: "Выберите видео-представление",
              },
            ]}
            tooltip="Выберите видео-представление тренера"
            style={{ marginBottom: 0 }}
          >
            <CombinedMediaPicker
              multiple={false}
              accept="video/*"
              maxSize={100}
              uploaderMode="picture-card"
            />
          </Form.Item>
        </Card>

        <Flex justify="flex-end" gap={8} style={{ marginTop: 24 }}>
          <Button onClick={() => drawerProps.onClose?.()}>Отмена</Button>
          <Button type="primary" {...saveButtonProps}>
            Зарегистрировать тренера
          </Button>
        </Flex>
      </Form>
    </Drawer>
  );
};
