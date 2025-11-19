import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "../Input";

describe("Input", () => {
  it("should render with label", () => {
    render(<Input label="Email" />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("should generate id from label when id not provided", () => {
    render(<Input label="Email Address" />);

    const input = screen.getByLabelText("Email Address");
    expect(input).toHaveAttribute("id", "input-email-address");
  });

  it("should use provided id", () => {
    render(<Input label="Email" id="custom-id" />);

    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("id", "custom-id");
  });

  it("should display error message", () => {
    render(<Input label="Email" error="Invalid email" />);

    expect(screen.getByRole("alert")).toHaveTextContent("Invalid email");
  });

  it("should not display error when error is empty string", () => {
    render(<Input label="Email" error="" />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("should apply error styles when error exists", () => {
    render(<Input label="Email" error="Invalid email" />);

    const input = screen.getByLabelText("Email");
    expect(input).toHaveClass("border-red-300");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("should apply normal styles when no error", () => {
    render(<Input label="Email" />);

    const input = screen.getByLabelText("Email");
    expect(input).toHaveClass("border-gray-300");
    expect(input).toHaveAttribute("aria-invalid", "false");
  });

  it("should link error message with aria-describedby", () => {
    render(<Input label="Email" id="email-input" error="Invalid email" />);

    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-describedby", "email-input-error");

    const errorMessage = screen.getByRole("alert");
    expect(errorMessage).toHaveAttribute("id", "email-input-error");
  });

  it("should handle user input", async () => {
    const user = userEvent.setup();
    render(<Input label="Name" />);

    const input = screen.getByLabelText("Name");
    await user.type(input, "John Doe");

    expect(input).toHaveValue("John Doe");
  });

  it("should pass through HTML input attributes", () => {
    render(
      <Input
        label="Email"
        type="email"
        placeholder="Enter email"
        required
        maxLength={50}
      />
    );

    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("placeholder", "Enter email");
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("maxLength", "50");
  });

  it("should apply custom className", () => {
    render(<Input label="Email" className="custom-class" />);

    const input = screen.getByLabelText("Email");
    expect(input).toHaveClass("custom-class");
  });

  it("should handle onChange event", async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();

    render(<Input label="Name" onChange={handleChange} />);

    const input = screen.getByLabelText("Name");
    await user.type(input, "A");

    expect(handleChange).toHaveBeenCalled();
  });
});

