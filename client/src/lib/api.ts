import type {
  ApiResponse,
  Todo,
  CreateTodoInput,
  UpdateTodoInput,
  TodoFilters,
} from "@/types/todo";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const data: ApiResponse<T> = await response.json();

  if (!response.ok || !data.success) {
    throw new ApiError(
      data.message || "An unexpected error occurred",
      response.status
    );
  }

  return data;
}

function buildQueryString(filters: TodoFilters): string {
  const params = new URLSearchParams();

  if (filters.status !== "all") {
    params.set("completed", filters.status === "completed" ? "true" : "false");
  }

  if (filters.priority !== "all") {
    params.set("priority", filters.priority);
  }

  params.set("sortBy", filters.sortBy);
  params.set("order", filters.sortOrder);
  params.set("page", filters.page.toString());
  params.set("limit", filters.limit.toString());

  return params.toString();
}

export const todoApi = {
  getAll: async (filters: TodoFilters): Promise<ApiResponse<Todo[]>> => {
    const queryString = buildQueryString(filters);
    return request<Todo[]>(`/todos?${queryString}`);
  },

  getById: async (id: string): Promise<ApiResponse<Todo>> => {
    return request<Todo>(`/todos/${id}`);
  },

  create: async (input: CreateTodoInput): Promise<ApiResponse<Todo>> => {
    return request<Todo>("/todos", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  update: async (
    id: string,
    input: UpdateTodoInput
  ): Promise<ApiResponse<Todo>> => {
    return request<Todo>(`/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  },

  delete: async (id: string): Promise<ApiResponse<Todo>> => {
    return request<Todo>(`/todos/${id}`, {
      method: "DELETE",
    });
  },
};

export { ApiError };
