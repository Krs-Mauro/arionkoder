import { useState, useCallback } from 'react';
import { Booking, AsyncStatus, BookingFormData } from '@/types/domain';
import { CreateBookingRequest, CreateBookingResponse } from '@/types/api';
import { formatError } from '@/lib/errors';

interface UseBookingResult {
  booking: Booking | null;
  status: AsyncStatus;
  error: string | null;
  createBooking: (serviceId: string, centerId: string, formData: BookingFormData) => Promise<void>;
  reset: () => void;
}

/**
 * Custom hook to handle booking creation
 */
export function useBooking(): UseBookingResult {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const createBooking = useCallback(
    async (serviceId: string, centerId: string, formData: BookingFormData): Promise<void> => {
      setStatus('loading');
      setError(null);

      try {
        const requestBody: CreateBookingRequest = {
          serviceId,
          centerId,
          formData,
        };

        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorData: { error: string } = await response.json();
          throw new Error(errorData.error);
        }

        const data: CreateBookingResponse = await response.json();

        setBooking(data.booking);
        setStatus('success');
      } catch (err) {
        setError(formatError(err));
        setStatus('error');
      }
    },
    []
  );

  const reset = useCallback((): void => {
    setBooking(null);
    setStatus('idle');
    setError(null);
  }, []);

  return { booking, status, error, createBooking, reset };
}

