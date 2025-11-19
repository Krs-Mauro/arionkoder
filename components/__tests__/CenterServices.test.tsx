import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CenterServices } from "../CenterServices";
import { Service } from "@/types/domain";

// Mock ServiceCard component
jest.mock("../ServiceCard", () => ({
  ServiceCard: ({
    service,
    onBook
  }: {
    service: Service;
    onBook: (serviceId: string) => void;
  }) => (
    <div data-testid={`service-card-${service.id}`}>
      <h3>{service.name}</h3>
      <p>{service.description}</p>
      <button onClick={() => onBook(service.id)}>Book {service.name}</button>
    </div>
  )
}));

const mockServices: Service[] = [
  {
    id: "service-1-1",
    name: "Classic Facial",
    description: "Deep cleansing facial with customized treatment",
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
  },
  {
    id: "service-1-3",
    name: "Manicure & Pedicure",
    description: "Complete nail care",
    duration: 75,
    price: 6500,
    centerId: "center-1"
  }
];

describe("CenterServices", () => {
  const mockOnBook = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render heading", () => {
    render(<CenterServices services={mockServices} onBook={mockOnBook} />);

    expect(screen.getByText("Our Services")).toBeInTheDocument();
  });

  it("should render all services", () => {
    render(<CenterServices services={mockServices} onBook={mockOnBook} />);

    expect(screen.getByText("Classic Facial")).toBeInTheDocument();
    expect(screen.getByText("Swedish Massage")).toBeInTheDocument();
    expect(screen.getByText("Manicure & Pedicure")).toBeInTheDocument();
  });

  it("should render ServiceCard for each service", () => {
    render(<CenterServices services={mockServices} onBook={mockOnBook} />);

    expect(screen.getByTestId("service-card-service-1-1")).toBeInTheDocument();
    expect(screen.getByTestId("service-card-service-1-2")).toBeInTheDocument();
    expect(screen.getByTestId("service-card-service-1-3")).toBeInTheDocument();
  });

  it("should call onBook with correct service id", async () => {
    const user = userEvent.setup();
    render(<CenterServices services={mockServices} onBook={mockOnBook} />);

    await user.click(screen.getByText("Book Classic Facial"));

    expect(mockOnBook).toHaveBeenCalledTimes(1);
    expect(mockOnBook).toHaveBeenCalledWith("service-1-1");
  });

  it("should call onBook for different services", async () => {
    const user = userEvent.setup();
    render(<CenterServices services={mockServices} onBook={mockOnBook} />);

    await user.click(screen.getByText("Book Swedish Massage"));

    expect(mockOnBook).toHaveBeenCalledWith("service-1-2");
  });

  it("should render with empty services array", () => {
    render(<CenterServices services={[]} onBook={mockOnBook} />);

    expect(screen.getByText("Our Services")).toBeInTheDocument();
    expect(screen.queryByTestId(/service-card-/)).not.toBeInTheDocument();
  });

  it("should have grid layout classes", () => {
    const { container } = render(
      <CenterServices services={mockServices} onBook={mockOnBook} />
    );

    const grid = container.querySelector(
      ".grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3"
    );
    expect(grid).toBeInTheDocument();
  });

  it("should render with single service", () => {
    const singleService = [mockServices[0]!];

    render(<CenterServices services={singleService} onBook={mockOnBook} />);

    expect(screen.getByTestId("service-card-service-1-1")).toBeInTheDocument();
    expect(
      screen.queryByTestId("service-card-service-1-2")
    ).not.toBeInTheDocument();
  });

  it("should have correct heading level", () => {
    render(<CenterServices services={mockServices} onBook={mockOnBook} />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Our Services");
  });
});

