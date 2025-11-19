import { render, screen } from "@testing-library/react";
import Home from "../page";
import { MOCK_CENTERS } from "@/lib/mock-data";

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

// Mock the mock-data module
jest.mock("@/lib/mock-data", () => ({
  MOCK_CENTERS: [
    {
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
        }
      ]
    },
    {
      id: "center-2",
      slug: "radiant-beauty",
      name: "Radiant Beauty Lounge",
      description: "Modern beauty treatments",
      logo: "✨",
      services: [
        {
          id: "service-2-1",
          name: "Manicure",
          description: "Professional nail care",
          duration: 45,
          price: 5000,
          centerId: "center-2"
        }
      ]
    }
  ]
}));

describe("Home Page", () => {
  it("should render main heading", () => {
    render(<Home />);

    expect(
      screen.getByText("Beauty Center Booking System")
    ).toBeInTheDocument();
  });

  it("should render description text", () => {
    render(<Home />);

    expect(
      screen.getByText(/Choose a beauty center below to view their services/i)
    ).toBeInTheDocument();
  });

  it("should render View All Bookings link", () => {
    render(<Home />);

    const link = screen.getByText("View All Bookings");
    expect(link).toBeInTheDocument();
    expect(link.closest("a")).toHaveAttribute("href", "/bookings");
  });

  it("should render all centers from MOCK_CENTERS", () => {
    render(<Home />);

    MOCK_CENTERS.forEach((center) => {
      expect(screen.getByText(center.name)).toBeInTheDocument();
    });
  });

  it("should render center descriptions", () => {
    render(<Home />);

    expect(
      screen.getByText("Experience luxury and relaxation")
    ).toBeInTheDocument();
    expect(screen.getByText("Modern beauty treatments")).toBeInTheDocument();
  });

  it("should render center logos", () => {
    render(<Home />);

    const logos = screen.getAllByRole("img", { name: "Center logo" });
    expect(logos).toHaveLength(MOCK_CENTERS.length);
  });

  it("should render links to center pages", () => {
    render(<Home />);

    MOCK_CENTERS.forEach((center) => {
      const centerLink = screen.getByText(center.name).closest("a");
      expect(centerLink).toHaveAttribute("href", `/${center.slug}`);
    });
  });

  it("should display service count for each center", () => {
    render(<Home />);

    const serviceCounts = screen.getAllByText("1 Services Available →");
    expect(serviceCounts).toHaveLength(2);
  });

  it("should render footer text", () => {
    render(<Home />);

    expect(
      screen.getByText("Multi-tenant Booking System MVP")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Built with Next.js, TypeScript, and Tailwind CSS")
    ).toBeInTheDocument();
  });

  it("should render SVG icon in View All Bookings button", () => {
    const { container } = render(<Home />);

    const svg = container.querySelector('svg[viewBox="0 0 24 24"]');
    expect(svg).toBeInTheDocument();
  });

  it("should have correct CSS classes for gradient background", () => {
    const { container } = render(<Home />);

    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass(
      "bg-gradient-to-br",
      "from-purple-50",
      "to-pink-50"
    );
  });

  it("should render centers in a grid layout", () => {
    const { container } = render(<Home />);

    const grid = container.querySelector(".grid");
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass("grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3");
  });
});
