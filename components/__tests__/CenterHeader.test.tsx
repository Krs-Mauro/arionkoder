import { render, screen } from "@testing-library/react";
import { CenterHeader } from "../CenterHeader";
import { Center } from "@/types/domain";

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

const mockCenter: Center = {
  id: "center-1",
  slug: "bella-vita-spa",
  name: "Bella Vita Spa",
  description:
    "Experience luxury and relaxation at Bella Vita Spa. Our expert team provides premium beauty treatments in a serene environment.",
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
};

describe("CenterHeader", () => {
  it("should render center name", () => {
    render(<CenterHeader center={mockCenter} />);

    expect(screen.getByText("Bella Vita Spa")).toBeInTheDocument();
  });

  it("should render center description", () => {
    render(<CenterHeader center={mockCenter} />);

    expect(
      screen.getByText(/Experience luxury and relaxation at Bella Vita Spa/)
    ).toBeInTheDocument();
  });

  it("should render center logo", () => {
    render(<CenterHeader center={mockCenter} />);

    const logo = screen.getByRole("img", { name: "Center logo" });
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveTextContent("💆‍♀️");
  });

  it("should render back to all centers link", () => {
    render(<CenterHeader center={mockCenter} />);

    const link = screen.getByText("Back to All Centers");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  it("should render back arrow icon", () => {
    const { container } = render(<CenterHeader center={mockCenter} />);

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("w-5", "h-5", "mr-2");
  });

  it("should have correct heading level", () => {
    render(<CenterHeader center={mockCenter} />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Bella Vita Spa");
  });

  it("should render with different center data", () => {
    const differentCenter: Center = {
      id: "center-2",
      slug: "radiant-beauty-lounge",
      name: "Radiant Beauty Lounge",
      description: "Modern beauty treatments in a chic setting",
      logo: "✨",
      services: []
    };

    render(<CenterHeader center={differentCenter} />);

    expect(screen.getByText("Radiant Beauty Lounge")).toBeInTheDocument();
    expect(
      screen.getByText("Modern beauty treatments in a chic setting")
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Center logo" })).toHaveTextContent(
      "✨"
    );
  });

  it("should have correct styling classes", () => {
    const { container } = render(<CenterHeader center={mockCenter} />);

    const headerCard = container.querySelector(".bg-white.rounded-lg.shadow-md");
    expect(headerCard).toBeInTheDocument();
  });
});

