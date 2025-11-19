import { render, screen } from "@testing-library/react";
import { ErrorMessage } from "../ErrorMessage";

describe("ErrorMessage", () => {
  it("should render with message", () => {
    render(<ErrorMessage message="Something went wrong" />);

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("should render with default title", () => {
    render(<ErrorMessage message="Error occurred" />);

    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("should render with custom title", () => {
    render(<ErrorMessage message="Failed" title="Validation Error" />);

    expect(screen.getByText("Validation Error")).toBeInTheDocument();
  });

  it("should have role alert for accessibility", () => {
    render(<ErrorMessage message="Error" />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("should have aria-live polite", () => {
    const { container } = render(<ErrorMessage message="Error" />);

    const alert = container.querySelector('[aria-live="polite"]');
    expect(alert).toBeInTheDocument();
  });

  it("should render error icon", () => {
    const { container } = render(<ErrorMessage message="Error" />);

    const icon = container.querySelector('svg[aria-hidden="true"]');
    expect(icon).toBeInTheDocument();
  });

  it("should apply error styling classes", () => {
    render(<ErrorMessage message="Error" />);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("bg-red-50", "border-red-200");
  });
});
