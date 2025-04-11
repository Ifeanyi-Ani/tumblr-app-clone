import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const getErrorMessage = (
  error: FetchBaseQueryError | SerializedError,
): string => {
  if ("status" in error) {
    return "error" in error
      ? error.error
      : JSON.stringify(error.data || "Unknown error");
  }
  return error.message || "An unexpected error occurred";
};
