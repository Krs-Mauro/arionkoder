import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ServiceCard } from "../ServiceCard";
import { Service } from "@/types/domain";

describe("ServiceCard", () => {
  const mockService: Service = {
    id: "service-1",
    name: "Relaxing Massage",
    description: "A soothing full-body massage",
    duration: 60,
    price: 8500,
    centerId: "center-1"
  };

  const mockOnBook = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render service name", () => {
    render(<ServiceCard service={mockService} onBook={mockOnBook} />);

    expect(screen.getByText("Relaxing Massage")).toBeInTheDocument();
  });

  it("should render service description", () => {
    render(<ServiceCard service={mockService} onBook={mockOnBook} />);

    expect(screen.getByText("A soothing full-body massage")).toBeInTheDocument();
  });

  it("should format price correctly", () => {
    render(<ServiceCard service={mockService} onBook={mockOnBook} />);

    expect(screen.getByText("$85.00")).toBeInTheDocument();
  });

  it("should format duration in minutes", () => {
    const service = { ...mockService, duration: 45 };
    render(<ServiceCard service={service} onBook={mockOnBook} />);

    expect(screen.getByText("45 min")).toBeInTheDocument();
  });

  it("should format duration in hours", () => {
    const service = { ...mockService, duration: 120 };
    render(<ServiceCard service={service} onBook={mockOnBook} />);

    expect(screen.getByText("2 hours")).toBeInTheDocument();
  });

  it("should format duration in hours and minutes", () => {
    const service = { ...mockService, duration: 90 };
    render(<ServiceCard service={service} onBook={mockOnBook} />);

    expect(screen.getByText("1h 30min")).toBeInTheDocument();
  });

  it("should format single hour correctly", () => {
    const service = { ...mockService, duration: 60 };
    render(<ServiceCard service={service} onBook={mockOnBook} />);

    expect(screen.getByText("1 hour")).toBeInTheDocument();
  });

  it("should render Book Now button", () => {
    render(<ServiceCard service={mockService} onBook={mockOnBook} />);

    expect(screen.getByRole("button", { name: /Book/i })).toBeInTheDocument();
  });

  it("should call onBook with service id when button clicked", async () => {
    const user = userEvent.setup();
    render(<ServiceCard service={mockService} onBook={mockOnBook} />);

    await user.click(screen.getByRole("button", { name: /Book/i }));

    expect(mockOnBook).toHaveBeenCalledTimes(1);
    expect(mockOnBook).toHaveBeenCalledWith("service-1");
  });

  it("should have accessible button label", () => {
    render(<ServiceCard service={mockService} onBook={mockOnBook} />);

    expect(
      screen.getByRole("button", { name: "Book Relaxing Massage" })
    ).toBeInTheDocument();
  });

  it("should render duration icon", () => {
    const { container } = render(
      <ServiceCard service={mockService} onBook={mockOnBook} />
    );

    const icon = container.querySelector('svg[aria-hidden="true"]');
    expect(icon).toBeInTheDocument();
  });

  it("should apply hover styles", () => {
    const { container } = render(
      <ServiceCard service={mockService} onBook={mockOnBook} />
    );

    const card = container.firstChild;
    expect(card).toHaveClass("hover:shadow-lg");
  });
});

