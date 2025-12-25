import axios from "axios";
import { API_URL } from "@providers/constants";
import type {
  ApiScheduleResponse,
  ApiVisitsResponse,
  ApiTicketsResponse,
  ApiCustomerSearchResponse,
  CreateVisitRequest,
  ApiResponse,
  Availability,
  UpdateWeekdayAvailabilityRequest,
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
