import { I18N } from "../constants/i18n";
import { ApiError } from "../types/error";

export const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === "object" && "status" in error) {
    const apiError = error as ApiError;

    switch (apiError.status) {
      case 404:
        return I18N.PAYMENT_NOT_FOUND;
      case 500:
        return I18N.INTERNAL_SERVER_ERROR;
      default:
        return I18N.SOMETHING_WENT_WRONG;
    }
  }

  return I18N.SOMETHING_WENT_WRONG;
};
