import axios from "axios";
import { API_URL } from "@providers/constants";
import type {
  ApiScheduleResponse,
  ApiVisitsResponse,
  ApiTicketsResponse,
  ApiCustomerSearchResponse,
  CreateVisitRequest,
  CreateInstantEventRequest,
  ApiResponse,
  Availability,
  UpdateWeekdayAvailabilityRequest,
  BookSessionRequest,
  CreateOnceEventRequest,
  CancelBookingRequest,
  RegisterVisitRequest,
} from "@/types/schedule";

// Create instant (staff-only) event
// POST /schedule/events/instant


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
  // GET /schedule?from=2025-12-25T00:00:00Z&to=2025-12-30T00:00:00Z
  getSchedule: async (from: Date, to: Date): Promise<ApiScheduleResponse> => {
    const response = await api.get<ApiScheduleResponse>("/schedule", {
      params: {
        from: from.toISOString(),
        to: to.toISOString(),
      },
    });
    return response.data;
  },

  // Get availability
  // GET /schedule/availability
  getAvailability: async (): Promise<ApiResponse<Availability[]>> => {
    const response = await api.get<ApiResponse<Availability[]>>(
      "/schedule/availability"
    );
    return response.data;
  },

  // Update weekday availability
  // PUT /schedule/availability
  updateWeekdayAvailability: async (
    data: UpdateWeekdayAvailabilityRequest
  ): Promise<ApiResponse<null>> => {
    const response = await api.put<ApiResponse<null>>(
      "/schedule/availability",
      data
    );
    return response.data;
  },

  // Book a session
  // POST /schedule/sessions/:id/book
  bookSession: async (
    sessionId: string,
    data: BookSessionRequest
  ): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>(
      `/schedule/sessions/${sessionId}/book`,
      data
    );
    return response.data;
  },

  // Create a one-time event (and auto create session + booking)
  // POST /schedule/events/once
  createOnceEvent: async (
    data: CreateOnceEventRequest
  ): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>(`/schedule/events/once`, data);
    return response.data;
  },

  // Create an instant personal event (staff-only): creates event -> session -> booking -> visit atomically
  // POST /schedule/events/instant
  createInstantEvent: async (
    data: CreateInstantEventRequest
  ): Promise<ApiResponse<{ id: string }>> => {
    const response = await api.post<ApiResponse<{ id: string }>>(
      `/schedule/events/instant`,
      data
    );
    return response.data;
  },

  // Register visit by booking id
  // POST /schedule/bookings/:id/visit
  registerVisitFromBooking: async (bookingId: string): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>(`/schedule/bookings/${bookingId}/visit`);
    return response.data;
  },

  // Cancel booking
  // POST /schedule/bookings/:id/cancel
  cancelBooking: async (
    bookingId: string,
    data: CancelBookingRequest
  ): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>(`/schedule/bookings/${bookingId}/cancel`, data);
    return response.data;
  },
};

// Visits API
export const visitsApi = {
  // Get visits list with pagination
  // GET /visits?page=1&limit=20
  getVisits: async (
    page: number = 1,
    limit: number = 20
  ): Promise<ApiVisitsResponse> => {
    const response = await api.get<ApiVisitsResponse>("/visits", {
      params: {
        page,
        limit,
      },
    });
    return response.data;
  },

  // Create a new visit
  // POST /visits
  createVisit: async (data: CreateVisitRequest): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>("/visits", data);
    return response.data;
  },
};

// Customers API
export const customersApi = {
  // Search customers by query
  // GET /customers/search?q=...
  searchCustomers: async (
    query: string
  ): Promise<ApiCustomerSearchResponse> => {
    const response = await api.get<ApiCustomerSearchResponse>(
      "/customers/search",
      {
        params: { q: query },
      }
    );
    return response.data;
  },
};

// Tickets API
export const ticketsApi = {
  // Get customer's tickets
  // GET /tickets/customer/:id
  getCustomerTickets: async (
    customerId: string
  ): Promise<ApiTicketsResponse> => {
    const response = await api.get<ApiTicketsResponse>(
      `/tickets/customer/${customerId}`
    );
    return response.data;
  },
};

export default api;
