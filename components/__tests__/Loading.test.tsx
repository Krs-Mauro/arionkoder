import { render, screen } from "@testing-library/react";
import { Loading } from "../Loading";

describe("Loading", () => {
  it("should render with default message", () => {
    render(<Loading />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should render with custom message", () => {
    render(<Loading message="Please wait..." />);

    expect(screen.getByText("Please wait...")).toBeInTheDocument();
  });

  it("should have role status for accessibility", () => {
    render(<Loading />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("should render spinner elements", () => {
    const { container } = render(<Loading />);

    const spinners = container.querySelectorAll(".rounded-full");
    expect(spinners).toHaveLength(2);
  });

  it("should have animate-spin class on spinner", () => {
    const { container } = render(<Loading />);

    const animatedSpinner = container.querySelector(".animate-spin");
    expect(animatedSpinner).toBeInTheDocument();
  });
});

