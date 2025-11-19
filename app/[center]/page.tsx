"use client";

import { useState, use, useMemo, type ReactElement } from "react";
import { useCenter } from "@/hooks/useCenter";
import { useBooking } from "@/hooks/useBooking";
import { Service, BookingFormData } from "@/types/domain";
import { getBookingsByCenterId } from "@/lib/storage";
import { Loading } from "@/components/Loading";
import { ErrorMessage } from "@/components/ErrorMessage";
import { CenterPageContent } from "@/components/CenterPageContent";
import { CenterBookingModal } from "@/components/CenterBookingModal";

interface CenterPageProps {
  params: Promise<{ center: string }>;
}

/**
 * Center landing page component
 */
export default function CenterPage({ params }: CenterPageProps): ReactElement {
  const { center: centerSlug } = use(params);
  const { center, status, error } = useCenter(centerSlug);
  const {
    booking,
    status: bookingStatus,
    error: bookingError,
    createBooking,
    reset
  } = useBooking();

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get bookings for this center (recomputes when center or bookingStatus changes)
  // bookingStatus is intentionally included to refresh the list after a new booking
  const centerBookings = useMemo(() => {
    if (center === null) {
      return [];
    }
    return getBookingsByCenterId(center.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center, bookingStatus]);

  const handleBookService = (serviceId: string): void => {
    const service = center?.services.find((s) => s.id === serviceId);
    if (service !== undefined) {
      setSelectedService(service);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setSelectedService(null);
    reset();
  };

  const handleSubmitBooking = (formData: BookingFormData): void => {
    if (selectedService !== null && center !== null) {
      createBooking(selectedService.id, center.id, formData);
    }
  };

  if (status === "loading") {
    return <Loading message="Loading center information..." />;
  }

  if (status === "error" || error !== null) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error ?? "Failed to load center"} />
      </div>
    );
  }

  if (center === null) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message="Center not found" />
      </div>
    );
  }

  return (
    <>
      <CenterPageContent
        center={center}
        centerBookings={centerBookings}
        onBookService={handleBookService}
      />
      <CenterBookingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        selectedService={selectedService}
        booking={booking}
        bookingStatus={bookingStatus}
        bookingError={bookingError}
        onSubmit={handleSubmitBooking}
      />
    </>
  );
}
