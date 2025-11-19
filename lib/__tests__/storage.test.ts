import {
  getBookingsFromStorage,
  saveBookingToStorage,
  getBookingsByCenterId,
  getBookingsByServiceId,
  clearBookingsFromStorage
} from "../storage";
import { Booking } from "@/types/domain";

describe("Storage", () => {
  const mockBooking: Booking = {
    id: "booking-1",
    centerId: "center-1",
    serviceId: "service-1-1",
    clientName: "John Doe",
    clientEmail: "john@example.com",
    date: "2025-12-31",
    time: "14:00",
    createdAt: "2024-01-01T10:00:00.000Z"
  };

  beforeEach(() => {
    clearBookingsFromStorage();
  });

  afterEach(() => {
    clearBookingsFromStorage();
  });

  describe("getBookingsFromStorage", () => {
    it("should return empty array when no bookings exist", () => {
      const bookings = getBookingsFromStorage();
      expect(bookings).toEqual([]);
    });

    it("should return bookings from localStorage", () => {
      saveBookingToStorage(mockBooking);
      const bookings = getBookingsFromStorage();
      expect(bookings).toHaveLength(1);
      expect(bookings[0]).toEqual(mockBooking);
    });

    it("should return empty array for invalid JSON", () => {
      localStorage.setItem("beauty-center-bookings", "invalid json");
      const bookings = getBookingsFromStorage();
      expect(bookings).toEqual([]);
    });

    it("should filter out invalid bookings", () => {
      localStorage.setItem(
        "beauty-center-bookings",
        JSON.stringify([mockBooking, { invalid: "data" }])
      );
      const bookings = getBookingsFromStorage();
      expect(bookings).toHaveLength(1);
      expect(bookings[0]).toEqual(mockBooking);
    });
  });

  describe("saveBookingToStorage", () => {
    it("should save booking to localStorage", () => {
      saveBookingToStorage(mockBooking);
      const stored = localStorage.getItem("beauty-center-bookings");
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored ?? "[]");
      expect(parsed).toHaveLength(1);
      expect(parsed[0]).toEqual(mockBooking);
    });

    it("should append to existing bookings", () => {
      saveBookingToStorage(mockBooking);
      const secondBooking = { ...mockBooking, id: "booking-2" };
      saveBookingToStorage(secondBooking);
      const bookings = getBookingsFromStorage();
      expect(bookings).toHaveLength(2);
    });
  });

  describe("getBookingsByCenterId", () => {
    it("should return bookings for specific center", () => {
      saveBookingToStorage(mockBooking);
      saveBookingToStorage({
        ...mockBooking,
        id: "booking-2",
        centerId: "center-2"
      });
      const bookings = getBookingsByCenterId("center-1");
      expect(bookings).toHaveLength(1);
      expect(bookings[0]?.centerId).toBe("center-1");
    });

    it("should return empty array when no bookings match", () => {
      saveBookingToStorage(mockBooking);
      const bookings = getBookingsByCenterId("center-999");
      expect(bookings).toEqual([]);
    });
  });

  describe("getBookingsByServiceId", () => {
    it("should return bookings for specific service", () => {
      saveBookingToStorage(mockBooking);
      saveBookingToStorage({
        ...mockBooking,
        id: "booking-2",
        serviceId: "service-2-1"
      });
      const bookings = getBookingsByServiceId("service-1-1");
      expect(bookings).toHaveLength(1);
      expect(bookings[0]?.serviceId).toBe("service-1-1");
    });

    it("should return empty array when no bookings match", () => {
      saveBookingToStorage(mockBooking);
      const bookings = getBookingsByServiceId("service-999");
      expect(bookings).toEqual([]);
    });
  });

  describe("clearBookingsFromStorage", () => {
    it("should remove all bookings from localStorage", () => {
      saveBookingToStorage(mockBooking);
      clearBookingsFromStorage();
      const bookings = getBookingsFromStorage();
      expect(bookings).toEqual([]);
    });
  });
});
