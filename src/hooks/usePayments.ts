import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../constants";
import { PaymentSearchResponse } from "../types/payment";
import { PaymentFilters } from "../types/filter";
import { ApiError } from "../types/error";

export const usePayments = (filters: PaymentFilters) => {
  return useQuery<PaymentSearchResponse, ApiError>({
    queryKey: ["payments", filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: filters.page.toString(),
        pageSize: filters.pageSize.toString(),
        ...(filters.search && { search: filters.search }),
      });

      const response = await fetch(`${API_URL}?${params}`);

      if (!response.ok) {
        throw {
          status: response.status,
          message: await response.text(),
        } as ApiError;
      }

      return response.json();
    },
  });
};
