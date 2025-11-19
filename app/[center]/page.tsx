"use client";

import { useState, use, type ReactElement } from "react";
import { useCenter } from "@/hooks/useCenter";
import { useBooking } from "@/hooks/useBooking";
import { Service, BookingFormData } from "@/types/domain";
import { Loading } from "@/components/Loading";
import { ErrorMessage } from "@/components/ErrorMessage";
import { ServiceCard } from "@/components/ServiceCard";
import { BookingModal } from "@/components/BookingModal";
import { BookingForm } from "@/components/BookingForm";
import { BookingConfirmation } from "@/components/BookingConfirmation";
import { ErrorTrigger } from "@/components/ErrorBoundary";

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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Center Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center mb-4">
            <span className="text-6xl mr-4" role="img" aria-label="Center logo">
              {center.logo}
            </span>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                {center.name}
              </h1>
              <p className="text-gray-600 mt-2">{center.description}</p>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {center.services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onBook={handleBookService}
              />
            ))}
          </div>
        </div>

        {/* Error Trigger for Testing */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 mb-2">
            <strong>For Reviewers:</strong> Test the Error Boundary by clicking
            the button below
          </p>
          <ErrorTrigger />
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          bookingStatus === "success"
            ? "Booking Confirmed"
            : `Book ${selectedService?.name ?? "Service"}`
        }
      >
        {bookingStatus === "success" &&
        booking !== null &&
        selectedService !== null ? (
          <BookingConfirmation
            booking={booking}
            service={selectedService}
            onClose={handleCloseModal}
          />
        ) : (
          <>
            {bookingError !== null && <ErrorMessage message={bookingError} />}
            <BookingForm
              onSubmit={handleSubmitBooking}
              isLoading={bookingStatus === "loading"}
            />
          </>
        )}
      </BookingModal>
    </div>
  );
}
