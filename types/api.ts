import { Center, Booking, BookingFormData } from './domain';

/**
 * Request to create a new booking
 */
export interface CreateBookingRequest {
  readonly serviceId: string;
  readonly centerId: string;
  readonly formData: BookingFormData;
}

/**
 * Response from creating a booking
 */
export interface CreateBookingResponse {
  readonly booking: Booking;
}

/**
 * Request to get a center by slug
 */
export interface GetCenterRequest {
  readonly slug: string;
}

/**
 * Response from getting a center
 */
export interface GetCenterResponse {
  readonly center: Center;
}

/**
 * HTTP methods
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * Fetch options for API calls
 */
export interface FetchOptions {
  readonly method: HttpMethod;
  readonly headers?: Record<string, string>;
  readonly body?: string;
}

