import {
  ClearButton,
  Container,
  FilterRow,
  SearchButton,
  SearchInput,
  Spinner,
  StatusBadge,
  Table,
  TableBodyWrapper,
  TableCell,
  TableHeader,
  TableHeaderRow,
  TableHeaderWrapper,
  TableRow,
  TableWrapper,
  Title,
} from "./components";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../constants";
import { I18N } from "../constants/i18n";
import { Payment, PaymentSearchResponse } from "../types/payment";
import { formatPaymentDate, formatCurrency } from "../utils/formatters";
import { useState } from "react";
import { usePaymentFilters } from "../hooks/usePaymentFilters";

export const PaymentsPage = () => {
  const { filters, updateSearch, clearFilters, hasActiveFilters } = usePaymentFilters();
  const [searchTerm, setSearchTerm] = useState("");

  const { isPending, data } = useQuery<PaymentSearchResponse>({
    queryKey: ["payments", { page: filters.page, pageSize: filters.pageSize, search: filters.search }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: filters.page.toString(),
        pageSize: filters.pageSize.toString(),
        ...(filters.search && { search: filters.search }),
      });
      return fetch(`${API_URL}?${params}`).then((res) => res.json());
    },
  });

  const handleSearch = () => {
    updateSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm("");
    clearFilters();
  };

  return (
    <Container>
      <Title>{I18N.PAGE_TITLE}</Title>

      <FilterRow>
        <SearchInput
          type="text"
          placeholder={I18N.SEARCH_PLACEHOLDER}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          role="searchbox"
          aria-label={I18N.SEARCH_LABEL}
        />
        <SearchButton onClick={handleSearch}>{I18N.SEARCH_BUTTON}</SearchButton>

        {hasActiveFilters() && (
          <ClearButton onClick={handleClear}>{I18N.CLEAR_FILTERS}</ClearButton>
        )}
      </FilterRow>

      {isPending ? (
        <Spinner />
      ) : (
        <TableWrapper>
          <Table>
            <TableHeaderWrapper>
              <TableHeaderRow>
                <TableHeader>{I18N.TABLE_HEADER_PAYMENT_ID}</TableHeader>
                <TableHeader>{I18N.TABLE_HEADER_DATE}</TableHeader>
                <TableHeader>{I18N.TABLE_HEADER_AMOUNT}</TableHeader>
                <TableHeader>{I18N.TABLE_HEADER_CUSTOMER}</TableHeader>
                <TableHeader>{I18N.TABLE_HEADER_CURRENCY}</TableHeader>
                <TableHeader>{I18N.TABLE_HEADER_STATUS}</TableHeader>
              </TableHeaderRow>
            </TableHeaderWrapper>

            <TableBodyWrapper>
              {data?.payments?.map((payment: Payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.id}</TableCell>
                  <TableCell>{formatPaymentDate(payment.date)}</TableCell>
                  <TableCell>{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>{payment.customerName}</TableCell>
                  <TableCell>{payment.currency}</TableCell>
                  <TableCell>
                    <StatusBadge status={payment.status}>
                      {payment.status}
                    </StatusBadge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBodyWrapper>
          </Table>
        </TableWrapper>
      )}
    </Container>
  );
};
