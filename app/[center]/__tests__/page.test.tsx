import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CenterPage from "../page";
import { Center, Service, Booking, BookingFormData } from "@/types/domain";
import { use } from "react";

// Mock React's use function
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  use: jest.fn()
}));

// Mock hooks
jest.mock("@/hooks/useCenter", () => ({
  useCenter: jest.fn()
}));

jest.mock("@/hooks/useBooking", () => ({
  useBooking: jest.fn()
}));

// Mock storage
jest.mock("@/lib/storage", () => ({
  getBookingsByCenterId: jest.fn()
}));

// Mock child components
jest.mock("@/components/Loading", () => ({
  Loading: ({ message }: { message?: string }) => (
    <div data-testid="loading">{message || "Loading..."}</div>
  )
}));

jest.mock("@/components/ErrorMessage", () => ({
  ErrorMessage: ({ message }: { message: string }) => (
    <div data-testid="error-message">{message}</div>
  )
}));

jest.mock("@/components/CenterPageContent", () => ({
  CenterPageContent: ({
    center,
    centerBookings,
    onBookService
  }: {
    center: Center;
    centerBookings: readonly Booking[];
    onBookService: (serviceId: string) => void;
  }) => (
    <div data-testid="center-page-content">
      <h1>{center.name}</h1>
      <p>{centerBookings.length} bookings</p>
      {center.services.map((service) => (
        <button key={service.id} onClick={() => onBookService(service.id)}>
          Book {service.name}
        </button>
      ))}
    </div>
  )
}));

jest.mock("@/components/CenterBookingModal", () => ({
  CenterBookingModal: ({
    isOpen,
    onClose,
    selectedService,
    booking,
    bookingStatus,
    bookingError,
    onSubmit
  }: {
    isOpen: boolean;
    onClose: () => void;
    selectedService: Service | null;
    booking: Booking | null;
    bookingStatus: string;
    bookingError: string | null;
    onSubmit: (formData: BookingFormData) => void;
  }) => (
    <div data-testid="center-booking-modal" data-open={isOpen}>
      {selectedService && <p>Selected: {selectedService.name}</p>}
      {booking && <p>Booking: {booking.id}</p>}
      {bookingError && <p>Error: {bookingError}</p>}
      <p>Status: {bookingStatus}</p>
      <button onClick={onClose}>Close Modal</button>
      <button onClick={() => onSubmit({} as BookingFormData)}>Submit</button>
    </div>
  )
}));

import { useCenter } from "@/hooks/useCenter";
import { useBooking } from "@/hooks/useBooking";
import { getBookingsByCenterId } from "@/lib/storage";

const mockUseCenter = useCenter as jest.MockedFunction<typeof useCenter>;
const mockUseBooking = useBooking as jest.MockedFunction<typeof useBooking>;
const mockGetBookingsByCenterId = getBookingsByCenterId as jest.MockedFunction<
  typeof getBookingsByCenterId
>;
const mockUse = use as jest.MockedFunction<typeof use>;

const mockCenter: Center = {
  id: "center-1",
  slug: "bella-vita-spa",
  name: "Bella Vita Spa",
  description: "Experience luxury and relaxation",
  logo: "💆‍♀️",
  services: [
    {
      id: "service-1-1",
      name: "Classic Facial",
      description: "Deep cleansing facial",
      duration: 60,
      price: 8500,
      centerId: "center-1"
    },
    {
      id: "service-1-2",
      name: "Swedish Massage",
      description: "Full body relaxation massage",
      duration: 90,
      price: 12000,
      centerId: "center-1"
    }
  ]
};

const mockBookings: Booking[] = [
  {
    id: "booking-1",
    serviceId: "service-1-1",
    centerId: "center-1",
    clientName: "John Doe",
    clientEmail: "john@example.com",
    date: "2025-12-25",
    time: "14:30",
    createdAt: "2025-11-19T10:00:00Z"
  }
];

const mockBooking: Booking = {
  id: "booking-2",
  serviceId: "service-1-2",
  centerId: "center-1",
  clientName: "Jane Smith",
  clientEmail: "jane@example.com",
  date: "2025-12-26",
  time: "10:00",
  createdAt: "2025-11-19T11:00:00Z"
};

