import { describe, it, expect, beforeEach, mock, spyOn } from "bun:test";
import { TodoService } from "../../src/services/todo.service.js";
import { Todo } from "../../src/models/todo.model.js";
import { AppError } from "../../src/utils/api-response.js";

describe("TodoService", () => {
  let service: TodoService;

  beforeEach(() => {
    service = new TodoService();
  });

  describe("findAll", () => {
    it("should return todos with pagination", async () => {
      const mockTodos = [
        {
          _id: "507f1f77bcf86cd799439011",
          title: "Test Todo",
          completed: false,
          priority: "medium",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const findMock = {
        sort: mock(() => findMock),
        skip: mock(() => findMock),
        limit: mock(() => findMock),
        lean: mock(() => Promise.resolve(mockTodos)),
      };

      spyOn(Todo, "find").mockReturnValue(findMock as any);
      spyOn(Todo, "countDocuments").mockResolvedValue(1 as never);

      const result = await service.findAll({
        page: 1,
        limit: 10,
        sortBy: "createdAt",
        order: "desc",
      });

      expect(result.pagination.total).toBe(1);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.totalPages).toBe(1);
      expect(result.todos).toHaveLength(1);
    });

    it("should apply completed filter", async () => {
      const findMock = {
        sort: mock(() => findMock),
        skip: mock(() => findMock),
        limit: mock(() => findMock),
        lean: mock(() => Promise.resolve([])),
      };

      const findSpy = spyOn(Todo, "find").mockReturnValue(findMock as any);
      spyOn(Todo, "countDocuments").mockResolvedValue(0 as never);

      await service.findAll({
        page: 1,
        limit: 10,
        sortBy: "createdAt",
        order: "desc",
        completed: "true",
      });

      expect(findSpy).toHaveBeenCalledWith(
        expect.objectContaining({ completed: true })
      );
    });

    it("should apply priority filter", async () => {
      const findMock = {
        sort: mock(() => findMock),
        skip: mock(() => findMock),
        limit: mock(() => findMock),
        lean: mock(() => Promise.resolve([])),
      };

      const findSpy = spyOn(Todo, "find").mockReturnValue(findMock as any);
      spyOn(Todo, "countDocuments").mockResolvedValue(0 as never);

      await service.findAll({
        page: 1,
        limit: 10,
        sortBy: "createdAt",
        order: "desc",
        priority: "high",
      });

      expect(findSpy).toHaveBeenCalledWith(
        expect.objectContaining({ priority: "high" })
      );
    });

    it("should apply search filter", async () => {
      const findMock = {
        sort: mock(() => findMock),
        skip: mock(() => findMock),
        limit: mock(() => findMock),
        lean: mock(() => Promise.resolve([])),
      };

      const findSpy = spyOn(Todo, "find").mockReturnValue(findMock as any);
      spyOn(Todo, "countDocuments").mockResolvedValue(0 as never);

      await service.findAll({
        page: 1,
        limit: 10,
        sortBy: "createdAt",
        order: "desc",
        search: "test",
      });

      expect(findSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          title: { $regex: "test", $options: "i" },
        })
      );
    });
  });

  describe("findById", () => {
    it("should return a todo by id", async () => {
      const mockTodo = {
        _id: "507f1f77bcf86cd799439011",
        title: "Test Todo",
        completed: false,
        priority: "medium",
      };

      spyOn(Todo, "findById").mockResolvedValue(mockTodo as any);

      const result = await service.findById("507f1f77bcf86cd799439011");
      expect(result).toEqual(mockTodo as any);
    });

    it("should throw AppError if todo not found", async () => {
      spyOn(Todo, "findById").mockResolvedValue(null as any);

      try {
        await service.findById("507f1f77bcf86cd799439011");
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(404);
        expect((error as AppError).message).toBe("Todo not found");
      }
    });
  });

  describe("create", () => {
    it("should create a new todo", async () => {
      const input = { title: "New Todo", priority: "high" as const };
      const mockCreated = {
        ...input,
        _id: "507f1f77bcf86cd799439011",
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      spyOn(Todo, "create").mockResolvedValue(mockCreated as any);

      const result = await service.create(input);
      expect(result.title).toBe("New Todo");
    });
  });

  describe("update", () => {
    it("should update an existing todo", async () => {
      const mockUpdated = {
        _id: "507f1f77bcf86cd799439011",
        title: "Updated Todo",
        completed: true,
        priority: "high",
      };

      spyOn(Todo, "findByIdAndUpdate").mockResolvedValue(mockUpdated as any);

      const result = await service.update("507f1f77bcf86cd799439011", {
        title: "Updated Todo",
        completed: true,
      });
      expect(result.title).toBe("Updated Todo");
    });

    it("should throw AppError if todo not found", async () => {
      spyOn(Todo, "findByIdAndUpdate").mockResolvedValue(null as any);

      try {
        await service.update("507f1f77bcf86cd799439011", { title: "Test" });
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(404);
      }
    });
  });

  describe("delete", () => {
    it("should delete a todo", async () => {
      spyOn(Todo, "findByIdAndDelete").mockResolvedValue({
        _id: "507f1f77bcf86cd799439011",
      } as any);

      await service.delete("507f1f77bcf86cd799439011");
      // No error means success
    });

    it("should throw AppError if todo not found", async () => {
      spyOn(Todo, "findByIdAndDelete").mockResolvedValue(null as any);

      try {
        await service.delete("507f1f77bcf86cd799439011");
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(404);
      }
    });
  });
});
