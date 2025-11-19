import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookingModal } from "../BookingModal";

describe("BookingModal", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.style.overflow = "unset";
  });

  afterEach(() => {
    document.body.style.overflow = "unset";
  });

  it("should not render when isOpen is false", () => {
    render(
      <BookingModal isOpen={false} onClose={mockOnClose} title="Test Modal">
        <div>Content</div>
      </BookingModal>
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should render when isOpen is true", () => {
    render(
      <BookingModal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Content</div>
      </BookingModal>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("should render title", () => {
    render(
      <BookingModal isOpen={true} onClose={mockOnClose} title="Book Service">
        <div>Content</div>
      </BookingModal>
    );

    expect(screen.getByText("Book Service")).toBeInTheDocument();
  });

  it("should render children", () => {
    render(
      <BookingModal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Modal Content</div>
      </BookingModal>
    );

    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  it("should have aria-modal attribute", () => {
    render(
      <BookingModal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Content</div>
      </BookingModal>
    );

    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
  });

  it("should have aria-labelledby pointing to title", () => {
    render(
      <BookingModal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Content</div>
      </BookingModal>
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-labelledby", "modal-title");

    const title = screen.getByText("Test Modal");
    expect(title).toHaveAttribute("id", "modal-title");
  });

  it("should render close button", () => {
    render(
      <BookingModal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Content</div>
      </BookingModal>
    );

    expect(
      screen.getByRole("button", { name: "Close modal" })
    ).toBeInTheDocument();
  });

  it("should call onClose when close button clicked", async () => {
    const user = userEvent.setup();
    render(
      <BookingModal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Content</div>
      </BookingModal>
    );

    await user.click(screen.getByRole("button", { name: "Close modal" }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should call onClose when backdrop clicked", async () => {
    const user = userEvent.setup();
    render(
      <BookingModal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Content</div>
      </BookingModal>
    );

    const backdrop = screen.getByRole("dialog");
    await user.click(backdrop);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should not call onClose when modal content clicked", async () => {
    const user = userEvent.setup();
    render(
      <BookingModal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Content</div>
      </BookingModal>
    );

    await user.click(screen.getByText("Content"));

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("should call onClose when Escape key pressed", async () => {
    const user = userEvent.setup();
    render(
      <BookingModal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Content</div>
      </BookingModal>
    );

    await user.keyboard("{Escape}");

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should set body overflow to hidden when open", () => {
    render(
      <BookingModal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Content</div>
      </BookingModal>
    );

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("should restore body overflow when closed", () => {
    const { rerender } = render(
      <BookingModal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Content</div>
      </BookingModal>
    );

    expect(document.body.style.overflow).toBe("hidden");

    rerender(
      <BookingModal isOpen={false} onClose={mockOnClose} title="Test Modal">
        <div>Content</div>
      </BookingModal>
    );

    expect(document.body.style.overflow).toBe("unset");
  });

  it("should cleanup event listeners on unmount", () => {
    const { unmount } = render(
      <BookingModal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Content</div>
      </BookingModal>
    );

    unmount();

    expect(document.body.style.overflow).toBe("unset");
  });

  it("should render close icon", () => {
    const { container } = render(
      <BookingModal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Content</div>
      </BookingModal>
    );

    const icon = container.querySelector('svg[aria-hidden="true"]');
    expect(icon).toBeInTheDocument();
  });
});

