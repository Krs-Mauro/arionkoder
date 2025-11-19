import { type ReactElement } from "react";
import { ErrorTrigger } from "./ErrorBoundary";

/**
 * Error boundary test section for reviewers
 */
export function ErrorBoundaryTest(): ReactElement {
  return (
    <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <p className="text-sm text-yellow-800 mb-2">
        <strong>For Reviewers:</strong> Test the Error Boundary by clicking the
        button below
      </p>
      <ErrorTrigger />
    </div>
  );
}

