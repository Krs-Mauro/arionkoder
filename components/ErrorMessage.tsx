import { type ReactElement } from "react";

interface ErrorMessageProps {
  readonly message: string;
  readonly title?: string;
}

/**
 * Error message display component
 */
export function ErrorMessage({
  message,
  title = "Error"
}: ErrorMessageProps): ReactElement {
  return (
    <div
      className="bg-red-50 border border-red-200 rounded-lg p-6 my-4"
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          <p className="mt-1 text-sm text-red-700">{message}</p>
        </div>
      </div>
    </div>
  );
}
