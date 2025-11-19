import { NextRequest, NextResponse } from 'next/server';
import { saveBookingToStorage } from '@/lib/storage';
import { validateBookingForm } from '@/lib/validation';
import { AppError, ERROR_MESSAGES } from '@/lib/errors';
import { CreateBookingRequest, CreateBookingResponse } from '@/types/api';
import { Booking } from '@/types/domain';

/**
 * Artificial delay to simulate network latency
 */
async function artificialDelay(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
}

/**
 * Generate a unique ID for a booking
 */
function generateBookingId(): string {
  return `booking-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * POST /api/bookings
 * Creates a new booking
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<CreateBookingResponse | { error: string; errors?: string[] }>> {
  try {
    // Simulate network delay
    await artificialDelay();

    const body: unknown = await request.json();

    // Validate request body structure
    if (
      typeof body !== 'object' ||
      body === null ||
      !('serviceId' in body) ||
      !('centerId' in body) ||
      !('formData' in body)
    ) {
      throw new AppError(ERROR_MESSAGES.INVALID_REQUEST, 'INVALID_REQUEST', 400);
    }

    const { serviceId, centerId, formData } = body as CreateBookingRequest;

    // Validate form data
    const validationResult = validateBookingForm(formData);

    if (!validationResult.isValid) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          errors: validationResult.errors.map((e) => e.message),
        },
        { status: 400 }
      );
    }

    // Create booking
    const booking: Booking = {
      id: generateBookingId(),
      serviceId,
      centerId,
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      date: formData.date,
      time: formData.time,
      createdAt: new Date().toISOString(),
    };

    // Save to storage
    saveBookingToStorage(booking);

    const response: CreateBookingResponse = {
      booking,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode ?? 500 }
      );
    }

    return NextResponse.json(
      { error: ERROR_MESSAGES.BOOKING_FAILED },
      { status: 500 }
    );
  }
}

