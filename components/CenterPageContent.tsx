import { type ReactElement } from "react";
import { Center, Booking } from "@/types/domain";
import { CenterHeader } from "./CenterHeader";
import { CenterServices } from "./CenterServices";
import { CenterBookings } from "./CenterBookings";
import { ErrorBoundaryTest } from "./ErrorBoundaryTest";

interface CenterPageContentProps {
  readonly center: Center;
  readonly centerBookings: readonly Booking[];
  readonly onBookService: (serviceId: string) => void;
}

/**
 * Main content for center page
 */
export function CenterPageContent({
  center,
  centerBookings,
  onBookService
}: CenterPageContentProps): ReactElement {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <CenterHeader center={center} />
        <CenterServices services={center.services} onBook={onBookService} />
        <CenterBookings centerName={center.name} bookings={centerBookings} />
        <ErrorBoundaryTest />
      </div>
    </div>
  );
}

