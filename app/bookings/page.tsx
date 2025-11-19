"use client";

import { useState, useEffect, type ReactElement } from "react";
import Link from "next/link";
import { Booking } from "@/types/domain";
import { getBookingsFromStorage } from "@/lib/storage";
import { BookingsList } from "@/components/BookingsList";
import { Loading } from "@/components/Loading";

/**
 * Global bookings page showing all bookings across all centers
 */
export default function BookingsPage(): ReactElement {
  const [bookings, setBookings] = useState<readonly Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay for consistency with other pages
    const timer = setTimeout(() => {
      const allBookings = getBookingsFromStorage();
      setBookings(allBookings);
      setIsLoading(false);
    }, 300);

    return (): void => {
      clearTimeout(timer);
    };
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium transition-colors mb-4"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              All Bookings
            </h1>
            <p className="text-gray-600">
              View all bookings across all beauty centers
            </p>
            <div className="mt-4 text-sm text-gray-500">
              Total bookings: <span className="font-semibold">{bookings.length}</span>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <BookingsList
          bookings={bookings}
          emptyMessage="No bookings yet. Book your first appointment!"
        />
      </div>
    </div>
  );
}

