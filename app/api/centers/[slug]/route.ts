import { NextRequest, NextResponse } from 'next/server';
import { getCenterBySlug } from '@/lib/mock-data';
import { AppError, ERROR_MESSAGES } from '@/lib/errors';
import { GetCenterResponse } from '@/types/api';

/**
 * Artificial delay to simulate network latency
 */
async function artificialDelay(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
}

/**
 * GET /api/centers/[slug]
 * Retrieves a beauty center by its slug
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse<GetCenterResponse | { error: string }>> {
  try {
    // Simulate network delay
    await artificialDelay();

    const { slug } = await params;
    const center = getCenterBySlug(slug);

    if (center === undefined) {
      throw new AppError(ERROR_MESSAGES.CENTER_NOT_FOUND, 'CENTER_NOT_FOUND', 404);
    }

    const response: GetCenterResponse = {
      center,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode ?? 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

