import { AppError, formatError, toApiError, ERROR_MESSAGES } from "../errors";

describe("Errors", () => {
  describe("AppError", () => {
    it("should create error with message only", () => {
      const error = new AppError("Test error");
      expect(error.message).toBe("Test error");
      expect(error.name).toBe("AppError");
      expect(error.code).toBeUndefined();
      expect(error.statusCode).toBeUndefined();
    });

    it("should create error with code", () => {
      const error = new AppError("Test error", "TEST_CODE");
      expect(error.message).toBe("Test error");
      expect(error.code).toBe("TEST_CODE");
      expect(error.statusCode).toBeUndefined();
    });

    it("should create error with code and statusCode", () => {
      const error = new AppError("Test error", "TEST_CODE", 404);
      expect(error.message).toBe("Test error");
      expect(error.code).toBe("TEST_CODE");
      expect(error.statusCode).toBe(404);
    });

    it("should convert to ApiError with all fields", () => {
      const error = new AppError("Test error", "TEST_CODE", 404);
      const apiError = error.toApiError();
      expect(apiError).toEqual({
        message: "Test error",
        code: "TEST_CODE",
        statusCode: 404
      });
    });

    it("should convert to ApiError with message only", () => {
      const error = new AppError("Test error");
      const apiError = error.toApiError();
      expect(apiError).toEqual({
        message: "Test error"
      });
    });
  });

  describe("formatError", () => {
    it("should format AppError", () => {
      const error = new AppError("Custom error");
      expect(formatError(error)).toBe("Custom error");
    });

    it("should format standard Error", () => {
      const error = new Error("Standard error");
      expect(formatError(error)).toBe("Standard error");
    });

    it("should format string error", () => {
      expect(formatError("String error")).toBe("String error");
    });

    it("should format unknown error", () => {
      expect(formatError({ unknown: "object" })).toBe(
        "An unexpected error occurred. Please try again."
      );
      expect(formatError(null)).toBe("An unexpected error occurred. Please try again.");
      expect(formatError(undefined)).toBe("An unexpected error occurred. Please try again.");
    });
  });

  describe("toApiError", () => {
    it("should convert AppError to ApiError", () => {
      const error = new AppError("Test error", "TEST_CODE", 500);
      const apiError = toApiError(error);
      expect(apiError).toEqual({
        message: "Test error",
        code: "TEST_CODE",
        statusCode: 500
      });
    });

    it("should convert standard Error to ApiError", () => {
      const error = new Error("Standard error");
      const apiError = toApiError(error);
      expect(apiError).toEqual({
        message: "Standard error"
      });
    });

    it("should convert string to ApiError", () => {
      const apiError = toApiError("String error");
      expect(apiError).toEqual({
        message: "String error"
      });
    });

    it("should convert unknown to ApiError", () => {
      const apiError = toApiError({ unknown: "object" });
      expect(apiError).toEqual({
        message: "An unexpected error occurred"
      });
    });
  });

  describe("ERROR_MESSAGES", () => {
    it("should have all predefined error messages", () => {
      expect(ERROR_MESSAGES.CENTER_NOT_FOUND).toBe("Beauty center not found");
      expect(ERROR_MESSAGES.SERVICE_NOT_FOUND).toBe("Service not found");
      expect(ERROR_MESSAGES.INVALID_REQUEST).toBe("Invalid request data");
      expect(ERROR_MESSAGES.BOOKING_FAILED).toBe(
        "Failed to create booking. Please try again."
      );
      expect(ERROR_MESSAGES.NETWORK_ERROR).toBe(
        "Network error. Please check your connection."
      );
    });
  });
});

