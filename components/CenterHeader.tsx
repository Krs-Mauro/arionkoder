import { type ReactElement } from "react";
import Link from "next/link";
import { Center } from "@/types/domain";

interface CenterHeaderProps {
  readonly center: Center;
}

/**
 * Center header component with logo, name, and description
 */
export function CenterHeader({ center }: CenterHeaderProps): ReactElement {
  return (
    <>
      {/* Back Navigation */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium transition-colors"
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
          Back to All Centers
        </Link>
      </div>

      {/* Center Header */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-center mb-4">
          <span className="text-6xl mr-4" role="img" aria-label="Center logo">
            {center.logo}
          </span>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{center.name}</h1>
            <p className="text-gray-600 mt-2">{center.description}</p>
          </div>
        </div>
      </div>
    </>
  );
}

