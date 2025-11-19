import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorBoundary, ErrorTrigger } from "../ErrorBoundary";

// Mock Button component
jest.mock("../Button", () => ({
  Button: ({
    children,
    onClick,
    variant,
    fullWidth
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: string;
    fullWidth?: boolean;
  }) => (
    <button
      onClick={onClick}
      data-variant={variant}
      data-fullwidth={fullWidth?.toString()}
    >
      {children}
    </button>
  )
}));

// Component that throws an error
const ThrowError = ({ message }: { message: string }): never => {
  throw new Error(message);
};

// Suppress console.error for tests
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe("ErrorBoundary", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("should render error UI when child component throws", () => {
    render(
      <ErrorBoundary>
        <ThrowError message="Test error" />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Test error")).toBeInTheDocument();
  });

  it("should display error message from thrown error", () => {
    render(
      <ErrorBoundary>
        <ThrowError message="Custom error message" />
      </ErrorBoundary>
    );

    expect(screen.getByText("Custom error message")).toBeInTheDocument();
  });

  it("should render Try Again button", () => {
    render(
      <ErrorBoundary>
        <ThrowError message="Test error" />
      </ErrorBoundary>
    );

    expect(screen.getByText("Try Again")).toBeInTheDocument();
  });

  it("should reset error state when Try Again is clicked", async () => {
    const user = userEvent.setup();
    let shouldThrow = true;

    const ConditionalError = (): React.ReactElement => {
      if (shouldThrow) {
        throw new Error("Test error");
      }
      return <div>Content after reset</div>;
    };

    const { rerender } = render(
      <ErrorBoundary>
        <ConditionalError />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    // Simulate fixing the error
    shouldThrow = false;

    await user.click(screen.getByText("Try Again"));

    // After reset, the component should re-render
    rerender(
      <ErrorBoundary>
        <ConditionalError />
      </ErrorBoundary>
    );

    expect(screen.getByText("Content after reset")).toBeInTheDocument();
  });

  it("should render error icon", () => {
    const { container } = render(
      <ErrorBoundary>
        <ThrowError message="Test error" />
      </ErrorBoundary>
    );

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("w-8", "h-8", "text-red-600");
  });

  it("should have correct styling classes", () => {
    const { container } = render(
      <ErrorBoundary>
        <ThrowError message="Test error" />
      </ErrorBoundary>
    );

    const mainDiv = container.querySelector(".min-h-screen.flex.items-center");
    expect(mainDiv).toBeInTheDocument();

    const card = container.querySelector(".bg-white.rounded-lg.shadow-lg");
    expect(card).toBeInTheDocument();
  });

  it("should render heading with correct level", () => {
    render(
      <ErrorBoundary>
        <ThrowError message="Test error" />
      </ErrorBoundary>
    );

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Something went wrong");
  });

  it("should call console.error when error is caught", () => {
    render(
      <ErrorBoundary>
        <ThrowError message="Test error" />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalled();
  });

  it("should render multiple children when no error", () => {
    render(
      <ErrorBoundary>
        <div>First child</div>
        <div>Second child</div>
      </ErrorBoundary>
    );

    expect(screen.getByText("First child")).toBeInTheDocument();
    expect(screen.getByText("Second child")).toBeInTheDocument();
  });
});

describe("ErrorTrigger", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render button with correct text", () => {
    render(<ErrorTrigger />);

    expect(screen.getByText("Trigger Test Error")).toBeInTheDocument();
  });

  it("should render button with danger variant", () => {
    render(<ErrorTrigger />);

    const button = screen.getByText("Trigger Test Error");
    expect(button).toHaveAttribute("data-variant", "danger");
  });

  it("should throw error when button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <ErrorBoundary>
        <ErrorTrigger />
      </ErrorBoundary>
    );

    await user.click(screen.getByText("Trigger Test Error"));

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test error triggered by the user")
    ).toBeInTheDocument();
  });

  it("should be caught by ErrorBoundary", async () => {
    const user = userEvent.setup();

    render(
      <ErrorBoundary>
        <div>Normal content</div>
        <ErrorTrigger />
      </ErrorBoundary>
    );

    expect(screen.getByText("Normal content")).toBeInTheDocument();

    await user.click(screen.getByText("Trigger Test Error"));

    expect(screen.queryByText("Normal content")).not.toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("should allow recovery after error is triggered", async () => {
    const user = userEvent.setup();

    render(
      <ErrorBoundary>
        <ErrorTrigger />
      </ErrorBoundary>
    );

    // Trigger error
    await user.click(screen.getByText("Trigger Test Error"));
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    // Reset
    await user.click(screen.getByText("Try Again"));

    // Should render ErrorTrigger again
    expect(screen.getByText("Trigger Test Error")).toBeInTheDocument();
  });
});
