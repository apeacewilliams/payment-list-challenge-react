import { useReducer } from "react";
import { FilterAction, PaymentFilters } from "../types/filter";

const filterReducer = (
  state: PaymentFilters,
  action: FilterAction,
): PaymentFilters => {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload, page: 1 };
    case "SET_CURRENCY":
      return { ...state, currency: action.payload, page: 1 };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "CLEAR_FILTERS":
      return { search: "", currency: "", page: 1, pageSize: 5 };
    default:
      return state;
  }
};

export const usePaymentFilters = () => {
  const [filters, dispatch] = useReducer(filterReducer, {
    search: "",
    currency: "",
    page: 1,
    pageSize: 5,
  });

  return {
    filters,
    updateSearch: (search: string) =>
      dispatch({ type: "SET_SEARCH", payload: search }),
    updateCurrency: (currency: string) =>
      dispatch({ type: "SET_CURRENCY", payload: currency }),
    updatePage: (page: number) => dispatch({ type: "SET_PAGE", payload: page }),
    clearFilters: () => dispatch({ type: "CLEAR_FILTERS" }),
    hasActiveFilters: () => filters.search !== "" || filters.currency !== "",
  };
};
