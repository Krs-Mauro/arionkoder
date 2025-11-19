import { type ReactElement } from "react";
import Link from "next/link";
import { Booking } from "@/types/domain";
import { BookingsList } from "./BookingsList";

interface CenterBookingsProps {
  readonly centerName: string;
  readonly bookings: readonly Booking[];
}

/**
 * Center bookings section with link to view all bookings
 */
export function CenterBookings({
  centerName,
  bookings
}: CenterBookingsProps): ReactElement {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Bookings for {centerName}
        </h2>
        <Link
          href="/bookings"
          className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
        >
          View All Bookings →
        </Link>
      </div>
      <BookingsList
        bookings={bookings}
        emptyMessage={`No bookings yet for ${centerName}`}
      />
    </div>
  );
}

