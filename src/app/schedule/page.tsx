"use client";

import React, { useState, useMemo } from "react";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { List } from "@refinedev/antd";
import { useCustom } from "@refinedev/core";
import {
  Card,
  Badge,
  Space,
  Button,
  Modal,
  Descriptions,
  Tag,
  Empty,
} from "antd";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { useTranslations } from "next-intl";
import type { Session } from "@/types/schedule";
import BookSessionModal from "../../components/schedule/BookSessionModal";

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
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [dateRange, setDateRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const scheduleQuery = useCustom({
    url: "schedule",
    method: "get",
    config: {
      query: dateRange
        ? {
            from: dateRange.start.toISOString(),
            to: dateRange.end.toISOString(),
          }
        : undefined,
    },
    queryOptions: {
      enabled: !!dateRange,
    },
  });

  const scheduleData = scheduleQuery.query.data;
  const refetch = scheduleQuery.query.refetch;

  // Преобразуем данные сессий в события для FullCalendar
  const calendarEvents = useMemo(() => {
    if (!scheduleData?.data?.data) return [];

    const events: any[] = [];
    scheduleData.data.data.forEach((dayData: any) => {
      dayData.sessions.forEach((session: Session) => {
        const percentage =
          (session.bookings_count / session.event.clients_cap) * 100;
        let backgroundColor = "#52c41a"; // success
        if (percentage >= 90) backgroundColor = "#ff4d4f"; // error
        else if (percentage >= 70) backgroundColor = "#faad14"; // warning

        events.push({
          id: session.id,
          title: `${session.event.trainer.short_name} - ${humanizeTrainingSpec(
            session.event.training_spec
          )}`,
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
  }, [scheduleData]);

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

  const getCapacityColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return "error";
    if (percentage >= 70) return "warning";
    return "success";
  };

  function humanizeTrainingSpec(training_spec: string): React.ReactNode {
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

  const handleEventClick = (info: EventClickArg) => {
    const session = info.event.extendedProps.session as Session;
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
          {t("title", { default: "Календарь расписания" })}
        </Space>
      }
    >
      <Card>
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
      </Card>

      {/* Session Details Modal */}
      <Modal
        title={
          <Space>
            <ClockCircleOutlined />
            {t("details")}
          </Space>
        }
        open={!!selectedSession && !showBookingModal}
        onCancel={() => setSelectedSession(null)}
        footer={[
          <Button key="cancel" onClick={() => setSelectedSession(null)}>
            Закрыть
          </Button>,
          <Button
            key="book"
            type="primary"
            onClick={() => setShowBookingModal(true)}
          >
            {t("book")}
          </Button>,
        ]}
        width={700}
      >
        {selectedSession && (
          <>
            <Descriptions column={2} bordered>
              <Descriptions.Item label={t("trainer")}>
                {selectedSession.event.trainer.full_name}
              </Descriptions.Item>
              <Descriptions.Item label={t("time")}>
                {format(parseISO(selectedSession.start_at), "HH:mm", {
                  locale: ru,
                })}{" "}
                -{" "}
                {format(parseISO(selectedSession.end_at), "HH:mm", {
                  locale: ru,
                })}
              </Descriptions.Item>
              <Descriptions.Item label={t("type")}>
                <Tag
                  color={getTrainingTypeColor(
                    selectedSession.event.training_type
                  )}
                >
                  {selectedSession.event.training_type}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t("specialization")}>
                {humanizeTrainingSpec(selectedSession.event.training_spec)}
              </Descriptions.Item>
              <Descriptions.Item label={t("capacity")} span={2}>
                <Badge
                  status={getCapacityColor(
                    selectedSession.bookings_count,
                    selectedSession.event.clients_cap
                  )}
                  text={`${selectedSession.bookings_count}/${selectedSession.event.clients_cap}`}
                />
              </Descriptions.Item>
            </Descriptions>

            <Card
              title={`${t("participants")} (${
                selectedSession.bookings.length
              })`}
              style={{ marginTop: 16 }}
              size="small"
            >
              {selectedSession.bookings.length === 0 ? (
                <Empty description={t("noBookings")} />
              ) : (
                <Space direction="vertical" style={{ width: "100%" }}>
                  {selectedSession.bookings.map((booking) => (
                    <Card key={booking.id} size="small">
                      <Space
                        style={{
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>{booking.customer_name}</span>
                        <Space>
                          {booking.has_ticket && (
                            <Tag color="green">🎫 Абонемент</Tag>
                          )}
                          <Tag
                            color={
                              booking.status === "confirmed"
                                ? "success"
                                : "default"
                            }
                          >
                            {booking.status}
                          </Tag>
                        </Space>
                      </Space>
                    </Card>
                  ))}
                </Space>
              )}
            </Card>
          </>
        )}
      </Modal>

      {/* Booking Modal */}
      {showBookingModal && selectedSession && (
        <BookSessionModal
          session={selectedSession}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedSession(null);
          }}
          onSuccess={() => {
            refetch();
            setShowBookingModal(false);
            setSelectedSession(null);
          }}
        />
      )}
    </List>
  );
}
