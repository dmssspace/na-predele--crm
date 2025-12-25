"use client";

import {
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  CalendarOutlined,
  ManOutlined,
  WomanOutlined,
  CameraOutlined,
  VideoCameraOutlined,
  TrophyOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { DateField } from "@refinedev/antd";
import { useUpdate } from "@refinedev/core";
import {
  Card,
  DatePicker,
  Drawer,
  Flex,
  Form,
  Input,
  List,
  Modal,
  Select,
  Spin,
  Tag,
  Typography,
  message,
  Button,
  Space,
} from "antd";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import ReactPlayer from "react-player";
import { EditableField } from "../customers/EditableField";
import { Avatar } from "@/components/avatar";
import { CombinedMediaPicker } from "@/components/media";
import { PhoneInput } from "@/components/phone-input";
import styles from "@/app/customers/customers.module.css";

const { Title, Text } = Typography;

interface TrainerEditDrawerProps {
  drawerProps: any;
  editQuery: any;
  formProps: any;
  id: any;
}

export const TrainerEditDrawer = ({
  drawerProps,
  editQuery,
  formProps,
  id,
}: TrainerEditDrawerProps) => {
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [selectedAvatarId, setSelectedAvatarId] = useState<string[]>([]);
  const [introVideoModalOpen, setIntroVideoModalOpen] = useState(false);
  const [selectedIntroVideoId, setSelectedIntroVideoId] = useState<string[]>(
    []
  );

  const { mutate: updateTrainer } = useUpdate();

  const handleSaveField = async (fieldName: string, value: any) => {
    try {
      await updateTrainer(
        {
          resource: "trainers",
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
  };

  const handleAvatarClick = () => {
    const currentAvatarId = editQuery?.data?.data?.avatar_media_id;
    setSelectedAvatarId(currentAvatarId ? [currentAvatarId] : []);
    setAvatarModalOpen(true);
  };

  const handleAvatarSave = async () => {
    try {
      await updateTrainer(
        {
          resource: "trainers",
          id: id!,
          values: {
            avatar_media_id: selectedAvatarId?.[0] || null,
          },
        },
        {
          onSuccess: () => {
            message.success("Аватар успешно обновлен");
            setAvatarModalOpen(false);
            editQuery.refetch();
          },
          onError: () => {
            message.error("Ошибка при обновлении аватара");
          },
        }
      );
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleIntroVideoClick = () => {
    const currentIntroVideoId = editQuery?.data?.data?.intro_media_id;
    setSelectedIntroVideoId(currentIntroVideoId ? [currentIntroVideoId] : []);
    setIntroVideoModalOpen(true);
  };

  const handleIntroVideoSave = async () => {
    try {
      await updateTrainer(
        {
          resource: "trainers",
          id: id!,
          values: {
            intro_media_id: selectedIntroVideoId?.[0] || null,
          },
        },
        {
          onSuccess: () => {
            message.success("Видео успешно обновлено");
            setIntroVideoModalOpen(false);
            editQuery.refetch();
          },
          onError: () => {
            message.error("Ошибка при обновлении видео");
          },
        }
      );
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const humanizeTrainingSpec = (spec: string): string => {
    switch (spec) {
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
        return "-";
    }
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
            spec: editQueryData.data.spec || "box",
            training_exp_start_on: editQueryData.data.training_exp_start_on
              ? dayjs(editQueryData.data.training_exp_start_on)
              : undefined,
            regalia: editQueryData.data.regalia || [],
            approach: editQueryData.data.approach || "",
          }
        : {},
      onFinish: async (values: any) => {
        const formattedValues = {
          ...values,
          birth_date: values.birth_date
            ? dayjs(values.birth_date).format("DD.MM.YYYY")
            : undefined,
          training_exp_start_on: values.training_exp_start_on
            ? dayjs(values.training_exp_start_on).format("DD.MM.YYYY")
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
      <Spin spinning={editQuery?.isFetching}>
        <Flex align="center" gap={16} className={styles.header}>
          <div
            onClick={handleAvatarClick}
            style={{
              cursor: "pointer",
              position: "relative",
              display: "inline-block",
            }}
            title="Нажмите, чтобы изменить аватар"
          >
            <Avatar
              size={64}
              src={editQuery?.data?.data?.avatar_url}
              fullName={editQuery?.data?.data?.full_name}
              className={styles.avatar}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                borderRadius: "50%",
                width: "24px",
                height: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CameraOutlined style={{ color: "white", fontSize: "12px" }} />
            </div>
          </div>
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
                  await updateTrainer(
                    {
                      resource: "trainers",
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

            <EditableField
              icon={<TrophyOutlined />}
              label="Направление"
              fieldKey="spec"
              isEditing={editMode.spec}
              onToggleEdit={() =>
                setEditMode((prev) => ({
                  ...prev,
                  spec: !prev.spec,
                }))
              }
              onSave={async () => {
                const spec = formProps.form?.getFieldValue("spec");
                await handleSaveField("spec", spec);
              }}
              onCancel={() => handleCancelEdit("spec")}
              displayValue={
                <Text>{humanizeTrainingSpec(editQuery?.data?.data?.spec)}</Text>
              }
              editComponent={
                <Form.Item
                  name={["spec"]}
                  className={styles.formItem}
                  rules={[
                    {
                      required: true,
                      message: "Выберите направление",
                    },
                  ]}
                >
                  <Select
                    options={[
                      { value: "box", label: "Бокс" },
                      { value: "thai", label: "Тайский бокс" },
                      { value: "kickboxing", label: "Кикбоксинг" },
                      { value: "mma", label: "ММА" },
                      {
                        value: "women_martial_arts",
                        label: "Женские единоборства",
                      },
                    ]}
                  />
                </Form.Item>
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
                  message.info("Изменение email временно недоступно");
                  setEditMode((prev) => ({ ...prev, email: false }));
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
                  message.info("Изменение номера телефона временно недоступно");
                  setEditMode((prev) => ({ ...prev, phone: false }));
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
                    <PhoneInput placeholder="Телефон" />
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
                        message: "Укажите дату рождения",
                      },
                    ]}
                  >
                    <DatePicker
                      format="DD.MM.YYYY"
                      maxDate={dayjs()}
                      style={{ width: "100%" }}
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
                      : "Женский"}
                  </Text>
                }
                editComponent={
                  <Form.Item
                    name={["gender"]}
                    className={styles.formItem}
                    rules={[
                      {
                        required: true,
                        message: "Выберите пол",
                      },
                    ]}
                  >
                    <Select
                      options={[
                        { value: "male", label: "Мужской" },
                        { value: "female", label: "Женский" },
                      ]}
                    />
                  </Form.Item>
                }
              />
            </Flex>

            <EditableField
              icon={<CalendarOutlined />}
              label="Дата начала тренерской деятельности"
              fieldKey="trainingExpStartOn"
              isEditing={editMode.trainingExpStartOn}
              onToggleEdit={() =>
                setEditMode((prev) => ({
                  ...prev,
                  trainingExpStartOn: !prev.trainingExpStartOn,
                }))
              }
              onSave={async () => {
                const trainingExpStartOn = formProps.form?.getFieldValue(
                  "training_exp_start_on"
                );
                const formattedDate = trainingExpStartOn
                  ? dayjs(trainingExpStartOn).format("DD.MM.YYYY")
                  : undefined;
                await handleSaveField("training_exp_start_on", formattedDate);
              }}
              onCancel={() => handleCancelEdit("trainingExpStartOn")}
              displayValue={
                <Text>
                  {editQuery?.data?.data?.training_exp_start_on
                    ? format(
                        new Date(editQuery.data.data.training_exp_start_on),
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
                  name={["training_exp_start_on"]}
                  className={styles.formItem}
                  rules={[
                    {
                      required: true,
                      message: "Укажите дату начала тренерской деятельности",
                    },
                  ]}
                >
                  <DatePicker
                    format="DD.MM.YYYY"
                    maxDate={dayjs()}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              }
            />

            <EditableField
              icon={<TrophyOutlined />}
              label="Регалии"
              fieldKey="regalia"
              isEditing={editMode.regalia}
              onToggleEdit={() =>
                setEditMode((prev) => ({
                  ...prev,
                  regalia: !prev.regalia,
                }))
              }
              onSave={async () => {
                const regalia = formProps.form?.getFieldValue("regalia");
                await handleSaveField("regalia", regalia || []);
              }}
              onCancel={() => handleCancelEdit("regalia")}
              displayValue={
                editQuery?.data?.data?.regalia &&
                editQuery.data.data.regalia.length > 0 ? (
                  <List
                    size="small"
                    dataSource={editQuery.data.data.regalia}
                    renderItem={(item: string) => (
                      <List.Item style={{ padding: "4px 0" }}>
                        <Text>• {item}</Text>
                      </List.Item>
                    )}
                  />
                ) : (
                  <Text type="secondary">Не указаны</Text>
                )
              }
              editComponent={
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
                            rules={[
                              { required: true, message: "Введите регалию" },
                            ]}
                            style={{ marginBottom: 0, flex: 1 }}
                          >
                            <Input placeholder="Регалия" />
                          </Form.Item>
                          <Button
                            type="text"
                            danger
                            onClick={() => remove(name)}
                            icon={<span>✕</span>}
                          />
                        </Space>
                      ))}
                      <Button type="dashed" onClick={() => add()} block>
                        Добавить регалию
                      </Button>
                    </>
                  )}
                </Form.List>
              }
            />

            <EditableField
              icon={<FileTextOutlined />}
              label="Описание особенностей подхода"
              fieldKey="approach"
              isEditing={editMode.approach}
              onToggleEdit={() =>
                setEditMode((prev) => ({
                  ...prev,
                  approach: !prev.approach,
                }))
              }
              onSave={async () => {
                const approach = formProps.form?.getFieldValue("approach");
                await handleSaveField("approach", approach);
              }}
              onCancel={() => handleCancelEdit("approach")}
              displayValue={
                <div data-color-mode="light">
                  <MDEditor.Markdown
                    source={editQuery?.data?.data?.approach || "Не указано"}
                  />
                </div>
              }
              editComponent={
                <Form.Item
                  name={["approach"]}
                  className={styles.formItem}
                  rules={[
                    {
                      required: true,
                      message: "Укажите описание подхода",
                    },
                  ]}
                >
                  <MDEditor data-color-mode="light" />
                </Form.Item>
              }
            />

            <Card
              title={
                <Flex align="center" gap={8}>
                  <VideoCameraOutlined />
                  <Text strong>Видео-представление</Text>
                </Flex>
              }
              extra={
                <Button
                  type="link"
                  icon={<CameraOutlined />}
                  onClick={handleIntroVideoClick}
                >
                  Изменить видео
                </Button>
              }
            >
              {editQuery?.data?.data?.intro_url ? (
                <ReactPlayer
                  url={editQuery.data.data.intro_url}
                  controls
                  width="100%"
                  height="300px"
                />
              ) : (
                <Text type="secondary">Видео не загружено</Text>
              )}
            </Card>
          </Form>
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

        <Modal
          title="Изменить аватар"
          open={avatarModalOpen}
          onOk={handleAvatarSave}
          onCancel={() => setAvatarModalOpen(false)}
          okText="Сохранить"
          cancelText="Отмена"
          width={700}
        >
          <CombinedMediaPicker
            value={selectedAvatarId}
            onChange={setSelectedAvatarId}
            multiple={false}
            accept="image/*"
            maxSize={5}
            uploaderMode="picture-card"
          />
        </Modal>

        <Modal
          title="Изменить видео-представление"
          open={introVideoModalOpen}
          onOk={handleIntroVideoSave}
          onCancel={() => setIntroVideoModalOpen(false)}
          okText="Сохранить"
          cancelText="Отмена"
          width={700}
        >
          <CombinedMediaPicker
            value={selectedIntroVideoId}
            onChange={setSelectedIntroVideoId}
            multiple={false}
            accept="video/*"
            maxSize={100}
            uploaderMode="picture-card"
          />
        </Modal>
      </Spin>
    </Drawer>
  );
};
