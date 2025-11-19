import { type ReactElement } from "react";
import { Booking, Service } from "@/types/domain";
import { Button } from "./Button";

interface BookingConfirmationProps {
  readonly booking: Booking;
  readonly service: Service;
  readonly onClose: () => void;
}

/**
 * Format date string to readable format
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

/**
 * Format time string to 12-hour format
 */
function formatTime(timeString: string): string {
  const parts = timeString.split(":");
  const hours = parts[0];
  const minutes = parts[1];

  if (hours === undefined || minutes === undefined) {
    return timeString;
  }

  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

/**
 * Booking confirmation component
 */
export function BookingConfirmation({
  booking,
  service,
  onClose
}: BookingConfirmationProps): ReactElement {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full mb-4">
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Booking Confirmed!
      </h2>
      <p className="text-gray-600 mb-6">
        Your appointment has been successfully scheduled.
      </p>

      <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
        <h3 className="font-semibold text-gray-900 mb-4">Booking Details</h3>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Service</p>
            <p className="font-medium text-gray-900">{service.name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Client Name</p>
            <p className="font-medium text-gray-900">{booking.clientName}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-900">{booking.clientEmail}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium text-gray-900">
              {formatDate(booking.date)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Time</p>
            <p className="font-medium text-gray-900">
              {formatTime(booking.time)}
            </p>
          </div>
        </div>
      </div>

      <Button onClick={onClose} fullWidth>
        Close
      </Button>
    </div>
  );
}
