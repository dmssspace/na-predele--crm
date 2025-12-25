import React, { useState, useMemo } from "react";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { List } from "@refinedev/antd";
import {
  Card,
  Badge,
  Space,
  Button,
  Modal,
  Descriptions,
  Tag,
  Spin,
  Alert,
} from "antd";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { useTranslations } from "next-intl";
import type { ScheduleSession, Schedule } from "@/types/schedule";
import { scheduleApi } from "@/lib/api/schedule";
import { useQuery } from "@tanstack/react-query";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ruLocale from "@fullcalendar/core/locales/ru";
import type { EventClickArg, DatesSetArg } from "@fullcalendar/core";

// FullCalendar стили
import "@fullcalendar/core/index.js";
import "@fullcalendar/daygrid/index.js";
import "@fullcalendar/timegrid/index.js";
import "./calendar.css";

export default function SchedulePage() {
  const t = useTranslations("schedule.calendar");
  const [selectedSession, setSelectedSession] =
    useState<ScheduleSession | null>(null);
  const [dateRange, setDateRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  // Fetch schedule data
  const {
    data: scheduleResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["schedule", dateRange?.start, dateRange?.end],
    queryFn: () => {
      if (!dateRange) return Promise.resolve({ data: [], status: "success" });
      return scheduleApi.getSchedule(dateRange.start, dateRange.end);
    },
    enabled: !!dateRange,
  });

  // Преобразуем данные сессий в события для FullCalendar
  const calendarEvents = useMemo(() => {
    const scheduleData = scheduleResponse?.data;
    if (!scheduleData || !Array.isArray(scheduleData)) return [];

    const events: any[] = [];
    scheduleData.forEach((day: Schedule) => {
      if (!day.sessions || !Array.isArray(day.sessions)) return;

      day.sessions.forEach((session: ScheduleSession) => {
        if (!session.event) return;

        // Определяем цвет по статусу
        let backgroundColor = "#52c41a"; // green для scheduled
        if (session.status === "canceled") backgroundColor = "#d9d9d9"; // gray
        else if (session.status === "completed") backgroundColor = "#1890ff"; // blue

        events.push({
          id: session.id,
          title: `${
            session.event.trainer?.short_name || "Тренер"
          } - ${humanizeTrainingSpec(session.event.training_spec)}`,
          start: session.start_at,
          end: session.end_at,
          backgroundColor,
          borderColor: backgroundColor,
          extendedProps: {
            session,
          },
        });
      });
    });

    return events;
  }, [scheduleResponse]);

  const getTrainingTypeColor = (type: string) => {
    switch (type) {
      case "individual":
        return "green";
      case "group_adult":
        return "blue";
      case "group_child":
        return "gold";
      default:
        return "default";
    }
  };

  function humanizeTrainingSpec(training_spec: string): string {
    switch (training_spec) {
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
        return training_spec;
    }
  }

  function humanizeTrainingType(training_type: string): string {
    switch (training_type) {
      case "individual":
        return "Индивидуальная";
      case "group_adult":
        return "Групповая (взрослые)";
      case "group_child":
        return "Групповая (дети)";
      default:
        return training_type;
    }
  }

  function humanizeSessionStatus(status: string): string {
    switch (status) {
      case "scheduled":
        return "Запланирована";
      case "canceled":
        return "Отменена";
      case "completed":
        return "Завершена";
      default:
        return status;
    }
  }

  const getSessionStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "green";
      case "canceled":
        return "default";
      case "completed":
        return "blue";
      default:
        return "default";
    }
  };

  const handleEventClick = (info: EventClickArg) => {
    const session = info.event.extendedProps.session as ScheduleSession;
    setSelectedSession(session);
  };

  const handleDatesSet = (arg: DatesSetArg) => {
    setDateRange({
      start: arg.start,
      end: arg.end,
    });
  };

  return (
    <List
      title={
        <Space>
          <CalendarOutlined />
          {t("title", { default: "Расписание" })}
        </Space>
      }
    >
      {error && (
        <Alert
          message="Ошибка загрузки"
          description="Не удалось загрузить расписание. Проверьте подключение к серверу."
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Card>
        <Spin spinning={isLoading}>
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "timeGridWeek,timeGridDay",
            }}
            locale={ruLocale}
            firstDay={1}
            slotMinTime="07:00:00"
            slotMaxTime="23:00:00"
            allDaySlot={false}
            height="auto"
            events={calendarEvents}
            eventClick={handleEventClick}
            datesSet={handleDatesSet}
            slotDuration="00:30:00"
            slotLabelInterval="01:00:00"
            nowIndicator={true}
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              meridiem: false,
            }}
            slotLabelFormat={{
              hour: "2-digit",
              minute: "2-digit",
              meridiem: false,
            }}
            buttonText={{
              today: "Сегодня",
              week: "Неделя",
              day: "День",
            }}
          />
        </Spin>
      </Card>

      {/* Session Details Modal */}
      <Modal
        title={
          <Space>
            <ClockCircleOutlined />
            Детали тренировки
          </Space>
        }
        open={!!selectedSession}
        onCancel={() => setSelectedSession(null)}
        footer={[
          <Button key="cancel" onClick={() => setSelectedSession(null)}>
            Закрыть
          </Button>,
        ]}
        width={700}
      >
        {selectedSession && selectedSession.event && (
          <>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Тренер">
                {selectedSession.event.trainer?.full_name || "Не указан"}
              </Descriptions.Item>
              <Descriptions.Item label="Время">
                {format(parseISO(selectedSession.start_at), "HH:mm", {
                  locale: ru,
                })}{" "}
                -{" "}
                {format(parseISO(selectedSession.end_at), "HH:mm", {
                  locale: ru,
                })}
              </Descriptions.Item>
              <Descriptions.Item label="Тип тренировки">
                <Tag
                  color={getTrainingTypeColor(
                    selectedSession.event.training_type
                  )}
                >
                  {humanizeTrainingType(selectedSession.event.training_type)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Специализация">
                {humanizeTrainingSpec(selectedSession.event.training_spec)}
              </Descriptions.Item>
              <Descriptions.Item label="Вместимость">
                <Badge
                  status="success"
                  text={`${selectedSession.event.clients_cap} мест`}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Статус">
                <Tag color={getSessionStatusColor(selectedSession.status)}>
                  {humanizeSessionStatus(selectedSession.status)}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Card title="Информация" style={{ marginTop: 16 }} size="small">
              <p>
                <strong>Дата:</strong>{" "}
                {format(parseISO(selectedSession.start_at), "dd MMMM yyyy", {
                  locale: ru,
                })}
              </p>
              {selectedSession.event.type === "recurring" && (
                <p>
                  <Tag color="blue">Регулярная тренировка</Tag>
                </p>
              )}
              {selectedSession.event.type === "once" && (
                <p>
                  <Tag color="orange">Разовая тренировка</Tag>
                </p>
              )}
            </Card>
          </>
        )}
      </Modal>
    </List>
  );
}
