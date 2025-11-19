import { Booking } from "@/types/domain";
import { isBooking } from "./type-guards";

const BOOKINGS_KEY = "beauty-center-bookings";

/**
 * Check if we're running in a browser environment
 */
function isBrowser(): boolean {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

/**
 * Get all bookings from LocalStorage
 */
export function getBookingsFromStorage(): readonly Booking[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const stored = localStorage.getItem(BOOKINGS_KEY);
    if (stored === null) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    // Validate each booking
    const validBookings = parsed.filter(isBooking);

    return validBookings;
  } catch {
    return [];
  }
}

/**
 * Save a new booking to LocalStorage
 */
export function saveBookingToStorage(booking: Booking): void {
  if (!isBrowser()) {
    return;
  }

  try {
    const existingBookings = getBookingsFromStorage();
    const updatedBookings = [...existingBookings, booking];
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updatedBookings));
  } catch {
    throw new Error("Failed to save booking to storage");
  }
}

/**
 * Get bookings for a specific center
 */
export function getBookingsByCenterId(centerId: string): readonly Booking[] {
  const allBookings = getBookingsFromStorage();
  return allBookings.filter((booking) => booking.centerId === centerId);
}

/**
 * Get bookings for a specific service
 */
export function getBookingsByServiceId(serviceId: string): readonly Booking[] {
  const allBookings = getBookingsFromStorage();
  return allBookings.filter((booking) => booking.serviceId === serviceId);
}

/**
 * Clear all bookings from storage (useful for testing)
 */
export function clearBookingsFromStorage(): void {
  if (!isBrowser()) {
    return;
  }

  try {
    localStorage.removeItem(BOOKINGS_KEY);
  } catch {
    // Silently fail if localStorage is not available
  }
}
