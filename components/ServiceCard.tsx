import { type ReactElement } from "react";
import { Service } from "@/types/domain";
import { Button } from "./Button";

interface ServiceCardProps {
  readonly service: Service;
  readonly onBook: (serviceId: string) => void;
}

/**
 * Format price from cents to dollars
 */
function formatPrice(priceInCents: number): string {
  const dollars = priceInCents / 100;
  return `$${dollars.toFixed(2)}`;
}

/**
 * Format duration in minutes to human-readable string
 */
function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  }

  return `${hours}h ${remainingMinutes}min`;
}

/**
 * Service card component displaying service details
 */
export function ServiceCard({
  service,
  onBook
}: ServiceCardProps): ReactElement {
  const handleBook = (): void => {
    onBook(service.id);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
        <span className="text-2xl font-bold text-purple-600">
          {formatPrice(service.price)}
        </span>
      </div>

      <p className="text-gray-600 mb-4 min-h-[3rem]">{service.description}</p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-gray-500">
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm">{formatDuration(service.duration)}</span>
        </div>
      </div>

      <Button
        onClick={handleBook}
        fullWidth
        aria-label={`Book ${service.name}`}
      >
        Book Now
      </Button>
    </div>
  );
}