describe("CenterPage", () => {
  const mockCreateBooking = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUse.mockReturnValue({ center: "bella-vita-spa" });
    mockGetBookingsByCenterId.mockReturnValue(mockBookings);
  });

  it("should show loading state when center is loading", () => {
    mockUseCenter.mockReturnValue({
      center: null,
      status: "loading",
      error: null
    });
    mockUseBooking.mockReturnValue({
      booking: null,
      status: "idle",
      error: null,
      createBooking: mockCreateBooking,
      reset: mockReset
    });

    render(
      <CenterPage params={Promise.resolve({ center: "bella-vita-spa" })} />
    );

    expect(screen.getByTestId("loading")).toBeInTheDocument();
    expect(
      screen.getByText("Loading center information...")
    ).toBeInTheDocument();
  });

  it("should show error message when center fails to load", () => {
    mockUseCenter.mockReturnValue({
      center: null,
      status: "error",
      error: "Failed to fetch center"
    });
    mockUseBooking.mockReturnValue({
      booking: null,
      status: "idle",
      error: null,
      createBooking: mockCreateBooking,
      reset: mockReset
    });

    render(
      <CenterPage params={Promise.resolve({ center: "bella-vita-spa" })} />
    );

    expect(screen.getByTestId("error-message")).toBeInTheDocument();
    expect(screen.getByText("Failed to fetch center")).toBeInTheDocument();
  });

  it("should show error message when center is null with error", () => {
    mockUseCenter.mockReturnValue({
      center: null,
      status: "error",
      error: null
    });
    mockUseBooking.mockReturnValue({
      booking: null,
      status: "idle",
      error: null,
      createBooking: mockCreateBooking,
      reset: mockReset
    });

    render(
      <CenterPage params={Promise.resolve({ center: "bella-vita-spa" })} />
    );

    expect(screen.getByTestId("error-message")).toBeInTheDocument();
    expect(screen.getByText("Failed to load center")).toBeInTheDocument();
  });

  it("should show 'Center not found' when center is null after loading", () => {
    mockUseCenter.mockReturnValue({
      center: null,
      status: "success",
      error: null
    });
    mockUseBooking.mockReturnValue({
      booking: null,
      status: "idle",
      error: null,
      createBooking: mockCreateBooking,
      reset: mockReset
    });

    render(
      <CenterPage params={Promise.resolve({ center: "bella-vita-spa" })} />
    );

    expect(screen.getByTestId("error-message")).toBeInTheDocument();
    expect(screen.getByText("Center not found")).toBeInTheDocument();
  });

  it("should render CenterPageContent when center is loaded", () => {
    mockUseCenter.mockReturnValue({
      center: mockCenter,
      status: "success",
      error: null
    });
    mockUseBooking.mockReturnValue({
      booking: null,
      status: "idle",
      error: null,
      createBooking: mockCreateBooking,
      reset: mockReset
    });

    render(
      <CenterPage params={Promise.resolve({ center: "bella-vita-spa" })} />
    );

    expect(screen.getByTestId("center-page-content")).toBeInTheDocument();
    expect(screen.getByText("Bella Vita Spa")).toBeInTheDocument();
  });

  it("should render CenterBookingModal", () => {
    mockUseCenter.mockReturnValue({
      center: mockCenter,
      status: "success",
      error: null
    });
    mockUseBooking.mockReturnValue({
      booking: null,
      status: "idle",
      error: null,
      createBooking: mockCreateBooking,
      reset: mockReset
    });

    render(
      <CenterPage params={Promise.resolve({ center: "bella-vita-spa" })} />
    );

    expect(screen.getByTestId("center-booking-modal")).toBeInTheDocument();
  });

  it("should pass center bookings to CenterPageContent", () => {
    mockUseCenter.mockReturnValue({
      center: mockCenter,
      status: "success",
      error: null
    });
    mockUseBooking.mockReturnValue({
      booking: null,
      status: "idle",
      error: null,
      createBooking: mockCreateBooking,
      reset: mockReset
    });

    render(
      <CenterPage params={Promise.resolve({ center: "bella-vita-spa" })} />
    );

    expect(screen.getByText("1 bookings")).toBeInTheDocument();
  });

  it("should open modal when booking a service", async () => {
    const user = userEvent.setup();
    mockUseCenter.mockReturnValue({
      center: mockCenter,
      status: "success",
      error: null
    });
    mockUseBooking.mockReturnValue({
      booking: null,
      status: "idle",
      error: null,
      createBooking: mockCreateBooking,
      reset: mockReset
    });

    render(
      <CenterPage params={Promise.resolve({ center: "bella-vita-spa" })} />
    );

    await user.click(screen.getByText("Book Classic Facial"));

    await waitFor(() => {
      expect(screen.getByTestId("center-booking-modal")).toHaveAttribute(
        "data-open",
        "true"
      );
      expect(screen.getByText("Selected: Classic Facial")).toBeInTheDocument();
    });
  });

  it("should close modal and reset when close button clicked", async () => {
    const user = userEvent.setup();
    mockUseCenter.mockReturnValue({
      center: mockCenter,
      status: "success",
      error: null
    });
    mockUseBooking.mockReturnValue({
      booking: null,
      status: "idle",
      error: null,
      createBooking: mockCreateBooking,
      reset: mockReset
    });

    render(
      <CenterPage params={Promise.resolve({ center: "bella-vita-spa" })} />
    );

    // Open modal
    await user.click(screen.getByText("Book Classic Facial"));

    await waitFor(() => {
      expect(screen.getByTestId("center-booking-modal")).toHaveAttribute(
        "data-open",
        "true"
      );
    });

    // Close modal
    await user.click(screen.getByText("Close Modal"));

    await waitFor(() => {
      expect(mockReset).toHaveBeenCalledTimes(1);
    });
  });

  it("should call createBooking when form is submitted", async () => {
    const user = userEvent.setup();
    mockUseCenter.mockReturnValue({
      center: mockCenter,
      status: "success",
      error: null
    });
    mockUseBooking.mockReturnValue({
      booking: null,
      status: "idle",
      error: null,
      createBooking: mockCreateBooking,
      reset: mockReset
    });

    render(
      <CenterPage params={Promise.resolve({ center: "bella-vita-spa" })} />
    );

    // Open modal
    await user.click(screen.getByText("Book Swedish Massage"));

    await waitFor(() => {
      expect(screen.getByText("Selected: Swedish Massage")).toBeInTheDocument();
    });

    // Submit form
    await user.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(mockCreateBooking).toHaveBeenCalledTimes(1);
      expect(mockCreateBooking).toHaveBeenCalledWith(
        "service-1-2",
        "center-1",
        {}
      );
    });
  });

  it("should pass booking to modal when booking is created", () => {
    mockUseCenter.mockReturnValue({
      center: mockCenter,
      status: "success",
      error: null
    });
    mockUseBooking.mockReturnValue({
      booking: mockBooking,
      status: "success",
      error: null,
      createBooking: mockCreateBooking,
      reset: mockReset
    });

    render(
      <CenterPage params={Promise.resolve({ center: "bella-vita-spa" })} />
    );

    expect(screen.getByText("Booking: booking-2")).toBeInTheDocument();
  });

  it("should pass booking error to modal", () => {
    mockUseCenter.mockReturnValue({
      center: mockCenter,
      status: "success",
      error: null
    });
    mockUseBooking.mockReturnValue({
      booking: null,
      status: "error",
      error: "Booking failed",
      createBooking: mockCreateBooking,
      reset: mockReset
    });

    render(
      <CenterPage params={Promise.resolve({ center: "bella-vita-spa" })} />
    );

    expect(screen.getByText("Error: Booking failed")).toBeInTheDocument();
  });

  it("should pass booking status to modal", () => {
    mockUseCenter.mockReturnValue({
      center: mockCenter,
      status: "success",
      error: null
    });
    mockUseBooking.mockReturnValue({
      booking: null,
      status: "loading",
      error: null,
      createBooking: mockCreateBooking,
      reset: mockReset
    });

    render(
      <CenterPage params={Promise.resolve({ center: "bella-vita-spa" })} />
    );

    expect(screen.getByText("Status: loading")).toBeInTheDocument();
  });

  it("should call getBookingsByCenterId with center id", () => {
    mockUseCenter.mockReturnValue({
      center: mockCenter,
      status: "success",
      error: null
    });
    mockUseBooking.mockReturnValue({
      booking: null,
      status: "idle",
      error: null,
      createBooking: mockCreateBooking,
      reset: mockReset
    });

    render(
      <CenterPage params={Promise.resolve({ center: "bella-vita-spa" })} />
    );

    expect(mockGetBookingsByCenterId).toHaveBeenCalledWith("center-1");
  });

  it("should handle empty bookings", () => {
    mockGetBookingsByCenterId.mockReturnValue([]);
    mockUseCenter.mockReturnValue({
      center: mockCenter,
      status: "success",
      error: null
    });
    mockUseBooking.mockReturnValue({
      booking: null,
      status: "idle",
      error: null,
      createBooking: mockCreateBooking,
      reset: mockReset
    });

    render(
      <CenterPage params={Promise.resolve({ center: "bella-vita-spa" })} />
    );

    expect(screen.getByText("0 bookings")).toBeInTheDocument();
  });

  it("should use center slug from params", () => {
    mockUse.mockReturnValue({ center: "radiant-beauty" });
    mockUseCenter.mockReturnValue({
      center: null,
      status: "loading",
      error: null
    });
    mockUseBooking.mockReturnValue({
      booking: null,
      status: "idle",
      error: null,
      createBooking: mockCreateBooking,
      reset: mockReset
    });

    render(
      <CenterPage params={Promise.resolve({ center: "radiant-beauty" })} />
    );

    expect(mockUseCenter).toHaveBeenCalledWith("radiant-beauty");
  });

  it("should not call createBooking if no service selected", async () => {
    const user = userEvent.setup();
    mockUseCenter.mockReturnValue({
      center: mockCenter,
      status: "success",
      error: null
    });
    mockUseBooking.mockReturnValue({
      booking: null,
      status: "idle",
      error: null,
      createBooking: mockCreateBooking,
      reset: mockReset
    });

    render(
      <CenterPage params={Promise.resolve({ center: "bella-vita-spa" })} />
    );

    // Submit without opening modal (no service selected)
    await user.click(screen.getByText("Submit"));

    expect(mockCreateBooking).not.toHaveBeenCalled();
  });
});
