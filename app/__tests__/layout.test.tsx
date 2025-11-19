import React from "react";
import { render, screen } from "@testing-library/react";
import RootLayout, { metadata } from "../layout";

// Mock the ErrorBoundary component
jest.mock("@/components/ErrorBoundary", () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="error-boundary">{children}</div>
  )
}));

// Mock Next.js fonts
jest.mock("next/font/google", () => ({
  Geist: jest.fn(() => ({
    variable: "--font-geist-sans"
  })),
  Geist_Mono: jest.fn(() => ({
    variable: "--font-geist-mono"
  }))
}));

describe("RootLayout", () => {
  // Suppress expected hydration warnings for layout tests
  // These warnings occur because we're rendering html/body elements in a test container
  beforeAll(() => {
    const originalError = console.error;
    jest.spyOn(console, "error").mockImplementation((...args) => {
      const message = args[0];
      if (
        typeof message === "string" &&
        message.includes("cannot be a child of")
      ) {
        return; // Suppress this specific warning
      }
      originalError.apply(console, args);
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should render children inside ErrorBoundary", () => {
    // We can't render html/body in tests, so we test the component structure
    const TestWrapper = (): React.ReactElement => (
      <RootLayout>
        <div data-testid="test-child">Test Content</div>
      </RootLayout>
    );

    // Extract just the body content for testing
    render(<TestWrapper />);

    // The component renders html > body > ErrorBoundary > children
    // In tests, we can verify the ErrorBoundary and children are present
    expect(screen.getByTestId("error-boundary")).toBeInTheDocument();
    expect(screen.getByTestId("test-child")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("should wrap children in ErrorBoundary", () => {
    render(
      <RootLayout>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </RootLayout>
    );

    const errorBoundary = screen.getByTestId("error-boundary");
    expect(errorBoundary).toBeInTheDocument();

    // Both children should be inside the error boundary
    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();
  });

  it("should render ErrorBoundary with children", () => {
    render(
      <RootLayout>
        <main data-testid="main-content">Main Content</main>
      </RootLayout>
    );

    const errorBoundary = screen.getByTestId("error-boundary");
    const mainElement = screen.getByTestId("main-content");

    expect(errorBoundary).toBeInTheDocument();
    expect(mainElement).toBeInTheDocument();
    expect(errorBoundary).toContainElement(mainElement);
  });

  it("should handle empty children", () => {
    render(<RootLayout>{null}</RootLayout>);

    const errorBoundary = screen.getByTestId("error-boundary");
    expect(errorBoundary).toBeInTheDocument();
    expect(errorBoundary).toBeEmptyDOMElement();
  });

  it("should handle string children", () => {
    render(<RootLayout>Plain text content</RootLayout>);

    expect(screen.getByTestId("error-boundary")).toBeInTheDocument();
    expect(screen.getByText("Plain text content")).toBeInTheDocument();
  });

  it("should handle multiple nested children", () => {
    render(
      <RootLayout>
        <div>
          <header>Header</header>
          <main>
            <article>Article</article>
          </main>
          <footer>Footer</footer>
        </div>
      </RootLayout>
    );

    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Article")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("should render complex component trees", () => {
    render(
      <RootLayout>
        <div data-testid="app-container">
          <nav data-testid="navigation">Navigation</nav>
          <main data-testid="main">
            <section data-testid="section">Section Content</section>
          </main>
        </div>
      </RootLayout>
    );

    expect(screen.getByTestId("app-container")).toBeInTheDocument();
    expect(screen.getByTestId("navigation")).toBeInTheDocument();
    expect(screen.getByTestId("main")).toBeInTheDocument();
    expect(screen.getByTestId("section")).toBeInTheDocument();
  });
});

describe("metadata", () => {
  it("should have correct title", () => {
    expect(metadata.title).toBe("Beauty Center Booking System");
  });

  it("should have correct description", () => {
    expect(metadata.description).toBe(
      "Book appointments at your favorite beauty centers"
    );
  });

  it("should be a valid Metadata object", () => {
    expect(metadata).toHaveProperty("title");
    expect(metadata).toHaveProperty("description");
    expect(typeof metadata.title).toBe("string");
    expect(typeof metadata.description).toBe("string");
  });
});
