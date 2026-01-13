export interface PaymentFilters {
  search: string;
  currency: string;
  page: number;
  pageSize: number;
}

export type FilterAction =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_CURRENCY"; payload: string }
  | { type: "SET_PAGE"; payload: number }
  | { type: "CLEAR_FILTERS" };
