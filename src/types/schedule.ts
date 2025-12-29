import { Customer } from "./customer";
import { Trainer } from "./trainer";

export type TrainingType = "individual" | "group_adult" | "group_child";
export type TrainingSpec =
  | "box"
  | "thai"
  | "kickboxing"
  | "mma"
  | "women_martial_arts";
export type SessionStatus = "scheduled" | "canceled" | "completed";
export type BookingStatus = "requested" | "confirmed" | "canceled" | "visited";
export type EventType = "recurring" | "once";
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Schedule {
  date: string; // ISO 8601
  weekday: Weekday;
  sessions: ScheduleSession[];
}

export interface ScheduleSession {
  id: string;
  start_at: string; // ISO 8601
  end_at: string; // ISO 8601
  status: SessionStatus; // TODO: проверить enum
  created_at?: string;
  updated_at?: string;
  event?: ScheduleEvent;
}

export interface ScheduleEvent {
  id: string;
  type: EventType; // "recurring" | "once"
  training_type: TrainingType;
  training_spec: TrainingSpec;
  clients_cap: number;
  start_at?: string; // ISO 8601 для "once" событий
  end_at?: string; // ISO 8601 для "once" событий
  weekday?: Weekday; // 0-6 для "recurring" событий
  start_time?: string; // ISO 8601 время для "recurring"
  end_time?: string; // ISO 8601 время для "recurring"
  created_at?: string;
  updated_at?: string;
  trainer?: Trainer;
}

export interface ScheduleVisit {
  id: string;
  booking_id: string;
  ticket_id?: string;
  is_charged: boolean;
  visit_at: string; // ISO 8601
  left_at?: string; // ISO 8601
  created_at: string;
  updated_at: string;
}

export interface ScheduleAvailability {
  weekday: Weekday;
  start_time: string; // HH:MM
  end_time: string; // HH:MM
}

export interface ScheduleBooking {
  id: string;
  session_id: string;
  customer_id: string;
  status: BookingStatus;
  canceled_by?: string | null;
  created_at: string;
  updated_at?: string;
  customer?: Customer | null;
  session?: ScheduleSession | null;
}

export interface ScheduleRequest {
  from: string;
  to: string;
}

// TODO: возможно не нужна, так как есть RegisterVisitRequest
export interface SaveVisitRequest {
  customer_id: string;
  ticket_id?: string;
  is_charged: boolean;
}

export interface RegisterVisitRequest {
  ticket_id?: string;
  is_charged: boolean;
}

export interface CreateRecurringEventRequest {
  trainer_id: string;
  training_type: TrainingType;
  weekday: Weekday;
  start_time: string; // TODO: HH:MM
  clients_cap: number;
}

export interface CreateOnceEventRequest {
  trainer_id: string;
  customer_id: string;
  start_time: string; // TODO: ISO 8601
}

export interface BookSessionRequest {
  customer_id: string;
}

export interface CancelBookingRequest {
  canceled_by: string; // TODO: найти enum
}

export interface UpdateWeekdayAvailabilityRequest {
  weekday: Weekday;
  start_time: string; // TODO: HH:MM
  end_time: string; // TODO: HH:MM
}
