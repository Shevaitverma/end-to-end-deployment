import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { Input } from "@/components/ui/input";

describe("Input", () => {
  it("renders without label", () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe("INPUT");
  });

  it("renders with label", () => {
    render(<Input label="Email" />);
    const label = screen.getByText("Email");
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe("LABEL");
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("generates id from label text", () => {
    render(<Input label="First Name" />);
    const input = screen.getByLabelText("First Name");
    expect(input).toHaveAttribute("id", "first-name");
  });

  it("generates id from multi-word label with extra spaces", () => {
    render(<Input label="My  Custom  Label" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("id", "my-custom-label");
  });

  it("accepts custom id over generated one", () => {
    render(<Input label="Email" id="custom-email-id" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("id", "custom-email-id");
  });

  it("renders with error message", () => {
    render(<Input label="Email" error="Email is required" />);
    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent("Email is required");
  });

  it("sets aria-invalid when error is present", () => {
    render(<Input label="Email" error="Invalid email" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("sets aria-describedby when error is present", () => {
    render(<Input label="Email" error="Invalid email" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-describedby", "email-error");
  });

  it("does not set aria-invalid when no error", () => {
    render(<Input label="Email" />);
    const input = screen.getByLabelText("Email");
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("does not set aria-describedby when no error", () => {
    render(<Input label="Email" />);
    const input = screen.getByLabelText("Email");
    expect(input).not.toHaveAttribute("aria-describedby");
  });

  it("error message id matches aria-describedby", () => {
    render(<Input label="User Name" error="Required" />);
    const input = screen.getByLabelText("User Name");
    const errorEl = screen.getByRole("alert");
    const describedBy = input.getAttribute("aria-describedby");
    expect(errorEl).toHaveAttribute("id", describedBy);
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} placeholder="ref test" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("applies custom className", () => {
    render(<Input className="extra-class" placeholder="test" />);
    const input = screen.getByPlaceholderText("test");
    expect(input).toHaveClass("extra-class");
  });

  it("handles user typing", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<Input placeholder="Type here" onChange={handleChange} />);

    await user.type(screen.getByPlaceholderText("Type here"), "hello");
    expect(handleChange).toHaveBeenCalledTimes(5);
  });
});
