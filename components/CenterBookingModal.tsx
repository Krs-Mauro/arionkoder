import { type ReactElement } from "react";
import { Booking, Service, BookingFormData, AsyncStatus } from "@/types/domain";
import { BookingModal } from "./BookingModal";
import { BookingForm } from "./BookingForm";
import { BookingConfirmation } from "./BookingConfirmation";
import { ErrorMessage } from "./ErrorMessage";

interface CenterBookingModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly selectedService: Service | null;
  readonly booking: Booking | null;
  readonly bookingStatus: AsyncStatus;
  readonly bookingError: string | null;
  readonly onSubmit: (formData: BookingFormData) => void;
}

/**
 * Booking modal component for center page
 */
export function CenterBookingModal({
  isOpen,
  onClose,
  selectedService,
  booking,
  bookingStatus,
  bookingError,
  onSubmit
}: CenterBookingModalProps): ReactElement {
  const title =
    bookingStatus === "success"
      ? "Booking Confirmed"
      : `Book ${selectedService?.name ?? "Service"}`;

  const showConfirmation =
    bookingStatus === "success" && booking !== null && selectedService !== null;

  return (
    <BookingModal isOpen={isOpen} onClose={onClose} title={title}>
      {showConfirmation ? (
        <BookingConfirmation
          booking={booking}
          service={selectedService}
          onClose={onClose}
        />
      ) : (
        <>
          {bookingError !== null && <ErrorMessage message={bookingError} />}
          <BookingForm
            onSubmit={onSubmit}
            isLoading={bookingStatus === "loading"}
          />
        </>
      )}
    </BookingModal>
  );
}

