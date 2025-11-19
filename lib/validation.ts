import { BookingFormData, FieldError, ValidationResult } from "@/types/domain";

/**
 * Validation error messages
 */
export const VALIDATION_MESSAGES = {
  REQUIRED: "This field is required",
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_DATE: "Please enter a valid date",
  INVALID_TIME: "Please enter a valid time",
  PAST_DATE: "Date and time must be in the future",
  INVALID_NAME: "Name must be at least 2 characters long",
  OUTSIDE_BUSINESS_HOURS: "Please select a time between 5:00 AM and 9:00 PM"
} as const;

/**
 * Validates an email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a date string (YYYY-MM-DD format)
 */
export function isValidDate(dateString: string): boolean {
  if (dateString.length === 0) {
    return false;
  }
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

/**
 * Validates a time string (HH:mm format)
 */
export function isValidTime(timeString: string): boolean {
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(timeString);
}

/**
 * Checks if a date and time combination is in the future
 */
export function isFutureDateTime(
  dateString: string,
  timeString: string
): boolean {
  const dateTime = new Date(`${dateString}T${timeString}`);
  const now = new Date();
  return dateTime > now;
}

/**
 * Validates a name field
 */
export function isValidName(name: string): boolean {
  return name.trim().length >= 2;
}

/**
 * Checks if a time is within business hours (5 AM to 9 PM)
 */
export function isWithinBusinessHours(timeString: string): boolean {
  if (!isValidTime(timeString)) {
    return false;
  }

  const parts = timeString.split(":");
  const hours = parts[0];

  if (hours === undefined) {
    return false;
  }

  const hour = parseInt(hours, 10);

  // Business hours: 5 AM (05:00) to 9 PM (21:00)
  return hour >= 5 && hour < 21;
}

/**
 * Validates the entire booking form
 */
export function validateBookingForm(
  formData: BookingFormData
): ValidationResult {
  const errors: FieldError[] = [];

  // Validate client name
  if (formData.clientName.trim().length === 0) {
    errors.push({
      field: "clientName",
      message: VALIDATION_MESSAGES.REQUIRED
    });
  } else if (!isValidName(formData.clientName)) {
    errors.push({
      field: "clientName",
      message: VALIDATION_MESSAGES.INVALID_NAME
    });
  }

  // Validate email
  if (formData.clientEmail.trim().length === 0) {
    errors.push({
      field: "clientEmail",
      message: VALIDATION_MESSAGES.REQUIRED
    });
  } else if (!isValidEmail(formData.clientEmail)) {
    errors.push({
      field: "clientEmail",
      message: VALIDATION_MESSAGES.INVALID_EMAIL
    });
  }

  // Validate date
  if (formData.date.trim().length === 0) {
    errors.push({
      field: "date",
      message: VALIDATION_MESSAGES.REQUIRED
    });
  } else if (!isValidDate(formData.date)) {
    errors.push({
      field: "date",
      message: VALIDATION_MESSAGES.INVALID_DATE
    });
  }

  // Validate time
  if (formData.time.trim().length === 0) {
    errors.push({
      field: "time",
      message: VALIDATION_MESSAGES.REQUIRED
    });
  } else if (!isValidTime(formData.time)) {
    errors.push({
      field: "time",
      message: VALIDATION_MESSAGES.INVALID_TIME
    });
  } else if (!isWithinBusinessHours(formData.time)) {
    errors.push({
      field: "time",
      message: VALIDATION_MESSAGES.OUTSIDE_BUSINESS_HOURS
    });
  }

  // Validate future date/time if both are valid
  if (
    isValidDate(formData.date) &&
    isValidTime(formData.time) &&
    !isFutureDateTime(formData.date, formData.time)
  ) {
    errors.push({
      field: "date",
      message: VALIDATION_MESSAGES.PAST_DATE
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
