"use client";

import React, { useMemo, useState } from "react";
import { CalendarOutlined } from "@ant-design/icons";
import {
  Drawer,
  Form,
  Select,
  Input,
  InputNumber,
  TimePicker,
  Space,
  Button,
  Typography,
} from "antd";
import { useForm, useSelect } from "@refinedev/antd";
import { useInvalidate } from "@refinedev/core";
import { useQuery } from "@tanstack/react-query";
import { scheduleApi } from "@/lib/api/schedule";
import dayjs from "dayjs";
import { Trainer } from "@/types/trainer";

const { Title } = Typography;

interface RecurringCreateDrawerProps {
  drawerProps: any;
}

export const RecurringCreateDrawer = ({
  drawerProps,
}: RecurringCreateDrawerProps) => {
  const { formProps, saveButtonProps } = useForm({
    action: "create",
    resource: "schedule/events/recurring",
    redirect: false,
  });

  const { selectProps: trainerSelectProps } = useSelect({
    resource: "trainers",
    optionLabel: (trainer: Trainer) => `${trainer.full_name}`,
  });

  const invalidate = useInvalidate();

  const [selectedWeekday, setSelectedWeekday] = useState<number | undefined>(
    undefined
  );

  const [startTimeObj, setStartTimeObj] = useState<any>(undefined);
  const [trainingType, setTrainingType] = useState<string | undefined>(
    undefined
  );

  const { data: availabilityResponse } = useQuery({
    queryKey: ["availability"],
    queryFn: scheduleApi.getAvailability,
  });

  const availability = availabilityResponse?.data || [];

  const getDisabledHours = () => {
    if (selectedWeekday === undefined) {
      return [];
    }

    const avail = availability.find(
      (a: any) => Number(a.weekday) === Number(selectedWeekday)
    );

    if (!avail || !avail.start_time || !avail.end_time) {
      return Array.from({ length: 24 }, (_, i) => i);
    }

    const [sh, sm] = avail.start_time.split(":").map(Number);
    const [eh, em] = avail.end_time.split(":").map(Number);

    const res: number[] = [];
    for (let h = 0; h < 24; h++) {
      if (h < sh || h > eh) res.push(h);
    }
    return res;
  };

  const getDisabledMinutes = (hour: number) => {
    if (selectedWeekday === undefined) return [];
    const avail = availability.find(
      (a: any) => Number(a.weekday) === Number(selectedWeekday)
    );
    if (!avail || !avail.start_time || !avail.end_time)
      return Array.from({ length: 60 }, (_, i) => i);

    const [sh, sm] = avail.start_time.split(":").map(Number);
    const [eh, em] = avail.end_time.split(":").map(Number);

    if (hour === sh && sm > 0) {
      return Array.from({ length: sm }, (_, i) => i);
    }
    if (hour === eh && em < 59) {
      const arr: number[] = [];
      for (let m = em + 1; m < 60; m++) arr.push(m);
      return arr;
    }
    return [];
  };

  const trainingTypes = [
    { value: "group_adult", label: "Групповая взрослых" },
    { value: "group_child", label: "Групповая детская" },
  ];

  const weekdays = [
    { value: 0, label: "Понедельник" },
    { value: 1, label: "Вторник" },
    { value: 2, label: "Среда" },
    { value: 3, label: "Четверг" },
    { value: 4, label: "Пятница" },
    { value: 5, label: "Суббота" },
    { value: 6, label: "Воскресенье" },
  ];

  const modifiedFormProps = useMemo(
    () => ({
      ...formProps,
      onFinish: async (values: any) => {
        const startTimeObj = values.start_time;
        const start_time = startTimeObj
          ? startTimeObj.format("HH:mm")
          : undefined;

        const durationMinutes =
          values.training_type &&
          String(values.training_type).startsWith("group")
            ? 90
            : 60;
        const end_time = startTimeObj
          ? dayjs(startTimeObj.format("HH:mm"), "HH:mm")
              .add(durationMinutes, "minute")
              .format("HH:mm")
          : undefined;

        const formatted = {
          trainer_id: values.trainer_id,
          training_type: values.training_type,
          weekday: Number(values.weekday),
          start_time,
          end_time,
          clients_cap: Number(values.clients_cap),
        };

        await formProps.onFinish?.(formatted);

        invalidate({ resource: "schedule/events", invalidates: ["list"] });
        invalidate({ resource: "events", invalidates: ["list"] });

        drawerProps.onClose?.();
      },
    }),
    [formProps, invalidate, drawerProps]
  );

  return (
    <Drawer
      {...drawerProps}
      width={560}
      title={
        <Space align="center">
          <CalendarOutlined />
          <Title level={4} style={{ margin: 0 }}>
            Создать регулярную тренировку
          </Title>
        </Space>
      }
    >
      <Form {...modifiedFormProps} layout="vertical">
        <Form.Item
          label="Тренер"
          name="trainer_id"
          rules={[{ required: true, message: "Выберите тренера" }]}
        >
          <Select
            {...trainerSelectProps}
            size="large"
            placeholder="Выберите тренера"
          />
        </Form.Item>

        <Form.Item
          label="Тип тренировки"
          name="training_type"
          rules={[{ required: true, message: "Выберите тип тренировки" }]}
          initialValue="group_adult"
        >
          <Select
            size="large"
            placeholder="Выберите тип тренировки"
            onChange={(val) => setTrainingType(String(val))}
          >
            {trainingTypes.map((t) => (
              <Select.Option key={t.value} value={t.value}>
                {t.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="День недели"
          name="weekday"
          rules={[{ required: true, message: "Выберите день недели" }]}
        >
          <Select
            size="large"
            placeholder="Выберите день недели"
            onChange={(val) => setSelectedWeekday(Number(val))}
          >
            {weekdays.map((d) => (
              <Select.Option key={d.value} value={d.value}>
                {d.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Время начала"
          name="start_time"
          rules={[{ required: true, message: "Укажите время начала" }]}
        >
          <TimePicker
            size="large"
            format="HH:mm"
            placeholder="10:00"
            style={{ width: "100%" }}
            disabledHours={getDisabledHours}
            disabledMinutes={getDisabledMinutes}
            disabledSeconds={() => []}
            hideDisabledOptions
            onChange={(time) => setStartTimeObj(time)}
          />
        </Form.Item>

        <Form.Item label="Время окончания">
          <Input
            value={
              startTimeObj
                ? dayjs(startTimeObj.format("HH:mm"), "HH:mm")
                    .add(
                      trainingType && String(trainingType).startsWith("group")
                        ? 90
                        : 60,
                      "minute"
                    )
                    .format("HH:mm")
                : ""
            }
            disabled
          />
        </Form.Item>

        <Form.Item label="Длительность">
          <Input
            value={
              trainingType && String(trainingType).startsWith("group")
                ? "1 ч 30 мин"
                : "1 ч 30 мин"
            }
            disabled
          />
        </Form.Item>

        <Form.Item
          label="Максимум участников"
          name="clients_cap"
          rules={[{ required: true, message: "Укажите максимум участников" }]}
          initialValue={15}
        >
          <InputNumber
            size="large"
            min={1}
            max={50}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Space
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}
        >
          <Button onClick={() => drawerProps.onClose?.()}>Отмена</Button>
          <Button type="primary" {...saveButtonProps}>
            Создать
          </Button>
        </Space>
      </Form>
    </Drawer>
  );
};
