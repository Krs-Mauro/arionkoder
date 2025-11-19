import { render, screen } from "@testing-library/react";
import { CenterBookingModal } from "../CenterBookingModal";
import { Booking, Service, BookingFormData } from "@/types/domain";

// Mock child components
jest.mock("../BookingModal", () => ({
  BookingModal: ({
    isOpen,
    onClose,
    title,
    children
  }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
  }) => (
    <div data-testid="booking-modal" data-open={isOpen}>
      <h2>{title}</h2>
      <button onClick={onClose}>Close</button>
      {children}
    </div>
  )
}));

jest.mock("../BookingForm", () => ({
  BookingForm: ({
    onSubmit,
    isLoading
  }: {
    onSubmit: (data: BookingFormData) => void;
    isLoading: boolean;
  }) => (
    <form data-testid="booking-form" data-loading={isLoading}>
      <button type="button" onClick={() => onSubmit({} as BookingFormData)}>
        Submit
      </button>
    </form>
  )
}));

jest.mock("../BookingConfirmation", () => ({
  BookingConfirmation: ({
    service,
    onClose
  }: {
    booking: Booking;
    service: Service;
    onClose: () => void;
  }) => (
    <div data-testid="booking-confirmation">
      <p>Booking confirmed for {service.name}</p>
      <button onClick={onClose}>Close</button>
    </div>
  )
}));

jest.mock("../ErrorMessage", () => ({
  ErrorMessage: ({ message }: { message: string }) => (
    <div data-testid="error-message">{message}</div>
  )
}));

const mockService: Service = {
  id: "service-1",
  name: "Swedish Massage",
  description: "Relaxing massage",
  duration: 90,
  price: 12000,
  centerId: "center-1"
};

const mockBooking: Booking = {
  id: "booking-1",
  serviceId: "service-1",
  centerId: "center-1",
  clientName: "John Doe",
  clientEmail: "john@example.com",
  date: "2025-12-25",
  time: "14:30",
  createdAt: "2025-11-19T10:00:00Z"
};

describe("CenterBookingModal", () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render with booking form when status is idle", () => {
    render(
      <CenterBookingModal
        isOpen={true}
        onClose={mockOnClose}
        selectedService={mockService}
        booking={null}
        bookingStatus="idle"
        bookingError={null}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByTestId("booking-form")).toBeInTheDocument();
    expect(
      screen.queryByTestId("booking-confirmation")
    ).not.toBeInTheDocument();
  });

  it("should render with booking form when status is loading", () => {
    render(
      <CenterBookingModal
        isOpen={true}
        onClose={mockOnClose}
        selectedService={mockService}
        booking={null}
        bookingStatus="loading"
        bookingError={null}
        onSubmit={mockOnSubmit}
      />
    );

    const form = screen.getByTestId("booking-form");
    expect(form).toBeInTheDocument();
    expect(form).toHaveAttribute("data-loading", "true");
  });

  it("should render confirmation when status is success", () => {
    render(
      <CenterBookingModal
        isOpen={true}
        onClose={mockOnClose}
        selectedService={mockService}
        booking={mockBooking}
        bookingStatus="success"
        bookingError={null}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByTestId("booking-confirmation")).toBeInTheDocument();
    expect(screen.queryByTestId("booking-form")).not.toBeInTheDocument();
  });

  it("should render error message when bookingError is present", () => {
    const errorMessage = "Booking failed";

    render(
      <CenterBookingModal
        isOpen={true}
        onClose={mockOnClose}
        selectedService={mockService}
        booking={null}
        bookingStatus="error"
        bookingError={errorMessage}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByTestId("error-message")).toHaveTextContent(errorMessage);
    expect(screen.getByTestId("booking-form")).toBeInTheDocument();
  });

  it("should show correct title for booking form", () => {
    render(
      <CenterBookingModal
        isOpen={true}
        onClose={mockOnClose}
        selectedService={mockService}
        booking={null}
        bookingStatus="idle"
        bookingError={null}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText("Book Swedish Massage")).toBeInTheDocument();
  });

  it("should show correct title for confirmation", () => {
    render(
      <CenterBookingModal
        isOpen={true}
        onClose={mockOnClose}
        selectedService={mockService}
        booking={mockBooking}
        bookingStatus="success"
        bookingError={null}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText("Booking Confirmed")).toBeInTheDocument();
  });

  it("should show generic title when no service selected", () => {
    render(
      <CenterBookingModal
        isOpen={true}
        onClose={mockOnClose}
        selectedService={null}
        booking={null}
        bookingStatus="idle"
        bookingError={null}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText("Book Service")).toBeInTheDocument();
  });

  it("should not show confirmation if booking is null", () => {
    render(
      <CenterBookingModal
        isOpen={true}
        onClose={mockOnClose}
        selectedService={mockService}
        booking={null}
        bookingStatus="success"
        bookingError={null}
        onSubmit={mockOnSubmit}
      />
    );

    expect(
      screen.queryByTestId("booking-confirmation")
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("booking-form")).toBeInTheDocument();
  });

  it("should not show confirmation if selectedService is null", () => {
    render(
      <CenterBookingModal
        isOpen={true}
        onClose={mockOnClose}
        selectedService={null}
        booking={mockBooking}
        bookingStatus="success"
        bookingError={null}
        onSubmit={mockOnSubmit}
      />
    );

    expect(
      screen.queryByTestId("booking-confirmation")
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("booking-form")).toBeInTheDocument();
  });

  it("should pass isOpen prop to BookingModal", () => {
    const { rerender } = render(
      <CenterBookingModal
        isOpen={false}
        onClose={mockOnClose}
        selectedService={mockService}
        booking={null}
        bookingStatus="idle"
        bookingError={null}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByTestId("booking-modal")).toHaveAttribute(
      "data-open",
      "false"
    );

    rerender(
      <CenterBookingModal
        isOpen={true}
        onClose={mockOnClose}
        selectedService={mockService}
        booking={null}
        bookingStatus="idle"
        bookingError={null}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByTestId("booking-modal")).toHaveAttribute(
      "data-open",
      "true"
    );
  });
});
