import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookingForm } from "../BookingForm";

describe("BookingForm", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render all form fields", () => {
    render(<BookingForm onSubmit={mockOnSubmit} isLoading={false} />);

    expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Date")).toBeInTheDocument();
    expect(screen.getByLabelText("Time")).toBeInTheDocument();
  });

  it("should render submit button", () => {
    render(<BookingForm onSubmit={mockOnSubmit} isLoading={false} />);

    expect(
      screen.getByRole("button", { name: "Confirm Booking" })
    ).toBeInTheDocument();
  });

  it("should update form fields on user input", async () => {
    const user = userEvent.setup();
    render(<BookingForm onSubmit={mockOnSubmit} isLoading={false} />);

    const nameInput = screen.getByLabelText("Full Name");
    const emailInput = screen.getByLabelText("Email Address");

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john@example.com");

    expect(nameInput).toHaveValue("John Doe");
    expect(emailInput).toHaveValue("john@example.com");
  });

  it("should not show errors before form submission", async () => {
    const user = userEvent.setup();
    render(<BookingForm onSubmit={mockOnSubmit} isLoading={false} />);

    const nameInput = screen.getByLabelText("Full Name");
    await user.type(nameInput, "Jo");

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("should submit form with valid data", async () => {
    const user = userEvent.setup();
    render(<BookingForm onSubmit={mockOnSubmit} isLoading={false} />);

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);
    const dateString = futureDate.toISOString().split("T")[0];

    await user.type(screen.getByLabelText("Full Name"), "John Doe");
    await user.type(screen.getByLabelText("Email Address"), "john@example.com");
    await user.type(screen.getByLabelText("Date"), dateString ?? "");
    await user.type(screen.getByLabelText("Time"), "14:30");

    await user.click(screen.getByRole("button", { name: "Confirm Booking" }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        clientName: "John Doe",
        clientEmail: "john@example.com",
        date: dateString,
        time: "14:30"
      });
    });
  });

  it("should not submit form with invalid data", async () => {
    const user = userEvent.setup();
    render(<BookingForm onSubmit={mockOnSubmit} isLoading={false} />);

    await user.type(screen.getByLabelText("Full Name"), "Jo");
    await user.click(screen.getByRole("button", { name: "Confirm Booking" }));

    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it("should show all errors on submit with empty form", async () => {
    const user = userEvent.setup();
    render(<BookingForm onSubmit={mockOnSubmit} isLoading={false} />);

    await user.click(screen.getByRole("button", { name: "Confirm Booking" }));

    await waitFor(() => {
      const alerts = screen.getAllByRole("alert");
      expect(alerts.length).toBeGreaterThan(0);
    });
  });

  it("should disable all fields when isLoading is true", () => {
    render(<BookingForm onSubmit={mockOnSubmit} isLoading={true} />);

    expect(screen.getByLabelText("Full Name")).toBeDisabled();
    expect(screen.getByLabelText("Email Address")).toBeDisabled();
    expect(screen.getByLabelText("Date")).toBeDisabled();
    expect(screen.getByLabelText("Time")).toBeDisabled();
  });

  it("should disable submit button when isLoading is true", () => {
    render(<BookingForm onSubmit={mockOnSubmit} isLoading={true} />);

    expect(screen.getByRole("button", { name: /Loading/i })).toBeDisabled();
  });

  it("should have noValidate attribute on form", () => {
    const { container } = render(
      <BookingForm onSubmit={mockOnSubmit} isLoading={false} />
    );

    const form = container.querySelector("form");
    expect(form).toHaveAttribute("noValidate");
  });

  it("should have required attribute on all fields", () => {
    render(<BookingForm onSubmit={mockOnSubmit} isLoading={false} />);

    expect(screen.getByLabelText("Full Name")).toBeRequired();
    expect(screen.getByLabelText("Email Address")).toBeRequired();
    expect(screen.getByLabelText("Date")).toBeRequired();
    expect(screen.getByLabelText("Time")).toBeRequired();
  });

  it("should have correct input types", () => {
    render(<BookingForm onSubmit={mockOnSubmit} isLoading={false} />);

    expect(screen.getByLabelText("Full Name")).toHaveAttribute("type", "text");
    expect(screen.getByLabelText("Email Address")).toHaveAttribute(
      "type",
      "email"
    );
    expect(screen.getByLabelText("Date")).toHaveAttribute("type", "date");
    expect(screen.getByLabelText("Time")).toHaveAttribute("type", "time");
  });

  it("should have placeholders on text fields", () => {
    render(<BookingForm onSubmit={mockOnSubmit} isLoading={false} />);

    expect(screen.getByLabelText("Full Name")).toHaveAttribute(
      "placeholder",
      "John Doe"
    );
    expect(screen.getByLabelText("Email Address")).toHaveAttribute(
      "placeholder",
      "john@example.com"
    );
  });
});
