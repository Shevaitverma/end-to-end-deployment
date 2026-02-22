import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { Select } from "@/components/ui/select";

const mockOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

describe("Select", () => {
  it("renders all options", () => {
    render(<Select options={mockOptions} />);
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent("Low");
    expect(options[1]).toHaveTextContent("Medium");
    expect(options[2]).toHaveTextContent("High");
  });

  it("renders option values correctly", () => {
    render(<Select options={mockOptions} />);
    const options = screen.getAllByRole("option");
    expect(options[0]).toHaveValue("low");
    expect(options[1]).toHaveValue("medium");
    expect(options[2]).toHaveValue("high");
  });

  it("renders with label", () => {
    render(<Select label="Priority" options={mockOptions} />);
    const label = screen.getByText("Priority");
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe("LABEL");
    expect(screen.getByLabelText("Priority")).toBeInTheDocument();
  });

  it("generates id from label text", () => {
    render(<Select label="Sort Order" options={mockOptions} />);
    const select = screen.getByLabelText("Sort Order");
    expect(select).toHaveAttribute("id", "sort-order");
  });

  it("accepts custom id over generated one", () => {
    render(
      <Select label="Priority" options={mockOptions} id="custom-priority" />
    );
    const select = screen.getByLabelText("Priority");
    expect(select).toHaveAttribute("id", "custom-priority");
  });

  it("renders with error message", () => {
    render(
      <Select
        label="Priority"
        options={mockOptions}
        error="Selection required"
      />
    );
    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent("Selection required");
  });

  it("sets aria-invalid when error is present", () => {
    render(
      <Select label="Priority" options={mockOptions} error="Required" />
    );
    const select = screen.getByLabelText("Priority");
    expect(select).toHaveAttribute("aria-invalid", "true");
  });

  it("sets aria-describedby when error is present", () => {
    render(
      <Select label="Priority" options={mockOptions} error="Required" />
    );
    const select = screen.getByLabelText("Priority");
    expect(select).toHaveAttribute("aria-describedby", "priority-error");
  });

  it("does not set aria attributes when no error", () => {
    render(<Select label="Priority" options={mockOptions} />);
    const select = screen.getByLabelText("Priority");
    expect(select).not.toHaveAttribute("aria-invalid");
    expect(select).not.toHaveAttribute("aria-describedby");
  });

  it("error message id matches aria-describedby", () => {
    render(
      <Select label="Priority" options={mockOptions} error="Required" />
    );
    const select = screen.getByLabelText("Priority");
    const errorEl = screen.getByRole("alert");
    const describedBy = select.getAttribute("aria-describedby");
    expect(errorEl).toHaveAttribute("id", describedBy);
  });

  it("handles onChange events", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(
      <Select
        label="Priority"
        options={mockOptions}
        onChange={handleChange}
      />
    );

    await user.selectOptions(screen.getByLabelText("Priority"), "high");
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLSelectElement>();
    render(<Select ref={ref} options={mockOptions} />);
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });

  it("applies custom className", () => {
    render(
      <Select options={mockOptions} className="my-select-class" />
    );
    const select = screen.getByRole("combobox");
    expect(select).toHaveClass("my-select-class");
  });
});
