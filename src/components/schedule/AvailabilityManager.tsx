import React, { useState } from "react";
import { Table, Button, TimePicker, message, Space } from "antd";
import { EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { scheduleApi } from "@/lib/api/schedule";
import type {
  ScheduleAvailability,
  UpdateWeekdayAvailabilityRequest,
} from "@/types/schedule";
import dayjs from "dayjs";

const weekdayNames = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

interface EditableAvailability extends ScheduleAvailability {
  editing?: boolean;
}

export default function AvailabilityManager() {
  const queryClient = useQueryClient();
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<
    Partial<UpdateWeekdayAvailabilityRequest>
  >({});

  const { data: availabilityResponse, isLoading } = useQuery({
    queryKey: ["availability"],
    queryFn: scheduleApi.getAvailability,
  });

  const updateMutation = useMutation({
    mutationFn: scheduleApi.updateWeekdayAvailability,
    onSuccess: () => {
      message.success("Расписание обновлено");
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      setEditingRow(null);
      setEditedData({});
    },
    onError: (error: any) => {
      message.error(
        `Ошибка: ${
          error.response?.data?.error?.message || "Неизвестная ошибка"
        }`
      );
    },
  });

  const availability = availabilityResponse?.data || [];

  const handleEdit = (record: ScheduleAvailability) => {
    setEditingRow(record.weekday);
    setEditedData({
      weekday: record.weekday,
      start_time: record.start_time,
      end_time: record.end_time,
    });
  };

  const handleSave = () => {
    if (
      editedData.weekday !== undefined &&
      editedData.start_time &&
      editedData.end_time
    ) {
      updateMutation.mutate({
        weekday: editedData.weekday,
        start_time: editedData.start_time,
        end_time: editedData.end_time,
      });
    }
  };

  const handleCancel = () => {
    setEditingRow(null);
    setEditedData({});
  };

  const handleTimeChange = (field: "start_time" | "end_time", time: any) => {
    if (time) {
      setEditedData((prev) => ({
        ...prev,
        [field]: time.format("HH:mm"),
      }));
    }
  };

  const columns = [
    {
      title: "День недели",
      dataIndex: "weekday",
      key: "weekday",
      render: (weekday: number) => weekdayNames[weekday],
    },
    {
      title: "Время начала",
      dataIndex: "start_time",
      key: "start_time",
      render: (start_time: string, record: ScheduleAvailability) => {
        if (editingRow === record.weekday) {
          return (
            <TimePicker
              format="HH:mm"
              defaultValue={start_time ? dayjs(start_time, "HH:mm") : undefined}
              onChange={(time) => handleTimeChange("start_time", time)}
              placeholder="Выберите время"
            />
          );
        }
        return start_time || "Не установлено";
      },
    },
    {
      title: "Время окончания",
      dataIndex: "end_time",
      key: "end_time",
      render: (end_time: string, record: ScheduleAvailability) => {
        if (editingRow === record.weekday) {
          return (
            <TimePicker
              format="HH:mm"
              defaultValue={end_time ? dayjs(end_time, "HH:mm") : undefined}
              onChange={(time) => handleTimeChange("end_time", time)}
              placeholder="Выберите время"
            />
          );
        }
        return end_time || "Не установлено";
      },
    },
    {
      title: "Действия",
      key: "actions",
      render: (_: any, record: ScheduleAvailability) => {
        if (editingRow === record.weekday) {
          return (
            <Space>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSave}
                loading={updateMutation.isPending}
                size="small"
              >
                Сохранить
              </Button>
              <Button
                icon={<CloseOutlined />}
                onClick={handleCancel}
                size="small"
              >
                Отмена
              </Button>
            </Space>
          );
        }
        return (
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            Редактировать
          </Button>
        );
      },
    },
  ];

  // Создаем данные для всех дней недели, даже если они не установлены
  const fullAvailability: EditableAvailability[] = [];

  for (let i = 0; i < 7; i++) {
    const existing = availability.find(
      (a: ScheduleAvailability) => a.weekday === i
    );

    fullAvailability.push({
      weekday: i as any,
      start_time: existing?.start_time || "",
      end_time: existing?.end_time || "",
    });
  }

  return (
    <Table
      columns={columns}
      dataSource={fullAvailability}
      rowKey="weekday"
      loading={isLoading}
      pagination={false}
      size="small"
    />
  );
}
