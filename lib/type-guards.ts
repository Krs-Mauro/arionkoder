import { Center, Service, Booking, ApiError } from '@/types/domain';

/**
 * Type guard to check if a value is a string
 */
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Type guard to check if a value is a number
 */
function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Type guard to check if a value is an array
 */
function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Type guard to check if a value is a non-null object
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Type guard for Service
 */
export function isService(value: unknown): value is Service {
  if (!isObject(value)) {
    return false;
  }

  return (
    isString(value.id) &&
    isString(value.name) &&
    isString(value.description) &&
    isNumber(value.duration) &&
    value.duration > 0 &&
    isNumber(value.price) &&
    value.price >= 0 &&
    isString(value.centerId)
  );
}

/**
 * Type guard for Center
 */
export function isCenter(value: unknown): value is Center {
  if (!isObject(value)) {
    return false;
  }

  return (
    isString(value.id) &&
    isString(value.slug) &&
    isString(value.name) &&
    isString(value.description) &&
    isString(value.logo) &&
    isArray(value.services) &&
    value.services.every(isService)
  );
}

/**
 * Type guard for Booking
 */
export function isBooking(value: unknown): value is Booking {
  if (!isObject(value)) {
    return false;
  }

  return (
    isString(value.id) &&
    isString(value.serviceId) &&
    isString(value.centerId) &&
    isString(value.clientName) &&
    isString(value.clientEmail) &&
    isString(value.date) &&
    isString(value.time) &&
    isString(value.createdAt)
  );
}

/**
 * Type guard for ApiError
 */
export function isApiError(value: unknown): value is ApiError {
  if (!isObject(value)) {
    return false;
  }

  return (
    isString(value.message) &&
    (value.code === undefined || isString(value.code)) &&
    (value.statusCode === undefined || isNumber(value.statusCode))
  );
}

