import { useState, useEffect } from "react";
import { Center, AsyncStatus } from "@/types/domain";
import { GetCenterResponse } from "@/types/api";
import { formatError } from "@/lib/errors";

interface UseCenterResult {
  center: Center | null;
  status: AsyncStatus;
  error: string | null;
}

/**
 * Custom hook to fetch a center by slug
 */
export function useCenter(slug: string): UseCenterResult {
  const [center, setCenter] = useState<Center | null>(null);
  const [status, setStatus] = useState<AsyncStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchCenter(): Promise<void> {
      setStatus("loading");
      setError(null);

      try {
        const response = await fetch(`/api/centers/${slug}`);

        if (!response.ok) {
          const errorData: { error: string } = await response.json();
          throw new Error(errorData.error);
        }

        const data: GetCenterResponse = await response.json();

        if (isMounted) {
          setCenter(data.center);
          setStatus("success");
        }
      } catch (err) {
        if (isMounted) {
          setError(formatError(err));
          setStatus("error");
        }
      }
    }

    fetchCenter();

    return (): void => {
      isMounted = false;
    };
  }, [slug]);

  return { center, status, error };
}
