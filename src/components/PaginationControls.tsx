import { I18N } from "../constants/i18n";
import { PaginationButton, PaginationRow } from "./components";

interface PaginationControlsProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPrevious: () => void;
  onNext: () => void;
}

export const PaginationControls = ({
  currentPage,
  totalItems,
  pageSize,
  onPrevious,
  onNext,
}: PaginationControlsProps) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage * pageSize >= totalItems;

  return (
    <PaginationRow>
      <PaginationButton onClick={onPrevious} disabled={isFirstPage}>
        {I18N.PREVIOUS_BUTTON}
      </PaginationButton>

      <span>
        {I18N.PAGE_LABEL} {currentPage}
      </span>

      <PaginationButton onClick={onNext} disabled={isLastPage}>
        {I18N.NEXT_BUTTON}
      </PaginationButton>
    </PaginationRow>
  );
};
