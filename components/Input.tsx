import { InputHTMLAttributes, type ReactElement } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  readonly label: string;
  readonly error?: string;
}

/**
 * Form input component with label and error display
 */
export function Input({
  label,
  error,
  id,
  className = "",
  ...props
}: InputProps): ReactElement {
  const inputId = id ?? `input-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const hasError = error !== undefined && error.length > 0;

  const baseClasses =
    "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors text-gray-900";
  const stateClasses = hasError
    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
    : "border-gray-300 focus:ring-purple-500 focus:border-purple-500";

  const combinedClasses = `${baseClasses} ${stateClasses} ${className}`.trim();

  return (
    <div className="mb-4">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={combinedClasses}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${inputId}-error` : undefined}
        {...props}
      />
      {hasError && (
        <p
          id={`${inputId}-error`}
          className="mt-2 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
