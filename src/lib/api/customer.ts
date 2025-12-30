import { apiClient } from ".";

import { ApiResponse } from "@/types/api";

export const customersApi = {
  searchCustomers: async (query: string): Promise<ApiResponse> => {
    const response = await apiClient.get<ApiResponse>("/customers/search", {
      params: { q: query },
    });

    return response.data;
  },
};
