import { isService, isCenter, isBooking, isApiError } from "../type-guards";
import { Service, Center, Booking, ApiError } from "@/types/domain";

describe("Type Guards", () => {
  describe("isService", () => {
    it("should return true for valid service", () => {
      const validService: Service = {
        id: "service-1",
        name: "Massage",
        description: "Relaxing massage",
        duration: 60,
        price: 5000,
        centerId: "center-1"
      };

      expect(isService(validService)).toBe(true);
    });

    it("should return false for null", () => {
      expect(isService(null)).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(isService(undefined)).toBe(false);
    });

    it("should return false for non-object", () => {
      expect(isService("string")).toBe(false);
      expect(isService(123)).toBe(false);
      expect(isService(true)).toBe(false);
    });

    it("should return false for array", () => {
      expect(isService([])).toBe(false);
    });

    it("should return false when id is missing", () => {
      const invalid = {
        name: "Massage",
        description: "Relaxing",
        duration: 60,
        price: 5000,
        centerId: "center-1"
      };
      expect(isService(invalid)).toBe(false);
    });

    it("should return false when duration is negative", () => {
      const invalid = {
        id: "service-1",
        name: "Massage",
        description: "Relaxing",
        duration: -10,
        price: 5000,
        centerId: "center-1"
      };
      expect(isService(invalid)).toBe(false);
    });

    it("should return false when duration is zero", () => {
      const invalid = {
        id: "service-1",
        name: "Massage",
        description: "Relaxing",
        duration: 0,
        price: 5000,
        centerId: "center-1"
      };
      expect(isService(invalid)).toBe(false);
    });

    it("should return false when price is negative", () => {
      const invalid = {
        id: "service-1",
        name: "Massage",
        description: "Relaxing",
        duration: 60,
        price: -100,
        centerId: "center-1"
      };
      expect(isService(invalid)).toBe(false);
    });

    it("should return true when price is zero", () => {
      const valid = {
        id: "service-1",
        name: "Free Consultation",
        description: "Free",
        duration: 30,
        price: 0,
        centerId: "center-1"
      };
      expect(isService(valid)).toBe(true);
    });
  });

  describe("isCenter", () => {
    it("should return true for valid center", () => {
      const validCenter: Center = {
        id: "center-1",
        slug: "bella-vita",
        name: "Bella Vita Spa",
        description: "Luxury spa",
        logo: "🌸",
        services: [
          {
            id: "service-1",
            name: "Massage",
            description: "Relaxing",
            duration: 60,
            price: 5000,
            centerId: "center-1"
          }
        ]
      };

      expect(isCenter(validCenter)).toBe(true);
    });

    it("should return false for null", () => {
      expect(isCenter(null)).toBe(false);
    });

    it("should return false when services is not an array", () => {
      const invalid = {
        id: "center-1",
        slug: "bella-vita",
        name: "Bella Vita Spa",
        description: "Luxury spa",
        logo: "🌸",
        services: "not-an-array"
      };
      expect(isCenter(invalid)).toBe(false);
    });

    it("should return false when services contains invalid service", () => {
      const invalid = {
        id: "center-1",
        slug: "bella-vita",
        name: "Bella Vita Spa",
        description: "Luxury spa",
        logo: "🌸",
        services: [{ id: "service-1", name: "Invalid" }]
      };
      expect(isCenter(invalid)).toBe(false);
    });
  });

  describe("isBooking", () => {
    it("should return true for valid booking", () => {
      const validBooking: Booking = {
        id: "booking-1",
        serviceId: "service-1",
        centerId: "center-1",
        clientName: "John Doe",
        clientEmail: "john@example.com",
        date: "2025-11-20",
        time: "10:00",
        createdAt: "2025-11-19T10:00:00Z"
      };

      expect(isBooking(validBooking)).toBe(true);
    });

    it("should return false for null", () => {
      expect(isBooking(null)).toBe(false);
    });

    it("should return false when required field is missing", () => {
      const invalid = {
        id: "booking-1",
        serviceId: "service-1",
        centerId: "center-1",
        clientName: "John Doe"
        // missing clientEmail, date, time, createdAt
      };
      expect(isBooking(invalid)).toBe(false);
    });

    it("should return false for non-object", () => {
      expect(isBooking("string")).toBe(false);
      expect(isBooking(123)).toBe(false);
    });
  });

  describe("isApiError", () => {
    it("should return true for valid API error with all fields", () => {
      const validError: ApiError = {
        message: "Something went wrong",
        code: "ERR_001",
        statusCode: 500
      };

      expect(isApiError(validError)).toBe(true);
    });

    it("should return true for API error with only message", () => {
      const validError = {
        message: "Error occurred"
      };

      expect(isApiError(validError)).toBe(true);
    });

    it("should return true for API error with message and code", () => {
      const validError = {
        message: "Error occurred",
        code: "ERR_001"
      };

      expect(isApiError(validError)).toBe(true);
    });

    it("should return true for API error with message and statusCode", () => {
      const validError = {
        message: "Error occurred",
        statusCode: 404
      };

      expect(isApiError(validError)).toBe(true);
    });

    it("should return false for null", () => {
      expect(isApiError(null)).toBe(false);
    });

    it("should return false when message is missing", () => {
      const invalid = {
        code: "ERR_001",
        statusCode: 500
      };
      expect(isApiError(invalid)).toBe(false);
    });

    it("should return false when message is not a string", () => {
      const invalid = {
        message: 123,
        code: "ERR_001"
      };
      expect(isApiError(invalid)).toBe(false);
    });

    it("should return false when code is not a string", () => {
      const invalid = {
        message: "Error",
        code: 123
      };
      expect(isApiError(invalid)).toBe(false);
    });

    it("should return false when statusCode is not a number", () => {
      const invalid = {
        message: "Error",
        statusCode: "500"
      };
      expect(isApiError(invalid)).toBe(false);
    });
  });
});
