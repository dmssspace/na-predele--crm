// Schedule Module Types

export type TrainingType = "individual" | "group_adult" | "group_child";
export type TrainingSpec = "box" | "thai" | "kickboxing" | "mma" | "women_martial_arts";
export type SessionStatus = "scheduled" | "canceled" | "completed";
export type BookingStatus = "requested" | "confirmed" | "canceled";
export type EventType = "recurring" | "once";
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Monday, 6 = Sunday

export interface Trainer {
  id: string;
  full_name: string;
  short_name: string;
  spec: TrainingSpec;
}

export interface Customer {
  id: string;
  full_name: string;
  short_name: string;
}

export interface Ticket {
  id: string;
  ticket_id: string;
  plan_name: string;
  remaining_sessions: number;
  remaining_visits: number;
  start_date: string;
  end_date: string;
  status: string;
}

export interface Event {
  id: string;
  event_type: EventType;
  training_type: TrainingType;
  training_spec: TrainingSpec;
  clients_cap: number;
  weekday?: Weekday;
  start_time?: string; // HH:MM format for recurring
  end_time?: string;
  trainer: Trainer;
}

export interface Booking {
  id: string;
  customer_name: string;
  customer_id?: string;
  status: BookingStatus;
  has_ticket: boolean;
  created_at?: string;
  ticket?: Ticket;
  session_id?: string;
  session_date?: string;
  session_training_spec?: string;
  session_trainer_name?: string;
  session?: {
    id: string;
    start_at: string;
    training_type: TrainingType;
  };
}

export interface Session {
  id: string;
  event_id: string;
  start_at: string;
  end_at: string;
  status: SessionStatus;
  event: Event;
  bookings_count: number;
  bookings: Booking[];
}

export interface ScheduleDay {
  date: string;
  weekday: Weekday;
  sessions: Session[];
}

export interface ScheduleResponse {
  success: boolean;
  data: ScheduleDay[];
}

export interface BookSessionRequest {
  customer_id: string;
  ticket_id?: string;
}

export interface CreateRecurringEventRequest {
  trainer_id: string;
  training_type: TrainingType;
  weekday: Weekday;
  start_time: string; // HH:MM
  clients_cap: number;
}

export interface CreateOnceEventRequest {
  trainer_id: string;
  customer_id: string;
  start_time: string; // ISO 8601
}

export interface Visit {
  id: string;
  customer_name: string;
  customer_id?: string;
  visited_at: string;
  session_date: string;
  session_training_spec: string;
  session_trainer_name: string;
  is_charged: boolean;
  ticket?: Ticket;
  session?: {
    id: string;
    training_type: TrainingType;
  };
}

export interface RegisterVisitRequest {
  customer_id: string;
  ticket_id?: string;
  is_charged?: boolean;
}

export interface CancelBookingRequest {
  canceled_by: "trainer" | "user";
}

export interface BookingRequest {
  id: string;
  customer_name: string;
  customer_phone: string;
  trainer: Trainer;
  status: "pending" | "rejected" | "assigned";
  created_at: string;
}

export interface ApproveBookingRequestRequest {
  customer_id: string;
  start_time: string;
}

export interface Availability {
  weekday: Weekday;
  start_time: string;
  end_time: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// UI Helper Types
export interface SessionWithDetails extends Session {
  capacity_percentage: number;
  is_full: boolean;
  available_spots: number;
}

export interface CustomerSearchResult {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  active_tickets: Ticket[];
}
