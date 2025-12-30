import { apiClient } from "./index";

import { ApiResponse } from "@/types/api";
import type {
  UpdateWeekdayAvailabilityRequest,
  BookSessionRequest,
  CreateOnceEventRequest,
  CancelBookingRequest,
  Schedule,
  ScheduleAvailability,
  ScheduleVisit,
} from "@/types/schedule";
import { Ticket } from "@/types/ticket";

export const scheduleApi = {
  getSchedule: async (
    from: Date,
    to: Date
  ): Promise<ApiResponse<Schedule[]>> => {
    const response = await apiClient.get<ApiResponse<Schedule[]>>("/schedule", {
      params: {
        from: from.toISOString(),
        to: to.toISOString(),
      },
    });

    return response.data;
  },
  getAvailability: async (): Promise<ApiResponse<ScheduleAvailability[]>> => {
    const response = await apiClient.get<ApiResponse<ScheduleAvailability[]>>(
      "/schedule/availability"
    );

    return response.data;
  },
  updateWeekdayAvailability: async (
    data: UpdateWeekdayAvailabilityRequest
  ): Promise<ApiResponse> => {
    const response = await apiClient.put<ApiResponse>(
      "/schedule/availability",
      data
    );

    return response.data;
  },
  bookSession: async (
    sessionId: string,
    data: BookSessionRequest
  ): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>(
      `/schedule/sessions/${sessionId}/book`,
      data
    );

    return response.data;
  },
  createOnceEvent: async (
    data: CreateOnceEventRequest
  ): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>(
      `/schedule/events/once`,
      data
    );

    return response.data;
  },
  registerVisitFromBooking: async (
    bookingId: string,
    data?: { ticket_id?: string | null; is_charged?: boolean }
  ): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>(
      `/schedule/bookings/${bookingId}/visit`,
      data
    );

    return response.data;
  },
  cancelBooking: async (
    bookingId: string,
    data: CancelBookingRequest
  ): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>(
      `/schedule/bookings/${bookingId}/cancel`,
      data
    );

    return response.data;
  },
  getSessionBookings: async (sessionId: string): Promise<ApiResponse> => {
    const response = await apiClient.get<ApiResponse>(
      `/schedule/sessions/${sessionId}/bookings`
    );

    return response.data;
  },
  getVisits: async (
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<ScheduleVisit[]>> => {
    const response = await apiClient.get<ApiResponse<ScheduleVisit[]>>(
      "/visits",
      {
        params: {
          page,
          limit,
        },
      }
    );

    return response.data;
  },
  createVisit: async (data: any): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>("/visits", data);

    return response.data;
  },
};
