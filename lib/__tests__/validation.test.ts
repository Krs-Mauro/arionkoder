import {
  isValidEmail,
  isValidDate,
  isValidTime,
  isFutureDateTime,
  isValidName,
  isWithinBusinessHours,
  validateBookingForm,
  VALIDATION_MESSAGES
} from "../validation";
import { BookingFormData } from "@/types/domain";

describe("Validation", () => {
  describe("isValidEmail", () => {
    it("should return true for valid email", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user.name+tag@domain.co.uk")).toBe(true);
    });

    it("should return false for invalid email", () => {
      expect(isValidEmail("invalid")).toBe(false);
      expect(isValidEmail("@example.com")).toBe(false);
      expect(isValidEmail("test@")).toBe(false);
      expect(isValidEmail("test @example.com")).toBe(false);
    });
  });

  describe("isValidDate", () => {
    it("should return true for valid date", () => {
      expect(isValidDate("2025-12-31")).toBe(true);
      expect(isValidDate("2024-01-01")).toBe(true);
    });

    it("should return false for invalid date", () => {
      expect(isValidDate("")).toBe(false);
      expect(isValidDate("invalid")).toBe(false);
      expect(isValidDate("2024-13-01")).toBe(false);
    });
  });

  describe("isValidTime", () => {
    it("should return true for valid time", () => {
      expect(isValidTime("09:30")).toBe(true);
      expect(isValidTime("00:00")).toBe(true);
      expect(isValidTime("23:59")).toBe(true);
    });

    it("should return false for invalid time", () => {
      expect(isValidTime("")).toBe(false);
      expect(isValidTime("25:00")).toBe(false);
      expect(isValidTime("12:60")).toBe(false);
      expect(isValidTime("9:30")).toBe(false);
    });
  });

  describe("isFutureDateTime", () => {
    it("should return true for future date/time", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      const dateString = futureDate.toISOString().split("T")[0];
      expect(isFutureDateTime(dateString ?? "", "14:00")).toBe(true);
    });

    it("should return false for past date/time", () => {
      expect(isFutureDateTime("2020-01-01", "10:00")).toBe(false);
    });
  });

  describe("isValidName", () => {
    it("should return true for valid name", () => {
      expect(isValidName("John Doe")).toBe(true);
      expect(isValidName("AB")).toBe(true);
    });

    it("should return false for invalid name", () => {
      expect(isValidName("")).toBe(false);
      expect(isValidName("A")).toBe(false);
      expect(isValidName("  ")).toBe(false);
    });
  });

  describe("isWithinBusinessHours", () => {
    it("should return true for time within business hours", () => {
      expect(isWithinBusinessHours("05:00")).toBe(true);
      expect(isWithinBusinessHours("12:00")).toBe(true);
      expect(isWithinBusinessHours("20:59")).toBe(true);
    });

    it("should return false for time outside business hours", () => {
      expect(isWithinBusinessHours("04:59")).toBe(false);
      expect(isWithinBusinessHours("21:00")).toBe(false);
      expect(isWithinBusinessHours("23:00")).toBe(false);
    });

    it("should return false for invalid time format", () => {
      expect(isWithinBusinessHours("invalid")).toBe(false);
    });
  });

  describe("validateBookingForm", () => {
    const validFormData: BookingFormData = {
      clientName: "John Doe",
      clientEmail: "john@example.com",
      date: "2025-12-31",
      time: "14:00"
    };

    it("should return valid for correct form data", () => {
      const result = validateBookingForm(validFormData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should return error for empty name", () => {
      const result = validateBookingForm({ ...validFormData, clientName: "" });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: "clientName",
        message: VALIDATION_MESSAGES.REQUIRED
      });
    });

    it("should return error for short name", () => {
      const result = validateBookingForm({ ...validFormData, clientName: "A" });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: "clientName",
        message: VALIDATION_MESSAGES.INVALID_NAME
      });
    });

    it("should return error for invalid email", () => {
      const result = validateBookingForm({ ...validFormData, clientEmail: "invalid" });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: "clientEmail",
        message: VALIDATION_MESSAGES.INVALID_EMAIL
      });
    });

    it("should return error for time outside business hours", () => {
      const result = validateBookingForm({ ...validFormData, time: "22:00" });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: "time",
        message: VALIDATION_MESSAGES.OUTSIDE_BUSINESS_HOURS
      });
    });
  });
});

