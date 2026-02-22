import { describe, it, expect, mock, beforeEach, spyOn } from "bun:test";
import { todoService } from "../../src/services/todo.service.js";
import { TodoController } from "../../src/controllers/todo.controller.js";

function createMockResponse() {
  const res: any = {};
  res.status = mock(() => res);
  res.json = mock(() => res);
  return res;
}

function createMockRequest(overrides: Record<string, any> = {}): any {
  return {
    query: {},
    params: {},
    body: {},
    ...overrides,
  };
}

describe("TodoController", () => {
  let controller: TodoController;

  beforeEach(() => {
    controller = new TodoController();
  });

  describe("getAll", () => {
    it("should call todoService.findAll with correct params and send success response", async () => {
      const mockResult = {
        todos: [
          {
            id: "507f1f77bcf86cd799439011",
            title: "Test Todo",
            completed: false,
            priority: "medium",
          },
        ],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      };

      const findAllSpy = spyOn(todoService, "findAll").mockResolvedValue(
        mockResult as any
      );

      const req = createMockRequest({
        query: { page: 2, limit: 5, sortBy: "title", order: "asc" },
      });
      const res = createMockResponse();
      const next = mock(() => {});

      await controller.getAll(req, res, next);

      expect(findAllSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 2,
          limit: 5,
          sortBy: "title",
          order: "asc",
        })
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockResult.todos,
          message: "Todos retrieved successfully",
          pagination: mockResult.pagination,
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("should use default query params when none provided", async () => {
      const mockResult = {
        todos: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      };

      const findAllSpy = spyOn(todoService, "findAll").mockResolvedValue(
        mockResult as any
      );

      const req = createMockRequest();
      const res = createMockResponse();
      const next = mock(() => {});

      await controller.getAll(req, res, next);

      expect(findAllSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          limit: 10,
          sortBy: "createdAt",
          order: "desc",
        })
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should call next with error when todoService.findAll throws", async () => {
      const error = new Error("Database error");
      spyOn(todoService, "findAll").mockRejectedValue(error);

      const req = createMockRequest();
      const res = createMockResponse();
      const next = mock(() => {});

      await controller.getAll(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("getById", () => {
    it("should call todoService.findById and send success response", async () => {
      const mockTodo = {
        id: "507f1f77bcf86cd799439011",
        title: "Test Todo",
        completed: false,
        priority: "medium",
      };

      const findByIdSpy = spyOn(todoService, "findById").mockResolvedValue(
        mockTodo as any
      );

      const req = createMockRequest({
        params: { id: "507f1f77bcf86cd799439011" },
      });
      const res = createMockResponse();
      const next = mock(() => {});

      await controller.getById(req, res, next);

      expect(findByIdSpy).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockTodo,
          message: "Todo retrieved successfully",
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next with error when todoService.findById throws", async () => {
      const error = new Error("Todo not found");
      spyOn(todoService, "findById").mockRejectedValue(error);

      const req = createMockRequest({
        params: { id: "507f1f77bcf86cd799439011" },
      });
      const res = createMockResponse();
      const next = mock(() => {});

      await controller.getById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("create", () => {
    it("should call todoService.create with body and send 201 response", async () => {
      const body = { title: "New Todo", priority: "high" };
      const mockTodo = {
        id: "507f1f77bcf86cd799439011",
        title: "New Todo",
        completed: false,
        priority: "high",
      };

      const createSpy = spyOn(todoService, "create").mockResolvedValue(
        mockTodo as any
      );

      const req = createMockRequest({ body });
      const res = createMockResponse();
      const next = mock(() => {});

      await controller.create(req, res, next);

      expect(createSpy).toHaveBeenCalledWith(body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockTodo,
          message: "Todo created successfully",
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next with error when todoService.create throws", async () => {
      const error = new Error("Validation error");
      spyOn(todoService, "create").mockRejectedValue(error);

      const req = createMockRequest({
        body: { title: "New Todo" },
      });
      const res = createMockResponse();
      const next = mock(() => {});

      await controller.create(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("should call todoService.update with id and body and send success response", async () => {
      const body = { title: "Updated Todo", completed: true };
      const mockTodo = {
        id: "507f1f77bcf86cd799439011",
        title: "Updated Todo",
        completed: true,
        priority: "medium",
      };

      const updateSpy = spyOn(todoService, "update").mockResolvedValue(
        mockTodo as any
      );

      const req = createMockRequest({
        params: { id: "507f1f77bcf86cd799439011" },
        body,
      });
      const res = createMockResponse();
      const next = mock(() => {});

      await controller.update(req, res, next);

      expect(updateSpy).toHaveBeenCalledWith(
        "507f1f77bcf86cd799439011",
        body
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: mockTodo,
          message: "Todo updated successfully",
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next with error when todoService.update throws", async () => {
      const error = new Error("Todo not found");
      spyOn(todoService, "update").mockRejectedValue(error);

      const req = createMockRequest({
        params: { id: "507f1f77bcf86cd799439011" },
        body: { title: "Updated" },
      });
      const res = createMockResponse();
      const next = mock(() => {});

      await controller.update(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should call todoService.delete with id and send success response", async () => {
      const deleteSpy = spyOn(todoService, "delete").mockResolvedValue(
        undefined as any
      );

      const req = createMockRequest({
        params: { id: "507f1f77bcf86cd799439011" },
      });
      const res = createMockResponse();
      const next = mock(() => {});

      await controller.delete(req, res, next);

      expect(deleteSpy).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: null,
          message: "Todo deleted successfully",
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next with error when todoService.delete throws", async () => {
      const error = new Error("Todo not found");
      spyOn(todoService, "delete").mockRejectedValue(error);

      const req = createMockRequest({
        params: { id: "507f1f77bcf86cd799439011" },
      });
      const res = createMockResponse();
      const next = mock(() => {});

      await controller.delete(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
