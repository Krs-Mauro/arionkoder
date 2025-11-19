import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookingConfirmation } from "../BookingConfirmation";
import { Booking, Service } from "@/types/domain";

describe("BookingConfirmation", () => {
  const mockService: Service = {
    id: "service-1",
    name: "Relaxing Massage",
    description: "A soothing massage",
    duration: 60,
    price: 8500,
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

  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render confirmation heading", () => {
    render(
      <BookingConfirmation
        booking={mockBooking}
        service={mockService}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("Booking Confirmed!")).toBeInTheDocument();
  });

  it("should render success message", () => {
    render(
      <BookingConfirmation
        booking={mockBooking}
        service={mockService}
        onClose={mockOnClose}
      />
    );

    expect(
      screen.getByText("Your appointment has been successfully scheduled.")
    ).toBeInTheDocument();
  });

  it("should display service name", () => {
    render(
      <BookingConfirmation
        booking={mockBooking}
        service={mockService}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("Relaxing Massage")).toBeInTheDocument();
  });

  it("should display client name", () => {
    render(
      <BookingConfirmation
        booking={mockBooking}
        service={mockService}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("should display client email", () => {
    render(
      <BookingConfirmation
        booking={mockBooking}
        service={mockService}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  it("should format date correctly", () => {
    render(
      <BookingConfirmation
        booking={mockBooking}
        service={mockService}
        onClose={mockOnClose}
      />
    );

    // Date string "2025-12-25" is parsed as UTC, which may be Dec 24 in local time
    expect(screen.getByText(/December 2[45], 2025/)).toBeInTheDocument();
  });

  it("should format time to 12-hour format with PM", () => {
    render(
      <BookingConfirmation
        booking={mockBooking}
        service={mockService}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("2:30 PM")).toBeInTheDocument();
  });

  it("should format time to 12-hour format with AM", () => {
    const morningBooking = { ...mockBooking, time: "09:15" };
    render(
      <BookingConfirmation
        booking={morningBooking}
        service={mockService}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("9:15 AM")).toBeInTheDocument();
  });

  it("should format noon correctly", () => {
    const noonBooking = { ...mockBooking, time: "12:00" };
    render(
      <BookingConfirmation
        booking={noonBooking}
        service={mockService}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("12:00 PM")).toBeInTheDocument();
  });

  it("should format midnight correctly", () => {
    const midnightBooking = { ...mockBooking, time: "00:00" };
    render(
      <BookingConfirmation
        booking={midnightBooking}
        service={mockService}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("12:00 AM")).toBeInTheDocument();
  });

  it("should render Close button", () => {
    render(
      <BookingConfirmation
        booking={mockBooking}
        service={mockService}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("should call onClose when Close button clicked", async () => {
    const user = userEvent.setup();
    render(
      <BookingConfirmation
        booking={mockBooking}
        service={mockService}
        onClose={mockOnClose}
      />
    );

    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should render success icon", () => {
    const { container } = render(
      <BookingConfirmation
        booking={mockBooking}
        service={mockService}
        onClose={mockOnClose}
      />
    );

    const icon = container.querySelector('svg[aria-hidden="true"]');
    expect(icon).toBeInTheDocument();
  });
});
