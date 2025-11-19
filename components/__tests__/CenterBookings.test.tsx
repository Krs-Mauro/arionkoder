import { render, screen } from "@testing-library/react";
import { CenterBookings } from "../CenterBookings";
import { Booking } from "@/types/domain";

// Mock Next.js Link component
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    children,
    className
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  )
}));

// Mock BookingsList component
jest.mock("../BookingsList", () => ({
  BookingsList: ({
    bookings,
    emptyMessage
  }: {
    bookings: readonly Booking[];
    emptyMessage?: string;
  }) => (
    <div data-testid="bookings-list">
      {bookings.length === 0 ? (
        <p>{emptyMessage}</p>
      ) : (
        <ul>
          {bookings.map((booking) => (
            <li key={booking.id}>{booking.clientName}</li>
          ))}
        </ul>
      )}
    </div>
  )
}));

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
    serviceId: "service-1-1",
    centerId: "center-1",
    clientName: "Jane Smith",
    clientEmail: "jane@example.com",
    date: "2025-12-26",
    time: "09:15",
    createdAt: "2025-11-20T15:30:00Z"
  }
];

describe("CenterBookings", () => {
  it("should render heading with center name", () => {
    render(
      <CenterBookings centerName="Bella Vita Spa" bookings={mockBookings} />
    );

    expect(
      screen.getByText("Bookings for Bella Vita Spa")
    ).toBeInTheDocument();
  });

  it("should render link to view all bookings", () => {
    render(
      <CenterBookings centerName="Bella Vita Spa" bookings={mockBookings} />
    );

    const link = screen.getByText("View All Bookings →");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/bookings");
  });

  it("should render BookingsList with bookings", () => {
    render(
      <CenterBookings centerName="Bella Vita Spa" bookings={mockBookings} />
    );

    expect(screen.getByTestId("bookings-list")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("should render empty message when no bookings", () => {
    render(<CenterBookings centerName="Bella Vita Spa" bookings={[]} />);

    expect(
      screen.getByText("No bookings yet for Bella Vita Spa")
    ).toBeInTheDocument();
  });

  it("should have correct styling classes", () => {
    const { container } = render(
      <CenterBookings centerName="Bella Vita Spa" bookings={mockBookings} />
    );

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass("mb-8");
  });

  it("should render with different center name", () => {
    render(
      <CenterBookings
        centerName="Radiant Beauty Lounge"
        bookings={mockBookings}
      />
    );

    expect(
      screen.getByText("Bookings for Radiant Beauty Lounge")
    ).toBeInTheDocument();
    expect(
      screen.queryByText("No bookings yet for Radiant Beauty Lounge")
    ).not.toBeInTheDocument();
  });

  it("should render empty message with different center name", () => {
    render(<CenterBookings centerName="Radiant Beauty Lounge" bookings={[]} />);

    expect(
      screen.getByText("No bookings yet for Radiant Beauty Lounge")
    ).toBeInTheDocument();
  });
});

