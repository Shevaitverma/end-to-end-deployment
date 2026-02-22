import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoItem } from "@/components/todo/todo-item";
import type { Todo } from "@/types/todo";

const mockTodo: Todo = {
  id: "1",
  title: "Test Todo",
  description: "Test description",
  completed: false,
  priority: "medium",
  createdAt: "2024-01-15T10:00:00.000Z",
  updatedAt: "2024-01-15T10:00:00.000Z",
};

const mockCompletedTodo: Todo = {
  ...mockTodo,
  id: "2",
  completed: true,
};

const defaultProps = {
  todo: mockTodo,
  onToggle: jest.fn(),
  onUpdate: jest.fn(),
  onDelete: jest.fn(),
  isUpdating: false,
  isDeleting: false,
};

describe("TodoItem", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders todo title and description", () => {
    render(<TodoItem {...defaultProps} />);
    expect(screen.getByText("Test Todo")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("renders priority badge", () => {
    render(<TodoItem {...defaultProps} />);
    expect(screen.getByText("medium")).toBeInTheDocument();
  });

  it("renders checkbox unchecked for incomplete todo", () => {
    render(<TodoItem {...defaultProps} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  it("renders checkbox checked for completed todo", () => {
    render(<TodoItem {...defaultProps} todo={mockCompletedTodo} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("calls onToggle when checkbox is clicked", async () => {
    const user = userEvent.setup();
    render(<TodoItem {...defaultProps} />);

    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);

    expect(defaultProps.onToggle).toHaveBeenCalledWith("1", true);
  });

  it("applies line-through style when completed", () => {
    render(<TodoItem {...defaultProps} todo={mockCompletedTodo} />);
    const title = screen.getByText("Test Todo");
    expect(title).toHaveClass("line-through");
  });

  it("shows delete confirmation when delete button is clicked", async () => {
    const user = userEvent.setup();
    render(<TodoItem {...defaultProps} />);

    const deleteButton = screen.getByLabelText('Delete "Test Todo"');
    await user.click(deleteButton);

    expect(screen.getByText("Confirm")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("calls onDelete when confirm delete is clicked", async () => {
    const user = userEvent.setup();
    render(<TodoItem {...defaultProps} />);

    const deleteButton = screen.getByLabelText('Delete "Test Todo"');
    await user.click(deleteButton);

    const confirmButton = screen.getByText("Confirm");
    await user.click(confirmButton);

    expect(defaultProps.onDelete).toHaveBeenCalledWith("1");
  });

  it("hides delete confirmation when cancel is clicked", async () => {
    const user = userEvent.setup();
    render(<TodoItem {...defaultProps} />);

    const deleteButton = screen.getByLabelText('Delete "Test Todo"');
    await user.click(deleteButton);

    const cancelButton = screen.getByText("Cancel");
    await user.click(cancelButton);

    expect(screen.queryByText("Confirm")).not.toBeInTheDocument();
  });

  it("shows edit form when edit button is clicked", async () => {
    const user = userEvent.setup();
    render(<TodoItem {...defaultProps} />);

    const editButton = screen.getByLabelText('Edit "Test Todo"');
    await user.click(editButton);

    expect(screen.getByLabelText("Edit todo")).toBeInTheDocument();
  });

  it("applies reduced opacity when isUpdating is true", () => {
    const { container } = render(
      <TodoItem {...defaultProps} isUpdating={true} />
    );
    const article = container.querySelector('[role="article"]');
    expect(article).toHaveClass("opacity-50");
  });

  it("applies reduced opacity when isDeleting is true", () => {
    const { container } = render(
      <TodoItem {...defaultProps} isDeleting={true} />
    );
    const article = container.querySelector('[role="article"]');
    expect(article).toHaveClass("opacity-50");
  });

  it("renders formatted date", () => {
    render(<TodoItem {...defaultProps} />);
    // The date should be formatted - just check it renders something
    expect(screen.getByText(/Created/)).toBeInTheDocument();
  });

  it("does not show description when not provided", () => {
    const todoNoDesc = { ...mockTodo, description: undefined };
    render(<TodoItem {...defaultProps} todo={todoNoDesc} />);
    expect(screen.queryByText("Test description")).not.toBeInTheDocument();
  });
});
