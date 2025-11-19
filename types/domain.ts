/**
 * Domain types for the multi-tenant booking system
 */

/**
 * Represents a beauty center in the system
 */
export interface Center {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  readonly logo: string;
  readonly services: readonly Service[];
}

/**
 * Represents a service offered by a beauty center
 */
export interface Service {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly duration: number; // in minutes
  readonly price: number; // in cents to avoid floating point issues
  readonly centerId: string;
}

/**
 * Represents a booking made by a client
 */
export interface Booking {
  readonly id: string;
  readonly serviceId: string;
  readonly centerId: string;
  readonly clientName: string;
  readonly clientEmail: string;
  readonly date: string; // ISO 8601 date string
  readonly time: string; // HH:mm format
  readonly createdAt: string; // ISO 8601 timestamp
}

/**
 * Form data for creating a new booking
 */
export interface BookingFormData {
  readonly clientName: string;
  readonly clientEmail: string;
  readonly date: string;
  readonly time: string;
}

/**
 * Validation error for a specific field
 */
export interface FieldError {
  readonly field: keyof BookingFormData;
  readonly message: string;
}

/**
 * Result of form validation
 */
export interface ValidationResult {
  readonly isValid: boolean;
  readonly errors: readonly FieldError[];
}

/**
 * Status of an async operation
 */
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Generic API error
 */
export interface ApiError {
  readonly message: string;
  readonly code?: string;
  readonly statusCode?: number;
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  readonly data?: T;
  readonly error?: ApiError;
}

