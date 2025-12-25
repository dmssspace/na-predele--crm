export type TrainingType = "individual" | "group_adult" | "group_child";

export type TrainingSpec =
  | "box"
  | "thai"
  | "kickboxing"
  | "mma"
  | "women_martial_arts";

export type SessionStatus = "scheduled" | "canceled" | "completed";

export type BookingStatus = "requested" | "confirmed" | "canceled";

export type EventType = "recurring" | "once";

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

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

// Trainer из бэкенда (Go структура trainers.TrainerProfile)
export interface Trainer {
  id: string;
  user_id: string;
  full_name: string;
  short_name: string;
  spec: string;
  training_exp_start_on: string;
  birth_date: string;
  gender: string;
  regalia?: string[];
  approach?: string;
  intro_url?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

// ScheduleEvent из Go
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

// ScheduleSession из Go
export interface ScheduleSession {
  id: string;
  start_at: string; // ISO 8601
  end_at: string; // ISO 8601
  status: SessionStatus;
  created_at?: string;
  updated_at?: string;
  event?: ScheduleEvent;
}

// Schedule из Go (один день в расписании)
export interface Schedule {
  date: string; // ISO 8601 date
  weekday: Weekday;
  sessions: ScheduleSession[];
}

// API Response wrapper
export interface ApiScheduleResponse {
  status: string;
  data: Schedule[];
}

// ScheduleResponse - для совместимости
export type ScheduleResponse = ApiScheduleResponse;

// Visit из Go
export interface Visit {
  id: string;
  customer_id?: string;
  ticket_id?: string | null;
  is_charged: boolean;
  created_at: string;
  updated_at?: string;
}

// API Response для визитов
export interface ApiVisitsResponse {
  status: string;
  data: Visit[];
}

// Ticket (абонемент)
export interface TicketPlan {
  id: string;
  title: string;
  description?: string;
  price: number;
  visits_count: number;
  validity_days: number;
}

export interface CustomerTicket {
  id: string;
  customer_id: string;
  plan_id: string;
  start_date: string;
  end_date: string;
  remaining_visits: number;
  status: string; // "active" | "expired" | "used"
  created_at: string;
  updated_at?: string;
  plan?: TicketPlan;
}

// API Response для абонементов
export interface ApiTicketsResponse {
  status: string;
  data: CustomerTicket[];
}

// Customer search
export interface CustomerSearchResult {
  id: string;
  full_name: string;
  short_name: string;
  phone_number?: string;
  user?: {
    email: string;
    phone_number?: string;
  };
}

export interface ApiCustomerSearchResponse {
  status: string;
  data: CustomerSearchResult[];
}

// Create visit request
export interface CreateVisitRequest {
  customer_id: string;
  ticket_id?: string;
  is_charged: boolean;
}

// Generic API Response
export interface ApiResponse<T = any> {
  status?: string;
  success?: boolean;
  message?: string;
  data?: T;
  error?:
    | string
    | {
        code: string;
        message: string;
      };
}

// Legacy interfaces для обратной совместимости
export interface Event {
  id: string;
  event_type: EventType;
  training_type: TrainingType;
  training_spec: TrainingSpec;
  clients_cap: number;
  weekday?: Weekday;
  start_time?: string;
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

export interface UpdateWeekdayAvailabilityRequest {
  weekday: Weekday;
  start_time: string;
  end_time: string;
}

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
