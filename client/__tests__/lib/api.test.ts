import { todoApi, ApiError } from "@/lib/api";
import type { TodoFilters, Todo, ApiResponse } from "@/types/todo";

const API_BASE = "http://localhost:5000/api";

// Helper to build a mock fetch response
function mockFetchResponse(body: unknown, status = 200, ok = true) {
  return jest.fn().mockResolvedValue({
    ok,
    status,
    json: jest.fn().mockResolvedValue(body),
  });
}

// A sample todo for reuse across tests
const sampleTodo: Todo = {
  id: "1",
  title: "Test todo",
  description: "A test todo item",
  completed: false,
  priority: "medium",
  createdAt: "2024-01-15T10:00:00.000Z",
  updatedAt: "2024-01-15T10:00:00.000Z",
};

beforeEach(() => {
  jest.restoreAllMocks();
});

// ─── ApiError ────────────────────────────────────────────────────────────────

describe("ApiError", () => {
  it("creates an error with the correct message and status", () => {
    const error = new ApiError("Not found", 404);
    expect(error.message).toBe("Not found");
    expect(error.status).toBe(404);
  });

  it('sets name to "ApiError"', () => {
    const error = new ApiError("fail", 500);
    expect(error.name).toBe("ApiError");
  });

  it("is an instance of Error", () => {
    const error = new ApiError("err", 400);
    expect(error).toBeInstanceOf(Error);
  });

  it("is an instance of ApiError", () => {
    const error = new ApiError("err", 400);
    expect(error).toBeInstanceOf(ApiError);
  });
});

// ─── todoApi.getAll ──────────────────────────────────────────────────────────

describe("todoApi.getAll", () => {
  const baseFilters: TodoFilters = {
    status: "all",
    priority: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 10,
  };

  it("calls fetch with the correct URL and returns data", async () => {
    const responseBody: ApiResponse<Todo[]> = {
      success: true,
      data: [sampleTodo],
      message: "OK",
    };
    global.fetch = mockFetchResponse(responseBody);

    const result = await todoApi.getAll(baseFilters);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const calledUrl: string = (global.fetch as jest.Mock).mock.calls[0][0];
    expect(calledUrl).toContain(`${API_BASE}/todos?`);
    expect(result).toEqual(responseBody);
  });

  it("does not include completed param when status is 'all'", async () => {
    global.fetch = mockFetchResponse({ success: true, data: [], message: "" });

    await todoApi.getAll({ ...baseFilters, status: "all" });

    const calledUrl: string = (global.fetch as jest.Mock).mock.calls[0][0];
    expect(calledUrl).not.toMatch(/completed=/);
  });

  it("sets completed=true when status is 'completed'", async () => {
    global.fetch = mockFetchResponse({ success: true, data: [], message: "" });

    await todoApi.getAll({ ...baseFilters, status: "completed" });

    const calledUrl: string = (global.fetch as jest.Mock).mock.calls[0][0];
    expect(calledUrl).toContain("completed=true");
  });

  it("sets completed=false when status is 'active'", async () => {
    global.fetch = mockFetchResponse({ success: true, data: [], message: "" });

    await todoApi.getAll({ ...baseFilters, status: "active" });

    const calledUrl: string = (global.fetch as jest.Mock).mock.calls[0][0];
    expect(calledUrl).toContain("completed=false");
  });

  it("includes priority param when priority is not 'all'", async () => {
    global.fetch = mockFetchResponse({ success: true, data: [], message: "" });

    await todoApi.getAll({ ...baseFilters, priority: "high" });

    const calledUrl: string = (global.fetch as jest.Mock).mock.calls[0][0];
    expect(calledUrl).toContain("priority=high");
  });

  it("does not include priority param when priority is 'all'", async () => {
    global.fetch = mockFetchResponse({ success: true, data: [], message: "" });

    await todoApi.getAll({ ...baseFilters, priority: "all" });

    const calledUrl: string = (global.fetch as jest.Mock).mock.calls[0][0];
    expect(calledUrl).not.toMatch(/priority=/);
  });

  it("includes sortBy, order, page, and limit params", async () => {
    global.fetch = mockFetchResponse({ success: true, data: [], message: "" });

    await todoApi.getAll({
      ...baseFilters,
      sortBy: "title",
      sortOrder: "asc",
      page: 2,
      limit: 25,
    });

    const calledUrl: string = (global.fetch as jest.Mock).mock.calls[0][0];
    expect(calledUrl).toContain("sortBy=title");
    expect(calledUrl).toContain("order=asc");
    expect(calledUrl).toContain("page=2");
    expect(calledUrl).toContain("limit=25");
  });

  it("sends Content-Type application/json header", async () => {
    global.fetch = mockFetchResponse({ success: true, data: [], message: "" });

    await todoApi.getAll(baseFilters);

    const calledOptions = (global.fetch as jest.Mock).mock.calls[0][1];
    expect(calledOptions.headers["Content-Type"]).toBe("application/json");
  });
});

// ─── todoApi.getById ─────────────────────────────────────────────────────────

