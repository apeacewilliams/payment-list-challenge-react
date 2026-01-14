import { useMemo } from "react";
import { I18N } from "../constants/i18n";
import { CURRENCIES } from "../constants";
import {
  ClearButton,
  FilterRow,
  SearchButton,
  SearchInput,
  Select,
} from "./components";

interface PaymentFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  currency: string;
  onCurrencyChange: (value: string) => void;
  hasActiveFilters: boolean;
}

export const PaymentFilters = ({
  searchTerm,
  onSearchChange,
  onSearch,
  onClear,
  currency,
  onCurrencyChange,
  hasActiveFilters,
}: PaymentFiltersProps) => {
  const currencyOptions = useMemo(
    () =>
      CURRENCIES.map((curr) => (
        <option key={curr} value={curr}>
          {curr}
        </option>
      )),
    []
  );

  return (
    <FilterRow>
      <SearchInput
        type="text"
        placeholder={I18N.SEARCH_PLACEHOLDER}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch();
          }
        }}
        role="searchbox"
        aria-label={I18N.SEARCH_LABEL}
      />

      <Select
        aria-label={I18N.CURRENCY_FILTER_LABEL}
        value={currency}
        onChange={(e) => onCurrencyChange(e.target.value)}
      >
        <option value="">{I18N.CURRENCIES_OPTION}</option>
        {currencyOptions}
      </Select>

      <SearchButton onClick={onSearch}>{I18N.SEARCH_BUTTON}</SearchButton>

      {hasActiveFilters && (
        <ClearButton onClick={onClear}>{I18N.CLEAR_FILTERS}</ClearButton>
      )}
    </FilterRow>
  );
};
