"use client";

import React, { useState } from "react";
import { CheckCircleOutlined } from "@ant-design/icons";
import {
  Modal,
  Form,
  Button,
  Space,
  Select,
  DatePicker,
  Card,
  Alert,
} from "antd";
import dayjs from "dayjs";
import type { ScheduleAvailability } from "@/types/schedule";
import { scheduleApi } from "@/lib/api/schedule";
import { useSelect } from "@refinedev/antd";
import { useInvalidate, useNotification } from "@refinedev/core";
import { useRouter } from "next/navigation";

interface BookPersonalSessionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  availability?: ScheduleAvailability[]; // array of weekday availabilities
}

export default function BookPersonalSessionModal({
  open,
  onClose,
  onSuccess,
  availability,
}: BookPersonalSessionModalProps) {
  const [form] = Form.useForm();
  const invalidate = useInvalidate();
  const router = useRouter();
  const { open: openNotification } = useNotification();

  const { selectProps: trainerSelectProps } = useSelect({
    resource: "trainers",
    optionLabel: (trainer: any) => `${trainer.short_name}`,
  });

  const [selectedCustomerLabel, setSelectedCustomerLabel] = useState<
    string | null
  >(null);

  const { selectProps: customerSelectProps } = useSelect({
    resource: "customers",
    optionLabel: (c: any) => c.full_name || `${c.first_name} ${c.last_name}`,
    pagination: { pageSize: 20 },
  });

  const customerId = Form.useWatch("customer_id", form);

  // Disabled time logic based on availability for the selected weekday
  const getDisabledTimeForDate = (date?: any) => {
    if (!date) {
      return {
        disabledHours: () => [],
        disabledMinutes: () => [],
        disabledSeconds: () => [],
      };
    }

    const weekday = (date.day && date.day()) ?? new Date(date).getDay();

    const avail = (availability || []).find(
      (a) => Number(a.weekday) === Number(weekday)
    );

    if (!avail) {
      // no availability for this weekday — disable all hours
      return {
        disabledHours: () => Array.from({ length: 24 }, (_, i) => i),
        disabledMinutes: () => Array.from({ length: 60 }, (_, i) => i),
        disabledSeconds: () => Array.from({ length: 60 }, (_, i) => i),
      };
    }

    const [sh, sm] = avail.start_time.split(":").map(Number);
    const [eh, em] = avail.end_time.split(":").map(Number);

    const disabledHours = () => {
      const res: number[] = [];
      for (let h = 0; h < 24; h++) {
        if (h < sh || h > eh) res.push(h);
      }
      return res;
    };

    const disabledMinutes = (hour: number) => {
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

    return {
      disabledHours,
      disabledMinutes,
      disabledSeconds: () => [],
    };
  };

  const handleCreateInstant = async () => {
    try {
      const values = await form.validateFields();

      const payload: any = {
        trainer_id: values.trainer_id,
        customer_id: values.customer_id,
        start_time: dayjs(values.start_time).toISOString(),
      };

      await scheduleApi.createOnceEvent(payload);

      openNotification?.({
        type: "success",
        message: "Персональный визит создан",
      });
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
        openNotification?.({
          type: "error",
          message: "Только сотрудник",
        });
      } else if (
        status === 409 ||
        errCode === "busy" ||
        (errMsg && errMsg.toLowerCase().includes("busy"))
      ) {
        openNotification?.({
          type: "error",
          message: "Тренер занят в это время",
        });
      } else if (status === 400) {
        openNotification?.({
          type: "error",
          message: "Неверный формат времени",
        });
      } else {
        openNotification?.({
          type: "error",
          message: errMsg || "Ошибка создания мгновенной записи",
        });
      }
    }
  };

  // Watch form values so button enable state updates when user fills fields
  const trainerId = Form.useWatch("trainer_id", form);
  const startTime = Form.useWatch("start_time", form);
  const isSubmitDisabled = !customerId || !trainerId || !startTime;

  return (
    <Modal
      title={
        <Space>
          <CheckCircleOutlined />
          {"Запись на персональную тренировку"}
        </Space>
      }
      open={open}
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
            label={"Тренер"}
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
            label={"Клиент"}
            name="customer_id"
            rules={[{ required: true, message: "Выберите клиента" }]}
          >
            <Select
              {...customerSelectProps}
              size="large"
              placeholder="Выберите клиента"
            />

            {selectedCustomerLabel && (
              <Alert
                message={`Выбран: ${selectedCustomerLabel}`}
                type="success"
                showIcon
                style={{ marginTop: 8 }}
                closable
                onClose={() => {
                  form.resetFields(["customer_id"]);
                  setSelectedCustomerLabel(null);
                }}
              />
            )}
          </Form.Item>

          <Form.Item
            label={"Дата и время начала"}
            name="start_time"
            rules={[{ required: true, message: "Укажите дату и время" }]}
          >
            <DatePicker
              showTime={{ disabledTime: getDisabledTimeForDate }}
              minDate={dayjs()}
              style={{ width: "100%" }}
              showSecond={false}
              hideDisabledOptions
            />
          </Form.Item>
        </Form>
      </Card>
    </Modal>
  );
}
