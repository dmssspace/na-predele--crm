"use client";

import React, { useState, useMemo, useRef } from "react";
import { List } from "@refinedev/antd";
import SessionDetailsDrawer from "@/components/schedule/SessionDetailsDrawer";
import { Card, Badge, Space, Button, Tag, Spin, Alert } from "antd";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import type { ScheduleSession, Schedule } from "@/types/schedule";
import { scheduleApi } from "@/lib/api/schedule";
import { useQuery } from "@tanstack/react-query";
import BookSessionModal from "@/components/schedule/BookSessionModal";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ruLocale from "@fullcalendar/core/locales/ru";
import type { EventClickArg, DatesSetArg } from "@fullcalendar/core";

import "@fullcalendar/core/index.js";
import "@fullcalendar/daygrid/index.js";
import "@fullcalendar/timegrid/index.js";
import { useCustom } from "@refinedev/core";
import BookPersonalSessionModal from "@components/schedule/BookPersonalSessionModal";

export default function SchedulePage() {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [selectedSession, setSelectedSession] =
    useState<ScheduleSession | null>(null);
  const [dateRange, setDateRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const getCalendarWeekday = () => {
    const calendarAPI = calendarRef.current?.getApi();

    if (!calendarAPI) return null;

    const currentDate = calendarAPI.getDate();

    return currentDate.getDay(); // 0 (воскресенье) - 6 (суббота)
  };

  const { query: availabilityQuery } = useCustom({
    method: "get",
    url: "/schedule/availability",
    config: {},
  });

  const { data: availabilityData, isLoading: isAvailabilityLoading } =
    availabilityQuery;

  const minAvailabilityHour = useMemo(() => {
    const availability = availabilityData?.data?.data;

    const parseTime = (time?: string) => {
      if (!time) return 24 * 60;
      const [hh, mm] = time.split(":").map(Number);
      return hh * 60 + mm;
    };

    if (!availability || availability.length === 0) {
      return "08:00";
    }

    let minHour = availability[0]?.start_time ?? "08:00";

    availability.forEach((slot: any) => {
      const start = slot?.start_time;
      if (!start) return;
      if (parseTime(start) < parseTime(minHour)) {
        minHour = start;
      }
    });

    return minHour;
  }, [availabilityData]);

  const maxAvailabilityHour = useMemo(() => {
    const availability = availabilityData?.data?.data;

    const parseTime = (time?: string) => {
      if (!time) return 0;
      const [hh, mm] = time.split(":").map(Number);
      return hh * 60 + mm;
    };

    if (!availability || availability.length === 0) {
      return "22:00";
    }

    let maxHour = availability[0]?.end_time ?? "22:00";

    availability.forEach((slot: any) => {
      const end = slot?.end_time;
      if (!end) return;
      if (parseTime(end) > parseTime(maxHour)) {
        maxHour = end;
      }
    });

    return maxHour;
  }, [availabilityData]);

  const {
    data: scheduleResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["schedule", dateRange?.start, dateRange?.end],
    queryFn: () => {
      if (!dateRange) return Promise.resolve({ data: [], status: "success" });
      return scheduleApi.getSchedule(dateRange.start, dateRange.end);
    },
    enabled: !!dateRange,
  });

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isInstantOpen, setIsInstantOpen] = useState(false);

  const calendarEvents = useMemo(() => {
    const scheduleData = scheduleResponse?.data;
    if (!scheduleData || !Array.isArray(scheduleData)) return [];

    const events: any[] = [];
    scheduleData.forEach((day: Schedule) => {
      if (!day.sessions || !Array.isArray(day.sessions)) return;

      day.sessions.forEach((session: ScheduleSession) => {
        if (!session.event) return;

        let backgroundColor = "#52c41a";

        if (session.event.type === "once") {
          backgroundColor = "#fa8c16";
        }

        if (session.status === "canceled" || session.status === "completed") {
          backgroundColor = "#d9d9d9";
        }

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
    <List title={"Календарь клуба"}>
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
        <Space style={{ marginBottom: 12 }}>
          <Button type="primary" onClick={() => setIsInstantOpen(true)}>
            {"Запись на персональную тренировку"}
          </Button>
        </Space>
        <Spin spinning={isLoading || isAvailabilityLoading}>
          <FullCalendar
            ref={calendarRef}
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "timeGridWeek,timeGridDay",
            }}
            locale={ruLocale}
            firstDay={1}
            slotMinTime={minAvailabilityHour}
            slotMaxTime={maxAvailabilityHour}
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

      <SessionDetailsDrawer
        session={selectedSession}
        open={!!selectedSession}
        onClose={() => setSelectedSession(null)}
        onBook={() => setIsBookingOpen(true)}
      />

      {isBookingOpen && selectedSession && (
        <BookSessionModal
          session={selectedSession as any}
          onClose={() => setIsBookingOpen(false)}
          onSuccess={() => {
            setIsBookingOpen(false);
            setSelectedSession(null);
            refetch();
          }}
        />
      )}

      <BookPersonalSessionModal
        open={isInstantOpen}
        availability={availabilityData?.data?.data || []}
        onClose={() => setIsInstantOpen(false)}
        onSuccess={() => {
          setIsInstantOpen(false);
          refetch();
        }}
      />
    </List>
  );
}
