import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

describe("Badge", () => {
  it("renders with default variant", () => {
    render(<Badge>Status</Badge>);
    const badge = screen.getByText("Status");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-slate-100");
  });

  it("renders with low priority", () => {
    render(<Badge priority="low" />);
    expect(screen.getByText("low")).toBeInTheDocument();
    const badge = screen.getByText("low");
    expect(badge).toHaveClass("bg-emerald-50");
  });

  it("renders with medium priority", () => {
    render(<Badge priority="medium" />);
    expect(screen.getByText("medium")).toBeInTheDocument();
    const badge = screen.getByText("medium");
    expect(badge).toHaveClass("bg-amber-50");
  });

  it("renders with high priority", () => {
    render(<Badge priority="high" />);
    expect(screen.getByText("high")).toBeInTheDocument();
    const badge = screen.getByText("high");
    expect(badge).toHaveClass("bg-rose-50");
  });

  it("renders with explicit variant", () => {
    render(<Badge variant="high">Critical</Badge>);
    const badge = screen.getByText("Critical");
    expect(badge).toHaveClass("bg-rose-50");
  });

  it("applies custom className", () => {
    render(<Badge className="custom-class">Tag</Badge>);
    const badge = screen.getByText("Tag");
    expect(badge).toHaveClass("custom-class");
  });

  it("displays children text over priority text", () => {
    render(<Badge priority="high">Urgent</Badge>);
    expect(screen.getByText("Urgent")).toBeInTheDocument();
    expect(screen.queryByText("high")).not.toBeInTheDocument();
  });

  it("displays priority text when no children provided", () => {
    render(<Badge priority="low" />);
    expect(screen.getByText("low")).toBeInTheDocument();
  });

  it("priority prop overrides variant for styling", () => {
    render(<Badge variant="low" priority="high" />);
    const badge = screen.getByText("high");
    expect(badge).toHaveClass("bg-rose-50");
    expect(badge).not.toHaveClass("bg-emerald-50");
  });

  it("renders dot indicator", () => {
    const { container } = render(<Badge priority="medium" />);
    const dot = container.querySelector(".bg-amber-500");
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveClass("h-1.5", "w-1.5", "rounded-full");
  });
});
