import { useState, useMemo } from "react";
import { usePaymentFilters } from "../hooks/usePaymentFilters";
import { usePayments } from "../hooks/usePayments";
import { getErrorMessage } from "../utils/errorHandler";
import { I18N } from "../constants/i18n";
import { formatPaymentDate, formatCurrency } from "../utils/formatters";
import {
  ClearButton,
  Container,
  ErrorBox,
  FilterRow,
  SearchButton,
  SearchInput,
  Select,
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
import { Payment } from "../types/payment";
import { CURRENCIES } from "../constants";

export const PaymentsPage = () => {
  const {
    filters,
    updateSearch,
    clearFilters,
    hasActiveFilters,
    updateCurrency,
  } = usePaymentFilters();
  const [searchTerm, setSearchTerm] = useState("");

  const { isPending, data, error, isError } = usePayments(filters);

  const currencyOptions = useMemo(
    () =>
      CURRENCIES.map((currency) => (
        <option key={currency} value={currency}>
          {currency}
        </option>
      )),
    [],
  );

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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          role="searchbox"
          aria-label={I18N.SEARCH_LABEL}
        />

        <Select
          aria-label={I18N.CURRENCY_FILTER_LABEL}
          value={filters.currency}
          onChange={(e) => updateCurrency(e.target.value)}
        >
          <option value="">{I18N.CURRENCIES_OPTION}</option>
          {currencyOptions}
        </Select>

        <SearchButton onClick={handleSearch}>{I18N.SEARCH_BUTTON}</SearchButton>

        {hasActiveFilters() && (
          <ClearButton onClick={handleClear}>{I18N.CLEAR_FILTERS}</ClearButton>
        )}
      </FilterRow>

      {isError ? (
        <ErrorBox role="alert">{getErrorMessage(error)}</ErrorBox>
      ) : isPending ? (
        <div role="status" aria-live="polite">
          <Spinner />
        </div>
      ) : (
        <TableWrapper>
          <Table>
            <caption className="sr-only">
              Payment transactions table showing {data?.total || 0} results
            </caption>
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
