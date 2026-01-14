import { useState } from "react";
import { usePaymentFilters } from "../hooks/usePaymentFilters";
import { usePayments } from "../hooks/usePayments";
import { getErrorMessage } from "../utils/errorHandler";
import { I18N } from "../constants/i18n";
import { formatPaymentDate, formatCurrency } from "../utils/formatters";
import {
  Container,
  EmptyBox,
  ErrorBox,
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
import { PaymentFilters } from "./PaymentFilters";
import { PaginationControls } from "./PaginationControls";

export const PaymentsPage = () => {
  const {
    filters,
    updateSearch,
    clearFilters,
    hasActiveFilters,
    updateCurrency,
    updatePage,
  } = usePaymentFilters();
  const [searchTerm, setSearchTerm] = useState("");

  const { isPending, data, error, isError } = usePayments(filters);

  const handleSearch = () => {
    updateSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm("");
    clearFilters();
  };

  const handlePreviousPage = () => {
    if (filters.page > 1) {
      updatePage(filters.page - 1);
    }
  };

  const handleNextPage = () => {
    if (data && filters.page * filters.pageSize < data.total) {
      updatePage(filters.page + 1);
    }
  };

  return (
    <Container>
      <Title>{I18N.PAGE_TITLE}</Title>

      <PaymentFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearch={handleSearch}
        onClear={handleClear}
        currency={filters.currency}
        onCurrencyChange={updateCurrency}
        hasActiveFilters={hasActiveFilters()}
      />

      {isError ? (
        <ErrorBox role="alert">{getErrorMessage(error)}</ErrorBox>
      ) : isPending ? (
        <div role="status" aria-live="polite">
          <Spinner />
        </div>
      ) : data?.payments?.length === 0 ? (
        <EmptyBox>{I18N.NO_PAYMENTS_FOUND}</EmptyBox>
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

          <PaginationControls
            currentPage={filters.page}
            totalItems={data?.total || 0}
            pageSize={filters.pageSize}
            onPrevious={handlePreviousPage}
            onNext={handleNextPage}
          />
        </TableWrapper>
      )}
    </Container>
  );
};