describe("todoApi.getById", () => {
  it("calls fetch with the correct URL and returns a single todo", async () => {
    const responseBody: ApiResponse<Todo> = {
      success: true,
      data: sampleTodo,
      message: "OK",
    };
    global.fetch = mockFetchResponse(responseBody);

    const result = await todoApi.getById("abc-123");

    const calledUrl: string = (global.fetch as jest.Mock).mock.calls[0][0];
    expect(calledUrl).toBe(`${API_BASE}/todos/abc-123`);
    expect(result).toEqual(responseBody);
  });
});

// ─── todoApi.create ──────────────────────────────────────────────────────────

describe("todoApi.create", () => {
  it("sends a POST request with the correct body", async () => {
    const responseBody: ApiResponse<Todo> = {
      success: true,
      data: sampleTodo,
      message: "Created",
    };
    global.fetch = mockFetchResponse(responseBody);

    const input = { title: "New todo", priority: "high" as const };
    const result = await todoApi.create(input);

    const calledUrl: string = (global.fetch as jest.Mock).mock.calls[0][0];
    const calledOptions = (global.fetch as jest.Mock).mock.calls[0][1];

    expect(calledUrl).toBe(`${API_BASE}/todos`);
    expect(calledOptions.method).toBe("POST");
    expect(calledOptions.body).toBe(JSON.stringify(input));
    expect(result).toEqual(responseBody);
  });

  it("includes optional description in the body", async () => {
    global.fetch = mockFetchResponse({
      success: true,
      data: sampleTodo,
      message: "",
    });

    const input = {
      title: "With desc",
      description: "Some description",
      priority: "low" as const,
    };
    await todoApi.create(input);

    const calledOptions = (global.fetch as jest.Mock).mock.calls[0][1];
    expect(JSON.parse(calledOptions.body)).toEqual(input);
  });
});

// ─── todoApi.update ──────────────────────────────────────────────────────────

describe("todoApi.update", () => {
  it("sends a PATCH request with the correct URL and body", async () => {
    const responseBody: ApiResponse<Todo> = {
      success: true,
      data: { ...sampleTodo, title: "Updated" },
      message: "Updated",
    };
    global.fetch = mockFetchResponse(responseBody);

    const input = { title: "Updated" };
    const result = await todoApi.update("todo-1", input);

    const calledUrl: string = (global.fetch as jest.Mock).mock.calls[0][0];
    const calledOptions = (global.fetch as jest.Mock).mock.calls[0][1];

    expect(calledUrl).toBe(`${API_BASE}/todos/todo-1`);
    expect(calledOptions.method).toBe("PATCH");
    expect(calledOptions.body).toBe(JSON.stringify(input));
    expect(result).toEqual(responseBody);
  });

  it("can update the completed field", async () => {
    global.fetch = mockFetchResponse({
      success: true,
      data: { ...sampleTodo, completed: true },
      message: "",
    });

    await todoApi.update("todo-1", { completed: true });

    const calledOptions = (global.fetch as jest.Mock).mock.calls[0][1];
    expect(JSON.parse(calledOptions.body)).toEqual({ completed: true });
  });
});

// ─── todoApi.delete ──────────────────────────────────────────────────────────

describe("todoApi.delete", () => {
  it("sends a DELETE request to the correct URL", async () => {
    const responseBody: ApiResponse<Todo> = {
      success: true,
      data: sampleTodo,
      message: "Deleted",
    };
    global.fetch = mockFetchResponse(responseBody);

    const result = await todoApi.delete("todo-42");

    const calledUrl: string = (global.fetch as jest.Mock).mock.calls[0][0];
    const calledOptions = (global.fetch as jest.Mock).mock.calls[0][1];

    expect(calledUrl).toBe(`${API_BASE}/todos/todo-42`);
    expect(calledOptions.method).toBe("DELETE");
    expect(result).toEqual(responseBody);
  });
});

// ─── Error handling ──────────────────────────────────────────────────────────

describe("Error handling", () => {
  it("throws ApiError when response is not ok", async () => {
    global.fetch = mockFetchResponse(
      { success: false, data: null, message: "Not found" },
      404,
      false
    );

    await expect(todoApi.getById("bad-id")).rejects.toThrow(ApiError);
    await expect(todoApi.getById("bad-id")).rejects.toMatchObject({
      message: "Not found",
      status: 404,
    });
  });

  it("throws ApiError when success is false even if response.ok is true", async () => {
    global.fetch = mockFetchResponse(
      { success: false, data: null, message: "Validation error" },
      200,
      true
    );

    await expect(todoApi.getById("some-id")).rejects.toThrow(ApiError);
    await expect(todoApi.getById("some-id")).rejects.toMatchObject({
      message: "Validation error",
      status: 200,
    });
  });

  it("uses fallback message when response message is empty", async () => {
    global.fetch = mockFetchResponse(
      { success: false, data: null, message: "" },
      500,
      false
    );

    await expect(todoApi.getById("id")).rejects.toMatchObject({
      message: "An unexpected error occurred",
      status: 500,
    });
  });

  it("throws ApiError with correct status for 401 responses", async () => {
    global.fetch = mockFetchResponse(
      { success: false, data: null, message: "Unauthorized" },
      401,
      false
    );

    await expect(todoApi.getAll({
      status: "all",
      priority: "all",
      sortBy: "createdAt",
      sortOrder: "desc",
      page: 1,
      limit: 10,
    })).rejects.toMatchObject({
      status: 401,
    });
  });
});
