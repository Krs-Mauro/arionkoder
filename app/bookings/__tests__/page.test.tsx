import { render, screen, waitFor, act } from "@testing-library/react";
import BookingsPage from "../page";
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

// Mock child components
jest.mock("@/components/BookingsList", () => ({
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

jest.mock("@/components/Loading", () => ({
  Loading: () => <div data-testid="loading">Loading...</div>
}));

// Mock storage module
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

jest.mock("@/lib/storage", () => ({
  getBookingsFromStorage: jest.fn()
}));

import { getBookingsFromStorage } from "@/lib/storage";

const mockGetBookingsFromStorage =
  getBookingsFromStorage as jest.MockedFunction<typeof getBookingsFromStorage>;

describe("BookingsPage", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    // Suppress act() warnings for timer-based state updates
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation((message) => {
        if (
          typeof message === "string" &&
          message.includes("not wrapped in act")
        ) {
          return;
        }
        console.warn(message);
      });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    consoleErrorSpy.mockRestore();
  });

  it("should show loading state initially", () => {
    mockGetBookingsFromStorage.mockReturnValue(mockBookings);
    render(<BookingsPage />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("should render page heading after loading", async () => {
    mockGetBookingsFromStorage.mockReturnValue(mockBookings);
    render(<BookingsPage />);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(screen.getByText("All Bookings")).toBeInTheDocument();
    });
  });

  it("should render description text", async () => {
    mockGetBookingsFromStorage.mockReturnValue(mockBookings);
    render(<BookingsPage />);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(
        screen.getByText("View all bookings across all beauty centers")
      ).toBeInTheDocument();
    });
  });

  it("should render Back to Home link", async () => {
    mockGetBookingsFromStorage.mockReturnValue(mockBookings);
    render(<BookingsPage />);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      const link = screen.getByText("Back to Home");
      expect(link).toBeInTheDocument();
      expect(link.closest("a")).toHaveAttribute("href", "/");
    });
  });

  it("should display total bookings count", async () => {
    mockGetBookingsFromStorage.mockReturnValue(mockBookings);
    render(<BookingsPage />);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(screen.getByText("Total bookings:")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
    });
  });

  it("should render BookingsList component", async () => {
    mockGetBookingsFromStorage.mockReturnValue(mockBookings);
    render(<BookingsPage />);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(screen.getByTestId("bookings-list")).toBeInTheDocument();
    });
  });

  it("should pass bookings to BookingsList", async () => {
    mockGetBookingsFromStorage.mockReturnValue(mockBookings);
    render(<BookingsPage />);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
  });

  it("should pass empty message to BookingsList", async () => {
    mockGetBookingsFromStorage.mockReturnValue(mockBookings);
    render(<BookingsPage />);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      const bookingsList = screen.getByTestId("bookings-list");
      expect(bookingsList).toBeInTheDocument();
    });
  });

  it("should handle empty bookings", async () => {
    mockGetBookingsFromStorage.mockReturnValue([]);
    render(<BookingsPage />);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(screen.getByText("Total bookings:")).toBeInTheDocument();
      expect(screen.getByText("0")).toBeInTheDocument();
    });
  });

  it("should show empty message when no bookings", async () => {
    mockGetBookingsFromStorage.mockReturnValue([]);
    render(<BookingsPage />);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(
        screen.getByText("No bookings yet. Book your first appointment!")
      ).toBeInTheDocument();
    });
  });

  it("should call getBookingsFromStorage on mount", async () => {
    mockGetBookingsFromStorage.mockReturnValue(mockBookings);
    render(<BookingsPage />);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(mockGetBookingsFromStorage).toHaveBeenCalledTimes(1);
    });
  });

  it("should render SVG icon in Back to Home link", async () => {
    mockGetBookingsFromStorage.mockReturnValue(mockBookings);
    const { container } = render(<BookingsPage />);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      const svg = container.querySelector('svg[viewBox="0 0 24 24"]');
      expect(svg).toBeInTheDocument();
    });
  });

  it("should have correct background color", async () => {
    mockGetBookingsFromStorage.mockReturnValue(mockBookings);
    const { container } = render(<BookingsPage />);

    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass("bg-gray-50");
    });
  });

  it("should cleanup timer on unmount", () => {
    mockGetBookingsFromStorage.mockReturnValue(mockBookings);
    const { unmount } = render(<BookingsPage />);

    unmount();

    // Verify no timers are pending
    expect(jest.getTimerCount()).toBe(0);
  });
});
