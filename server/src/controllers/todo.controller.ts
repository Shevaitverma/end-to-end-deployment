import type { Request, Response, NextFunction } from "express";
import { todoService } from "../services/todo.service.js";
import { sendSuccess } from "../utils/api-response.js";
import type { CreateTodoBody, UpdateTodoBody, TodoQuery } from "../schemas/todo.schema.js";

export class TodoController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        order = "desc",
        completed,
        priority,
        search,
      } = req.query as unknown as TodoQuery & { page: number; limit: number; sortBy: string; order: "asc" | "desc" };

      const result = await todoService.findAll({
        page: Number(page),
        limit: Number(limit),
        sortBy: sortBy as string,
        order: order as "asc" | "desc",
        completed: completed as string | undefined,
        priority: priority as string | undefined,
        search: search as string | undefined,
      });

      sendSuccess(res, result.todos, "Todos retrieved successfully", 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const todo = await todoService.findById(req.params.id as string);
      sendSuccess(res, todo, "Todo retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body as CreateTodoBody;
      const todo = await todoService.create(body);
      sendSuccess(res, todo, "Todo created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body as UpdateTodoBody;
      const todo = await todoService.update(req.params.id as string, body);
      sendSuccess(res, todo, "Todo updated successfully");
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await todoService.delete(req.params.id as string);
      sendSuccess(res, null, "Todo deleted successfully", 200);
    } catch (error) {
      next(error);
    }
  }
}

export const todoController = new TodoController();
