"use client";

import React from "react";
import { CalendarOutlined } from "@ant-design/icons";
import { Create, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, Select, InputNumber, TimePicker, Space } from "antd";
import { useTranslations } from "next-intl";
import dayjs from "dayjs";

export default function CreateRecurringEventPage() {
  const t = useTranslations("schedule.createEvent");

  const { formProps, saveButtonProps } = useForm({
    action: "create",
    resource: "events",
    redirect: "list",
  });

  const { selectProps: trainerSelectProps } = useSelect({
    resource: "trainers",
    optionLabel: (trainer: any) => `${trainer.first_name} ${trainer.last_name}`,
  });

  const weekdays = [
    { value: 0, label: "Понедельник" },
    { value: 1, label: "Вторник" },
    { value: 2, label: "Среда" },
    { value: 3, label: "Четверг" },
    { value: 4, label: "Пятница" },
    { value: 5, label: "Суббота" },
    { value: 6, label: "Воскресенье" },
  ];

  const trainingTypes = [
    { value: "individual", label: "Индивидуальная" },
    { value: "group_adult", label: "Групповая взрослых" },
    { value: "group_child", label: "Групповая детская" },
  ];

  const trainingSpecs = [
    { value: "gym", label: "Тренажерный зал" },
    { value: "yoga", label: "Йога" },
    { value: "pilates", label: "Пилатес" },
    { value: "stretching", label: "Стретчинг" },
    { value: "cardio", label: "Кардио" },
    { value: "crossfit", label: "Кроссфит" },
  ];

  return (
    <Create
      title={
        <Space>
          <CalendarOutlined />
          {t("title", { default: "Создать регулярную тренировку" })}
        </Space>
      }
      saveButtonProps={saveButtonProps}
    >
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Тренер"
          name="trainer_id"
          rules={[{ required: true, message: "Выберите тренера" }]}
        >
          <Select {...trainerSelectProps} size="large" placeholder="Выберите тренера" />
        </Form.Item>

        <Form.Item
          label="Тип тренировки"
          name="training_type"
          rules={[{ required: true, message: "Выберите тип тренировки" }]}
          initialValue="group_adult"
        >
          <Select size="large" placeholder="Выберите тип тренировки">
            {trainingTypes.map((type) => (
              <Select.Option key={type.value} value={type.value}>
                {type.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Специализация"
          name="training_spec"
          rules={[{ required: true, message: "Выберите специализацию" }]}
        >
          <Select size="large" placeholder="Выберите специализацию">
            {trainingSpecs.map((spec) => (
              <Select.Option key={spec.value} value={spec.value}>
                {spec.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="День недели"
          name="weekday"
          rules={[{ required: true, message: "Выберите день недели" }]}
        >
          <Select size="large" placeholder="Выберите день недели">
            {weekdays.map((day) => (
              <Select.Option key={day.value} value={day.value}>
                {day.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Space size="large">
          <Form.Item
            label="Время начала"
            name="start_time"
            rules={[{ required: true, message: "Укажите время начала" }]}
          >
            <TimePicker
              size="large"
              format="HH:mm"
              placeholder="10:00"
              style={{ width: 200 }}
            />
          </Form.Item>

          <Form.Item
            label="Продолжительность (мин)"
            name="duration"
            rules={[{ required: true, message: "Укажите продолжительность" }]}
            initialValue={60}
          >
            <InputNumber
              size="large"
              min={15}
              max={180}
              step={15}
              style={{ width: 150 }}
            />
          </Form.Item>
        </Space>

        <Form.Item
          label="Максимум участников"
          name="clients_cap"
          rules={[{ required: true, message: "Укажите максимум участников" }]}
          initialValue={15}
        >
          <InputNumber size="large" min={1} max={50} style={{ width: 150 }} />
        </Form.Item>
      </Form>
    </Create>
  );
}
