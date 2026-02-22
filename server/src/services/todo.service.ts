import { Todo, type ITodo } from "../models/todo.model.js";
import type {
  CreateTodoInput,
  UpdateTodoInput,
  PaginationMeta,
} from "../types/index.js";
import { AppError } from "../utils/api-response.js";

interface FindAllOptions {
  page: number;
  limit: number;
  sortBy: string;
  order: "asc" | "desc";
  completed?: string;
  priority?: string;
  search?: string;
}

interface FindAllResult {
  todos: ITodo[];
  pagination: PaginationMeta;
}

export class TodoService {
  async findAll(options: FindAllOptions): Promise<FindAllResult> {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
      completed,
      priority,
      search,
    } = options;

    const filter: Record<string, unknown> = {};

    if (completed !== undefined) {
      filter.completed = completed === "true";
    }

    if (priority) {
      filter.priority = priority;
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;
    const sortOption: Record<string, 1 | -1> = {
      [sortBy]: order === "asc" ? 1 : -1,
    };

    const [todos, total] = await Promise.all([
      Todo.find(filter).sort(sortOption).skip(skip).limit(limit).lean(),
      Todo.countDocuments(filter),
    ]);

    // Transform _id to id for lean queries
    const transformed = todos.map((todo) => ({
      ...todo,
      id: todo._id.toString(),
      _id: undefined,
      __v: undefined,
    }));

    return {
      todos: transformed as unknown as ITodo[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<ITodo> {
    const todo = await Todo.findById(id);
    if (!todo) {
      throw new AppError("Todo not found", 404);
    }
    return todo;
  }

  async create(input: CreateTodoInput): Promise<ITodo> {
    const todo = await Todo.create(input);
    return todo;
  }

  async update(id: string, input: UpdateTodoInput): Promise<ITodo> {
    const todo = await Todo.findByIdAndUpdate(id, input, {
      new: true,
      runValidators: true,
    });
    if (!todo) {
      throw new AppError("Todo not found", 404);
    }
    return todo;
  }

  async delete(id: string): Promise<void> {
    const todo = await Todo.findByIdAndDelete(id);
    if (!todo) {
      throw new AppError("Todo not found", 404);
    }
  }
}

export const todoService = new TodoService();
