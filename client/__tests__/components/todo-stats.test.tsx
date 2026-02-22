import { render, screen, within } from "@testing-library/react";
import { TodoStats } from "@/components/todo/todo-stats";
import type { Todo } from "@/types/todo";

const createTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: "1",
  title: "Test Todo",
  description: "Test description",
  completed: false,
  priority: "medium",
  createdAt: "2024-01-15T10:00:00.000Z",
  updatedAt: "2024-01-15T10:00:00.000Z",
  ...overrides,
});

function getStatValue(container: HTMLElement, label: string): string {
  const labelEl = screen.getByText(label);
  const parent = labelEl.parentElement!;
  return within(parent).getByText(/\d+/).textContent!;
}

describe("TodoStats", () => {
  it("renders total, active, and completed counts correctly", () => {
    const todos: Todo[] = [
      createTodo({ id: "1", completed: false }),
      createTodo({ id: "2", completed: true }),
      createTodo({ id: "3", completed: false }),
      createTodo({ id: "4", completed: true }),
    ];

    const { container } = render(<TodoStats todos={todos} />);

    expect(getStatValue(container, "Total")).toBe("4");
    expect(getStatValue(container, "Active")).toBe("2");
    expect(getStatValue(container, "Done")).toBe("2");
  });

  it("calculates progress percentage correctly", () => {
    const todos: Todo[] = [
      createTodo({ id: "1", completed: true }),
      createTodo({ id: "2", completed: false }),
      createTodo({ id: "3", completed: false }),
      createTodo({ id: "4", completed: true }),
    ];

    render(<TodoStats todos={todos} />);

    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("progress bar has correct aria attributes", () => {
    const todos: Todo[] = [
      createTodo({ id: "1", completed: true }),
      createTodo({ id: "2", completed: true }),
      createTodo({ id: "3", completed: false }),
    ];

    render(<TodoStats todos={todos} />);

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("aria-valuenow", "67");
    expect(progressBar).toHaveAttribute("aria-valuemin", "0");
    expect(progressBar).toHaveAttribute("aria-valuemax", "100");
  });

  it("handles empty todos array with 0% and all zeros", () => {
    const { container } = render(<TodoStats todos={[]} />);

    expect(screen.getByText("0%")).toBeInTheDocument();

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("aria-valuenow", "0");

    expect(getStatValue(container, "Total")).toBe("0");
    expect(getStatValue(container, "Active")).toBe("0");
    expect(getStatValue(container, "Done")).toBe("0");
  });

  it("handles all completed todos with 100%", () => {
    const todos: Todo[] = [
      createTodo({ id: "1", completed: true }),
      createTodo({ id: "2", completed: true }),
      createTodo({ id: "3", completed: true }),
    ];

    const { container } = render(<TodoStats todos={todos} />);

    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(getStatValue(container, "Total")).toBe("3");
    expect(getStatValue(container, "Active")).toBe("0");
    expect(getStatValue(container, "Done")).toBe("3");

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("aria-valuenow", "100");
  });

  it("handles mix of completed and active todos", () => {
    const todos: Todo[] = [
      createTodo({ id: "1", completed: true }),
      createTodo({ id: "2", completed: false }),
      createTodo({ id: "3", completed: false }),
      createTodo({ id: "4", completed: false }),
      createTodo({ id: "5", completed: true }),
    ];

    const { container } = render(<TodoStats todos={todos} />);

    expect(getStatValue(container, "Total")).toBe("5");
    expect(getStatValue(container, "Active")).toBe("3");
    expect(getStatValue(container, "Done")).toBe("2");
    expect(screen.getByText("40%")).toBeInTheDocument();
  });

  it("has correct region aria attributes", () => {
    render(<TodoStats todos={[]} />);

    const region = screen.getByRole("region", { name: "Todo statistics" });
    expect(region).toBeInTheDocument();
  });

  it("progress bar width matches percentage", () => {
    const todos: Todo[] = [
      createTodo({ id: "1", completed: true }),
      createTodo({ id: "2", completed: false }),
      createTodo({ id: "3", completed: false }),
      createTodo({ id: "4", completed: true }),
      createTodo({ id: "5", completed: true }),
    ];

    render(<TodoStats todos={todos} />);

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveStyle({ width: "60%" });
  });
});
