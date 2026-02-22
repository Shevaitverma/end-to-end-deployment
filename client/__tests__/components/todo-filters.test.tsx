import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoFilters } from "@/components/todo/todo-filters";
import type { TodoFilters as TodoFiltersType } from "@/types/todo";

const defaultFilters: TodoFiltersType = {
  status: "all",
  priority: "all",
  sortBy: "createdAt",
  sortOrder: "desc",
  page: 1,
  limit: 10,
};

const defaultProps = {
  filters: defaultFilters,
  onFilterChange: jest.fn(),
};

describe("TodoFilters", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all four select fields", () => {
    render(<TodoFilters {...defaultProps} />);

    expect(screen.getByLabelText("Status")).toBeInTheDocument();
    expect(screen.getByLabelText("Priority")).toBeInTheDocument();
    expect(screen.getByLabelText("Sort By")).toBeInTheDocument();
    expect(screen.getByLabelText("Order")).toBeInTheDocument();
  });

  it("calls onFilterChange with status and page:1 when status changes", async () => {
    const user = userEvent.setup();
    render(<TodoFilters {...defaultProps} />);

    const statusSelect = screen.getByLabelText("Status");
    await user.selectOptions(statusSelect, "active");

    expect(defaultProps.onFilterChange).toHaveBeenCalledWith({
      status: "active",
      page: 1,
    });
  });

  it("calls onFilterChange with priority and page:1 when priority changes", async () => {
    const user = userEvent.setup();
    render(<TodoFilters {...defaultProps} />);

    const prioritySelect = screen.getByLabelText("Priority");
    await user.selectOptions(prioritySelect, "high");

    expect(defaultProps.onFilterChange).toHaveBeenCalledWith({
      priority: "high",
      page: 1,
    });
  });

  it("calls onFilterChange with sortBy when sort field changes", async () => {
    const user = userEvent.setup();
    render(<TodoFilters {...defaultProps} />);

    const sortBySelect = screen.getByLabelText("Sort By");
    await user.selectOptions(sortBySelect, "priority");

    expect(defaultProps.onFilterChange).toHaveBeenCalledWith({
      sortBy: "priority",
    });
  });

  it("calls onFilterChange with sortOrder when order changes", async () => {
    const user = userEvent.setup();
    render(<TodoFilters {...defaultProps} />);

    const orderSelect = screen.getByLabelText("Order");
    await user.selectOptions(orderSelect, "asc");

    expect(defaultProps.onFilterChange).toHaveBeenCalledWith({
      sortOrder: "asc",
    });
  });

  it("has correct aria attributes on the container", () => {
    render(<TodoFilters {...defaultProps} />);

    const group = screen.getByRole("group", {
      name: "Filter and sort options",
    });
    expect(group).toBeInTheDocument();
  });

  it("reflects current filter values in the selects", () => {
    const customFilters: TodoFiltersType = {
      status: "completed",
      priority: "medium",
      sortBy: "title",
      sortOrder: "asc",
      page: 2,
      limit: 10,
    };

    render(
      <TodoFilters filters={customFilters} onFilterChange={jest.fn()} />
    );

    expect(screen.getByLabelText("Status")).toHaveValue("completed");
    expect(screen.getByLabelText("Priority")).toHaveValue("medium");
    expect(screen.getByLabelText("Sort By")).toHaveValue("title");
    expect(screen.getByLabelText("Order")).toHaveValue("asc");
  });

  it("renders all status options", () => {
    render(<TodoFilters {...defaultProps} />);

    const statusSelect = screen.getByLabelText("Status");
    const options = statusSelect.querySelectorAll("option");

    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent("All");
    expect(options[1]).toHaveTextContent("Active");
    expect(options[2]).toHaveTextContent("Completed");
  });

  it("renders all priority options", () => {
    render(<TodoFilters {...defaultProps} />);

    const prioritySelect = screen.getByLabelText("Priority");
    const options = prioritySelect.querySelectorAll("option");

    expect(options).toHaveLength(4);
    expect(options[0]).toHaveTextContent("All Priorities");
    expect(options[1]).toHaveTextContent("Low");
    expect(options[2]).toHaveTextContent("Medium");
    expect(options[3]).toHaveTextContent("High");
  });

  it("renders all sort by options", () => {
    render(<TodoFilters {...defaultProps} />);

    const sortBySelect = screen.getByLabelText("Sort By");
    const options = sortBySelect.querySelectorAll("option");

    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent("Date Created");
    expect(options[1]).toHaveTextContent("Priority");
    expect(options[2]).toHaveTextContent("Title");
  });

  it("renders all sort order options", () => {
    render(<TodoFilters {...defaultProps} />);

    const orderSelect = screen.getByLabelText("Order");
    const options = orderSelect.querySelectorAll("option");

    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent("Newest first");
    expect(options[1]).toHaveTextContent("Oldest first");
  });
});
