import { ApiError } from "@/types/domain";

/**
 * Custom error class for API errors
 */
export class AppError extends Error {
  public readonly code?: string | undefined;
  public readonly statusCode?: number | undefined;

  constructor(
    message: string,
    code?: string | undefined,
    statusCode?: number | undefined
  ) {
    super(message);
    this.name = "AppError";
    if (code !== undefined) {
      this.code = code;
    }
    if (statusCode !== undefined) {
      this.statusCode = statusCode;
    }
  }

  toApiError(): ApiError {
    return {
      message: this.message,
      ...(this.code !== undefined ? { code: this.code } : {}),
      ...(this.statusCode !== undefined ? { statusCode: this.statusCode } : {})
    };
  }
}

/**
 * Format an unknown error into a user-friendly message
 */
export function formatError(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "An unexpected error occurred. Please try again.";
}

/**
 * Convert an unknown error to an ApiError
 */
export function toApiError(error: unknown): ApiError {
  if (error instanceof AppError) {
    return error.toApiError();
  }

  if (error instanceof Error) {
    return {
      message: error.message
    };
  }

  if (typeof error === "string") {
    return {
      message: error
    };
  }

  return {
    message: "An unexpected error occurred"
  };
}

/**
 * Predefined error messages
 */
export const ERROR_MESSAGES = {
  CENTER_NOT_FOUND: "Beauty center not found",
  SERVICE_NOT_FOUND: "Service not found",
  INVALID_REQUEST: "Invalid request data",
  BOOKING_FAILED: "Failed to create booking. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection."
} as const;
