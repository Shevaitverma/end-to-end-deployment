import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import {
  useTodos,
  useCreateTodo,
  useUpdateTodo,
  useDeleteTodo,
} from "@/hooks/use-todos";
import { todoApi } from "@/lib/api";
import type { Todo, ApiResponse } from "@/types/todo";

// Mock the API module
jest.mock("@/lib/api", () => ({
  todoApi: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockTodo: Todo = {
  id: "1",
  title: "Test Todo",
  description: "Test description",
  completed: false,
  priority: "medium",
  createdAt: "2024-01-15T10:00:00.000Z",
  updatedAt: "2024-01-15T10:00:00.000Z",
};

const mockApiResponse: ApiResponse<Todo[]> = {
  success: true,
  data: [mockTodo],
  message: "Todos retrieved successfully",
  pagination: {
    page: 1,
    limit: 10,
    total: 1,
    totalPages: 1,
  },
};

const defaultFilters = {
  status: "all" as const,
  priority: "all" as const,
  sortBy: "createdAt" as const,
  sortOrder: "desc" as const,
  page: 1,
  limit: 10,
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useTodos", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches todos successfully", async () => {
    (todoApi.getAll as jest.Mock).mockResolvedValue(mockApiResponse);

    const { result } = renderHook(() => useTodos(defaultFilters), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockApiResponse);
    expect(todoApi.getAll).toHaveBeenCalledWith(defaultFilters);
  });

  it("handles fetch error", async () => {
    (todoApi.getAll as jest.Mock).mockRejectedValue(
      new Error("Network error")
    );

    const { result } = renderHook(() => useTodos(defaultFilters), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe("Network error");
  });
});

describe("useCreateTodo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a todo successfully", async () => {
    const newTodo = { ...mockTodo, id: "2", title: "New Todo" };
    const createResponse: ApiResponse<Todo> = {
      success: true,
      data: newTodo,
      message: "Todo created successfully",
    };

    (todoApi.create as jest.Mock).mockResolvedValue(createResponse);

    const { result } = renderHook(() => useCreateTodo(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      title: "New Todo",
      priority: "medium",
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(todoApi.create).toHaveBeenCalledWith({
      title: "New Todo",
      priority: "medium",
    });
  });

  it("handles create error", async () => {
    (todoApi.create as jest.Mock).mockRejectedValue(
      new Error("Create failed")
    );

    const { result } = renderHook(() => useCreateTodo(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      title: "New Todo",
      priority: "medium",
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe("Create failed");
  });
});

describe("useUpdateTodo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("updates a todo successfully", async () => {
    const updatedTodo = { ...mockTodo, title: "Updated Todo" };
    const updateResponse: ApiResponse<Todo> = {
      success: true,
      data: updatedTodo,
      message: "Todo updated successfully",
    };

    (todoApi.update as jest.Mock).mockResolvedValue(updateResponse);

    const { result } = renderHook(() => useUpdateTodo(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      id: "1",
      input: { title: "Updated Todo" },
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(todoApi.update).toHaveBeenCalledWith("1", {
      title: "Updated Todo",
    });
  });
});

describe("useDeleteTodo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deletes a todo successfully", async () => {
    const deleteResponse: ApiResponse<Todo> = {
      success: true,
      data: mockTodo,
      message: "Todo deleted successfully",
    };

    (todoApi.delete as jest.Mock).mockResolvedValue(deleteResponse);

    const { result } = renderHook(() => useDeleteTodo(), {
      wrapper: createWrapper(),
    });

    result.current.mutate("1");

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(todoApi.delete).toHaveBeenCalledWith("1");
  });

  it("handles delete error", async () => {
    (todoApi.delete as jest.Mock).mockRejectedValue(
      new Error("Delete failed")
    );

    const { result } = renderHook(() => useDeleteTodo(), {
      wrapper: createWrapper(),
    });

    result.current.mutate("1");

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe("Delete failed");
  });
});
