import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoForm } from "@/components/todo/todo-form";

const defaultProps = {
  onSubmit: jest.fn(),
  onCancel: jest.fn(),
  isLoading: false,
};

describe("TodoForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Create mode", () => {
    it("renders form with create heading", () => {
      render(<TodoForm {...defaultProps} mode="create" />);
      expect(screen.getByText("Add New Todo")).toBeInTheDocument();
    });

    it("renders title input", () => {
      render(<TodoForm {...defaultProps} mode="create" />);
      expect(
        screen.getByPlaceholderText("What needs to be done?")
      ).toBeInTheDocument();
    });

    it("renders description input", () => {
      render(<TodoForm {...defaultProps} mode="create" />);
      expect(
        screen.getByPlaceholderText("Add a description (optional)")
      ).toBeInTheDocument();
    });

    it("renders priority select", () => {
      render(<TodoForm {...defaultProps} mode="create" />);
      expect(screen.getByLabelText("Priority")).toBeInTheDocument();
    });

    it("renders submit button with create label", () => {
      render(<TodoForm {...defaultProps} mode="create" />);
      expect(
        screen.getByRole("button", { name: "Add Todo" })
      ).toBeInTheDocument();
    });

    it("shows error when title is empty", async () => {
      const user = userEvent.setup();
      render(<TodoForm {...defaultProps} mode="create" />);

      const submitButton = screen.getByRole("button", { name: "Add Todo" });
      await user.click(submitButton);

      expect(screen.getByText("Title is required")).toBeInTheDocument();
      expect(defaultProps.onSubmit).not.toHaveBeenCalled();
    });

    it("calls onSubmit with form data", async () => {
      const user = userEvent.setup();
      render(<TodoForm {...defaultProps} mode="create" />);

      await user.type(
        screen.getByPlaceholderText("What needs to be done?"),
        "New todo"
      );
      await user.type(
        screen.getByPlaceholderText("Add a description (optional)"),
        "Description"
      );

      const prioritySelect = screen.getByLabelText("Priority");
      await user.selectOptions(prioritySelect, "high");

      const submitButton = screen.getByRole("button", { name: "Add Todo" });
      await user.click(submitButton);

      expect(defaultProps.onSubmit).toHaveBeenCalledWith({
        title: "New todo",
        description: "Description",
        priority: "high",
      });
    });

    it("resets form after successful submit", async () => {
      const user = userEvent.setup();
      render(<TodoForm {...defaultProps} mode="create" />);

      const titleInput = screen.getByPlaceholderText("What needs to be done?");
      await user.type(titleInput, "New todo");

      const submitButton = screen.getByRole("button", { name: "Add Todo" });
      await user.click(submitButton);

      expect(titleInput).toHaveValue("");
    });

    it("shows loading state", () => {
      render(<TodoForm {...defaultProps} mode="create" isLoading={true} />);
      expect(
        screen.getByRole("button", { name: "Adding..." })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Adding..." })
      ).toBeDisabled();
    });
  });

  describe("Edit mode", () => {
    const editTodo = {
      id: "1",
      title: "Existing todo",
      description: "Existing description",
      completed: false,
      priority: "high" as const,
      createdAt: "2024-01-15T10:00:00.000Z",
      updatedAt: "2024-01-15T10:00:00.000Z",
    };

    it("renders form with edit heading", () => {
      render(
        <TodoForm {...defaultProps} mode="edit" initialData={editTodo} />
      );
      expect(screen.getByText("Edit Todo")).toBeInTheDocument();
    });

    it("pre-fills form with existing data", () => {
      render(
        <TodoForm {...defaultProps} mode="edit" initialData={editTodo} />
      );
      expect(
        screen.getByDisplayValue("Existing todo")
      ).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("Existing description")
      ).toBeInTheDocument();
    });

    it("renders submit button with save label", () => {
      render(
        <TodoForm {...defaultProps} mode="edit" initialData={editTodo} />
      );
      expect(
        screen.getByRole("button", { name: "Save Changes" })
      ).toBeInTheDocument();
    });

    it("shows saving state when loading", () => {
      render(
        <TodoForm
          {...defaultProps}
          mode="edit"
          initialData={editTodo}
          isLoading={true}
        />
      );
      expect(
        screen.getByRole("button", { name: "Saving..." })
      ).toBeInTheDocument();
    });
  });

  it("renders cancel button when onCancel is provided", () => {
    render(<TodoForm {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: "Cancel" })
    ).toBeInTheDocument();
  });

  it("calls onCancel when cancel button is clicked", async () => {
    const user = userEvent.setup();
    render(<TodoForm {...defaultProps} />);

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    await user.click(cancelButton);

    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it("has accessible form label", () => {
    render(<TodoForm {...defaultProps} mode="create" />);
    expect(screen.getByLabelText("Add new todo")).toBeInTheDocument();
  });
});
