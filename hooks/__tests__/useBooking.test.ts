import { renderHook, waitFor, act } from "@testing-library/react";
import { useBooking } from "../useBooking";
import { BookingFormData } from "@/types/domain";
import * as storage from "@/lib/storage";

// Mock the storage module
jest.mock("@/lib/storage", () => ({
  saveBookingToStorage: jest.fn()
}));

describe("useBooking", () => {
  const mockFormData: BookingFormData = {
    clientName: "John Doe",
    clientEmail: "john@example.com",
    date: "2025-12-31",
    time: "14:00"
  };

  const mockBooking = {
    id: "booking-1",
    serviceId: "service-1",
    centerId: "center-1",
    clientName: "John Doe",
    clientEmail: "john@example.com",
    date: "2025-12-31",
    time: "14:00",
    createdAt: "2024-01-01T10:00:00.000Z"
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should initialize with idle state", () => {
    const { result } = renderHook(() => useBooking());

    expect(result.current.booking).toBeNull();
    expect(result.current.status).toBe("idle");
    expect(result.current.error).toBeNull();
  });

  it("should create booking successfully", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ booking: mockBooking })
    });

    const { result } = renderHook(() => useBooking());

    await act(async () => {
      await result.current.createBooking("service-1", "center-1", mockFormData);
    });

    expect(result.current.status).toBe("success");
    expect(result.current.booking).toEqual(mockBooking);
    expect(result.current.error).toBeNull();
    expect(storage.saveBookingToStorage).toHaveBeenCalledWith(mockBooking);
  });

  it("should set loading state during booking creation", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => ({ booking: mockBooking })
              }),
            100
          )
        )
    );

    const { result } = renderHook(() => useBooking());

    act(() => {
      result.current.createBooking("service-1", "center-1", mockFormData);
    });

    await waitFor(() => {
      expect(result.current.status).toBe("loading");
    });

    await waitFor(() => {
      expect(result.current.status).toBe("success");
    });
  });

  it("should handle API error", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Booking failed" })
    });

    const { result } = renderHook(() => useBooking());

    await act(async () => {
      await result.current.createBooking("service-1", "center-1", mockFormData);
    });

    expect(result.current.status).toBe("error");
    expect(result.current.booking).toBeNull();
    expect(result.current.error).toBe("Booking failed");
    expect(storage.saveBookingToStorage).not.toHaveBeenCalled();
  });

  it("should handle network error", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network error")
    );

    const { result } = renderHook(() => useBooking());

    await act(async () => {
      await result.current.createBooking("service-1", "center-1", mockFormData);
    });

    expect(result.current.status).toBe("error");
    expect(result.current.booking).toBeNull();
    expect(result.current.error).toBe("Network error");
  });

  it("should reset state", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ booking: mockBooking })
    });

    const { result } = renderHook(() => useBooking());

    await act(async () => {
      await result.current.createBooking("service-1", "center-1", mockFormData);
    });

    expect(result.current.status).toBe("success");

    act(() => {
      result.current.reset();
    });

    expect(result.current.booking).toBeNull();
    expect(result.current.status).toBe("idle");
    expect(result.current.error).toBeNull();
  });

  it("should send correct request body", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ booking: mockBooking })
    });

    const { result } = renderHook(() => useBooking());

    await act(async () => {
      await result.current.createBooking("service-1", "center-1", mockFormData);
    });

    expect(result.current.status).toBe("success");

    expect(global.fetch).toHaveBeenCalledWith("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        serviceId: "service-1",
        centerId: "center-1",
        formData: mockFormData
      })
    });
  });
});
