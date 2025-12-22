import axios from "axios";
import { API_URL } from "@providers/constants";
import type {
  ScheduleResponse,
  ApiResponse,
  BookSessionRequest,
  CreateRecurringEventRequest,
  CreateOnceEventRequest,
  RegisterVisitRequest,
  CancelBookingRequest,
  ApproveBookingRequestRequest,
  Booking,
  Visit,
  Event,
  BookingRequest,
  Availability,
  Trainer,
  Ticket,
  TrainingSpec,
} from "@/types/schedule";

const api = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Schedule API
export const scheduleApi = {
  // Get full schedule for CRM
  getSchedule: async (from: Date, to: Date): Promise<ScheduleResponse> => {
    const response = await api.get<ScheduleResponse>("/schedule", {
      params: {
        from: from.toISOString(),
        to: to.toISOString(),
      },
    });
    return response.data;
  },

  // Events Management
  getEvents: async (type?: "recurring" | "once"): Promise<ApiResponse<Event[]>> => {
    const response = await api.get<ApiResponse<Event[]>>("/schedule/events", {
      params: type ? { type } : {},
    });
    return response.data;
  },

  createRecurringEvent: async (
    data: CreateRecurringEventRequest
  ): Promise<ApiResponse<{ id: string }>> => {
    const response = await api.post<ApiResponse<{ id: string }>>(
      "/schedule/events/recurring",
      data
    );
    return response.data;
  },

  createOnceEvent: async (
    data: CreateOnceEventRequest
  ): Promise<ApiResponse<{ id: string }>> => {
    const response = await api.post<ApiResponse<{ id: string }>>(
      "/schedule/events/once",
      data
    );
    return response.data;
  },

  deleteEvent: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.delete<ApiResponse<{ message: string }>>(
      `/schedule/events/${id}`
    );
    return response.data;
  },

  // Bookings Management
  bookSession: async (
    sessionID: string,
    data: BookSessionRequest
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post<ApiResponse<{ message: string }>>(
      `/schedule/sessions/${sessionID}/book`,
      data
    );
    return response.data;
  },

  getBookings: async (params?: {
    session_id?: string;
    customer_id?: string;
  }): Promise<ApiResponse<Booking[]>> => {
    const response = await api.get<ApiResponse<Booking[]>>("/schedule/bookings", {
      params,
    });
    return response.data;
  },

  cancelBooking: async (
    id: string,
    data: CancelBookingRequest
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post<ApiResponse<{ message: string }>>(
      `/schedule/bookings/${id}/cancel`,
      data
    );
    return response.data;
  },

  registerVisitFromBooking: async (
    bookingID: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post<ApiResponse<{ message: string }>>(
      `/schedule/bookings/${bookingID}/visit`
    );
    return response.data;
  },

  // Visits Management
  registerVisit: async (
    data: RegisterVisitRequest
  ): Promise<ApiResponse<string>> => {
    const response = await api.post<ApiResponse<string>>("/visits", data);
    return response.data;
  },

  getVisits: async (params?: {
    customer_id?: string;
    from?: string;
    to?: string;
  }): Promise<ApiResponse<Visit[]>> => {
    const response = await api.get<ApiResponse<Visit[]>>("/visits", { params });
    return response.data;
  },

  // Booking Requests
  getBookingRequests: async (
    status?: "pending" | "rejected" | "assigned"
  ): Promise<ApiResponse<BookingRequest[]>> => {
    const response = await api.get<ApiResponse<BookingRequest[]>>(
      "/schedule/booking-requests",
      {
        params: status ? { status } : {},
      }
    );
    return response.data;
  },

  approveBookingRequest: async (
    id: string,
    data: ApproveBookingRequestRequest
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post<ApiResponse<{ message: string }>>(
      `/schedule/booking-requests/${id}/approve`,
      data
    );
    return response.data;
  },

  rejectBookingRequest: async (
    id: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post<ApiResponse<{ message: string }>>(
      `/schedule/booking-requests/${id}/reject`
    );
    return response.data;
  },

  // Sessions
  cancelSession: async (
    id: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post<ApiResponse<{ message: string }>>(
      `/schedule/sessions/${id}/cancel`
    );
    return response.data;
  },

  completeSession: async (
    id: string
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post<ApiResponse<{ message: string }>>(
      `/schedule/sessions/${id}/complete`
    );
    return response.data;
  },

  // Settings
  getAvailability: async (): Promise<ApiResponse<Availability[]>> => {
    const response = await api.get<ApiResponse<Availability[]>>(
      "/schedule/availability"
    );
    return response.data;
  },

  updateAvailability: async (
    data: Availability
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.put<ApiResponse<{ message: string }>>(
      "/schedule/availability",
      data
    );
    return response.data;
  },

  // Reference Data
  getTrainingSpecs: async (): Promise<ApiResponse<TrainingSpec[]>> => {
    const response = await api.get<ApiResponse<TrainingSpec[]>>(
      "/schedule/training-specs"
    );
    return response.data;
  },
};

// Trainers API
export const trainersApi = {
  getTrainers: async (): Promise<ApiResponse<Trainer[]>> => {
    const response = await api.get<ApiResponse<Trainer[]>>("/trainers");
    return response.data;
  },
};

// Tickets API
export const ticketsApi = {
  getTickets: async (params?: {
    customer_id?: string;
    status?: string;
  }): Promise<ApiResponse<Ticket[]>> => {
    const response = await api.get<ApiResponse<Ticket[]>>("/tickets", { params });
    return response.data;
  },
};

export default api;
