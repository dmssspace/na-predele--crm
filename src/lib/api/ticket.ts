import { apiClient } from ".";

import { ApiResponse } from "@/types/api";
import { Ticket } from "@/types/ticket";

export const ticketsApi = {
  getCustomerTickets: async (
    customerId: string
  ): Promise<ApiResponse<Ticket[]>> => {
    const response = await apiClient.get<ApiResponse<Ticket[]>>(
      `/tickets/customer/${customerId}`
    );

    return response.data;
  },
};
