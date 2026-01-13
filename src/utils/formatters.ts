import { format } from "date-fns";

export const formatPaymentDate = (date: string): string => {
  return format(new Date(date), "dd/MM/yyyy, HH:mm:ss");
};

export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};
