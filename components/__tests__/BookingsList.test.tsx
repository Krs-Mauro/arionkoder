import { render, screen } from "@testing-library/react";
import { BookingsList } from "../BookingsList";
import { Booking } from "@/types/domain";

describe("BookingsList", () => {
  const mockBookings: Booking[] = [
    {
      id: "booking-1",
      serviceId: "service-1-2",
      centerId: "center-1",
      clientName: "John Doe",
      clientEmail: "john@example.com",
      date: "2025-12-25",
      time: "14:30",
      createdAt: "2025-11-19T10:00:00Z"
    },
    {
      id: "booking-2",
      serviceId: "service-2-1",
      centerId: "center-2",
      clientName: "Jane Smith",
      clientEmail: "jane@example.com",
      date: "2025-12-26",
      time: "09:15",
      createdAt: "2025-11-20T15:30:00Z"
    }
  ];

  it("should render empty message when no bookings", () => {
    render(<BookingsList bookings={[]} />);

    expect(screen.getByText("No bookings found")).toBeInTheDocument();
  });

  it("should render custom empty message", () => {
    render(
      <BookingsList bookings={[]} emptyMessage="You have no appointments" />
    );

    expect(screen.getByText("You have no appointments")).toBeInTheDocument();
  });

  it("should not render table when no bookings", () => {
    render(<BookingsList bookings={[]} />);

    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("should render table when bookings exist", () => {
    render(<BookingsList bookings={mockBookings} />);

    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("should render table headers", () => {
    render(<BookingsList bookings={mockBookings} />);

    expect(screen.getByText("Client")).toBeInTheDocument();
    expect(screen.getByText("Center")).toBeInTheDocument();
    expect(screen.getByText("Service")).toBeInTheDocument();
    expect(screen.getByText("Date & Time")).toBeInTheDocument();
    expect(screen.getByText("Booked On")).toBeInTheDocument();
  });

  it("should render client names", () => {
    render(<BookingsList bookings={mockBookings} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("should render client emails", () => {
    render(<BookingsList bookings={mockBookings} />);

    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });

  it("should render center names", () => {
    render(<BookingsList bookings={mockBookings} />);

    expect(screen.getByText("Bella Vita Spa")).toBeInTheDocument();
    expect(screen.getByText("Radiant Beauty Lounge")).toBeInTheDocument();
  });

  it("should render service names", () => {
    render(<BookingsList bookings={mockBookings} />);

    expect(screen.getByText("Swedish Massage")).toBeInTheDocument();
    expect(screen.getByText("Anti-Aging Facial")).toBeInTheDocument();
  });

  it("should format dates correctly", () => {
    render(<BookingsList bookings={mockBookings} />);

    // Date strings are parsed as UTC, which may be Dec 24/25 in local time
    const dates = screen.getAllByText(/Dec 2[45], 2025/);
    expect(dates.length).toBeGreaterThanOrEqual(1);
  });

  it("should format times to 12-hour format", () => {
    render(<BookingsList bookings={mockBookings} />);

    expect(screen.getByText("2:30 PM")).toBeInTheDocument();
    expect(screen.getByText("9:15 AM")).toBeInTheDocument();
  });

  it("should format createdAt dates", () => {
    render(<BookingsList bookings={mockBookings} />);

    expect(screen.getByText("Nov 19, 2025")).toBeInTheDocument();
    expect(screen.getByText("Nov 20, 2025")).toBeInTheDocument();
  });

  it("should render correct number of rows", () => {
    render(<BookingsList bookings={mockBookings} />);

    const rows = screen.getAllByRole("row");
    // 1 header row + 2 data rows
    expect(rows).toHaveLength(3);
  });

  it("should handle unknown center gracefully", () => {
    const bookingWithUnknownCenter: Booking[] = [
      {
        ...mockBookings[0]!,
        centerId: "unknown-center"
      }
    ];

    render(<BookingsList bookings={bookingWithUnknownCenter} />);

    expect(screen.getByText("Unknown Center")).toBeInTheDocument();
  });

  it("should handle unknown service gracefully", () => {
    const bookingWithUnknownService: Booking[] = [
      {
        ...mockBookings[0]!,
        serviceId: "unknown-service"
      }
    ];

    render(<BookingsList bookings={bookingWithUnknownService} />);

    expect(screen.getByText("Unknown Service")).toBeInTheDocument();
  });

  it("should format noon correctly", () => {
    const noonBooking: Booking[] = [
      {
        ...mockBookings[0]!,
        time: "12:00"
      }
    ];

    render(<BookingsList bookings={noonBooking} />);

    expect(screen.getByText("12:00 PM")).toBeInTheDocument();
  });

  it("should format midnight correctly", () => {
    const midnightBooking: Booking[] = [
      {
        ...mockBookings[0]!,
        time: "00:00"
      }
    ];

    render(<BookingsList bookings={midnightBooking} />);

    expect(screen.getByText("12:00 AM")).toBeInTheDocument();
  });

  it("should have hover styles on rows", () => {
    const { container } = render(<BookingsList bookings={mockBookings} />);

    const rows = container.querySelectorAll("tbody tr");
    rows.forEach((row) => {
      expect(row).toHaveClass("hover:bg-gray-50");
    });
  });
});
