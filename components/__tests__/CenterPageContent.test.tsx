import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CenterPageContent } from "../CenterPageContent";
import { Center, Booking } from "@/types/domain";

// Mock child components
jest.mock("../CenterHeader", () => ({
  CenterHeader: ({ center }: { center: Center }) => (
    <div data-testid="center-header">
      <h1>{center.name}</h1>
    </div>
  )
}));

jest.mock("../CenterServices", () => ({
  CenterServices: ({
    services,
    onBook
  }: {
    services: readonly { id: string; name: string }[];
    onBook: (serviceId: string) => void;
  }) => (
    <div data-testid="center-services">
      {services.map((service) => (
        <button key={service.id} onClick={() => onBook(service.id)}>
          Book {service.name}
        </button>
      ))}
    </div>
  )
}));

jest.mock("../CenterBookings", () => ({
  CenterBookings: ({
    centerName,
    bookings
  }: {
    centerName: string;
    bookings: readonly Booking[];
  }) => (
    <div data-testid="center-bookings">
      <h2>Bookings for {centerName}</h2>
      <p>{bookings.length} bookings</p>
    </div>
  )
}));

jest.mock("../ErrorBoundaryTest", () => ({
  ErrorBoundaryTest: () => <div data-testid="error-boundary-test" />
}));

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
    serviceId: "service-1-2",
    centerId: "center-1",
    clientName: "John Doe",
    clientEmail: "john@example.com",
    date: "2025-12-25",
    time: "14:30",
    createdAt: "2025-11-19T10:00:00Z"
  }
];

describe("CenterPageContent", () => {
  const mockOnBookService = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render CenterHeader component", () => {
    render(
      <CenterPageContent
        center={mockCenter}
        centerBookings={mockBookings}
        onBookService={mockOnBookService}
      />
    );

    expect(screen.getByTestId("center-header")).toBeInTheDocument();
    expect(screen.getByText("Bella Vita Spa")).toBeInTheDocument();
  });

  it("should render CenterServices component", () => {
    render(
      <CenterPageContent
        center={mockCenter}
        centerBookings={mockBookings}
        onBookService={mockOnBookService}
      />
    );

    expect(screen.getByTestId("center-services")).toBeInTheDocument();
    expect(screen.getByText("Book Classic Facial")).toBeInTheDocument();
    expect(screen.getByText("Book Swedish Massage")).toBeInTheDocument();
  });

  it("should render CenterBookings component", () => {
    render(
      <CenterPageContent
        center={mockCenter}
        centerBookings={mockBookings}
        onBookService={mockOnBookService}
      />
    );

    expect(screen.getByTestId("center-bookings")).toBeInTheDocument();
    expect(screen.getByText("Bookings for Bella Vita Spa")).toBeInTheDocument();
    expect(screen.getByText("1 bookings")).toBeInTheDocument();
  });

  it("should render ErrorBoundaryTest component", () => {
    render(
      <CenterPageContent
        center={mockCenter}
        centerBookings={mockBookings}
        onBookService={mockOnBookService}
      />
    );

    expect(screen.getByTestId("error-boundary-test")).toBeInTheDocument();
  });

  it("should call onBookService when booking a service", async () => {
    const user = userEvent.setup();
    render(
      <CenterPageContent
        center={mockCenter}
        centerBookings={mockBookings}
        onBookService={mockOnBookService}
      />
    );

    await user.click(screen.getByText("Book Classic Facial"));

    expect(mockOnBookService).toHaveBeenCalledTimes(1);
    expect(mockOnBookService).toHaveBeenCalledWith("service-1-1");
  });

  it("should render with empty bookings", () => {
    render(
      <CenterPageContent
        center={mockCenter}
        centerBookings={[]}
        onBookService={mockOnBookService}
      />
    );

    expect(screen.getByText("0 bookings")).toBeInTheDocument();
  });

  it("should have correct layout structure", () => {
    const { container } = render(
      <CenterPageContent
        center={mockCenter}
        centerBookings={mockBookings}
        onBookService={mockOnBookService}
      />
    );

    const mainDiv = container.querySelector(".min-h-screen.bg-gray-50");
    expect(mainDiv).toBeInTheDocument();

    const containerDiv = container.querySelector(".container.mx-auto");
    expect(containerDiv).toBeInTheDocument();
  });

  it("should pass center services to CenterServices", () => {
    render(
      <CenterPageContent
        center={mockCenter}
        centerBookings={mockBookings}
        onBookService={mockOnBookService}
      />
    );

    // Both services should be rendered
    expect(screen.getByText("Book Classic Facial")).toBeInTheDocument();
    expect(screen.getByText("Book Swedish Massage")).toBeInTheDocument();
  });

  it("should call onBookService with different service ids", async () => {
    const user = userEvent.setup();
    render(
      <CenterPageContent
        center={mockCenter}
        centerBookings={mockBookings}
        onBookService={mockOnBookService}
      />
    );

    await user.click(screen.getByText("Book Swedish Massage"));

    expect(mockOnBookService).toHaveBeenCalledWith("service-1-2");
  });
});
