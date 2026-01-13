import {
  Container,
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

export const PaymentsPage = () => {
  const { isPending, data } = useQuery<PaymentSearchResponse>({
    queryKey: ["payments", { page: 1, pageSize: 5 }],
    queryFn: () =>
      fetch(`${API_URL}?page=1&pageSize=5`).then((res) => res.json()),
  });

  if (isPending)
    return (
      <Container>
        <Spinner />
      </Container>
    );

  return (
    <Container>
      <Title>{I18N.PAGE_TITLE}</Title>

      <SearchInput placeholder={I18N.SEARCH_PLACEHOLDER} />
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
    </Container>
  );
};
