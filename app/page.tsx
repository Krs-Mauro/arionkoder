import { type ReactElement } from "react";
import Link from "next/link";
import { MOCK_CENTERS } from "@/lib/mock-data";

/**
 * Home page with links to all beauty centers
 */
export default function Home(): ReactElement {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Beauty Center Booking System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Choose a beauty center below to view their services and book an
            appointment
          </p>
          <Link
            href="/bookings"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-md"
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            View All Bookings
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {MOCK_CENTERS.map((center) => (
            <Link
              key={center.id}
              href={`/${center.slug}`}
              className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1"
            >
              <div className="text-center">
                <div
                  className="text-6xl mb-4"
                  role="img"
                  aria-label="Center logo"
                >
                  {center.logo}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {center.name}
                </h2>
                <p className="text-gray-600 mb-4 min-h-[4rem]">
                  {center.description}
                </p>
                <div className="text-purple-600 font-medium">
                  {center.services.length} Services Available →
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center text-gray-500 text-sm">
          <p>Multi-tenant Booking System MVP</p>
          <p className="mt-2">
            Built with Next.js, TypeScript, and Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
}
