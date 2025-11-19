import { type ReactElement } from "react";
import { Booking } from "@/types/domain";
import { MOCK_CENTERS } from "@/lib/mock-data";

interface BookingsListProps {
  readonly bookings: readonly Booking[];
  readonly emptyMessage?: string;
}

/**
 * Format date string to readable format
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

/**
 * Format time to 12-hour format
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
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minutes} ${ampm}`;
}

/**
 * Get center name by ID
 */
function getCenterName(centerId: string): string {
  const center = MOCK_CENTERS.find((c) => c.id === centerId);
  return center?.name ?? "Unknown Center";
}

/**
 * Get service name by ID
 */
function getServiceName(centerId: string, serviceId: string): string {
  const center = MOCK_CENTERS.find((c) => c.id === centerId);
  const service = center?.services.find((s) => s.id === serviceId);
  return service?.name ?? "Unknown Service";
}

/**
 * Reusable component to display bookings in a table
 */
export function BookingsList({
  bookings,
  emptyMessage = "No bookings found"
}: BookingsListProps): ReactElement {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Center
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Service
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date & Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Booked On
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">
                  {booking.clientName}
                </div>
                <div className="text-sm text-gray-500">{booking.clientEmail}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {getCenterName(booking.centerId)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {getServiceName(booking.centerId, booking.serviceId)}
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  {formatDate(booking.date)}
                </div>
                <div className="text-sm text-gray-500">
                  {formatTime(booking.time)}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {formatDate(booking.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

