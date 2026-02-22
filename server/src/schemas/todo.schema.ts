import { z } from "zod";

export const createTodoSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: "Title is required" })
      .trim()
      .min(1, "Title must be at least 1 character")
      .max(200, "Title must be at most 200 characters"),
    description: z
      .string()
      .trim()
      .max(1000, "Description must be at most 1000 characters")
      .optional(),
    priority: z.enum(["low", "medium", "high"]).optional().default("medium"),
  }),
});

export const updateTodoSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(1, "Title must be at least 1 character")
      .max(200, "Title must be at most 200 characters")
      .optional(),
    description: z
      .string()
      .trim()
      .max(1000, "Description must be at most 1000 characters")
      .optional(),
    completed: z.boolean().optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
  }),
});

export const todoQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
    sortBy: z
      .enum(["createdAt", "updatedAt", "title", "priority"])
      .default("createdAt")
      .optional(),
    order: z.enum(["asc", "desc"]).default("desc").optional(),
    completed: z.enum(["true", "false"]).optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    search: z.string().trim().optional(),
  }),
});

export const todoIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid todo ID"),
  }),
});

export type CreateTodoBody = z.infer<typeof createTodoSchema>["body"];
export type UpdateTodoBody = z.infer<typeof updateTodoSchema>["body"];
export type TodoQuery = z.infer<typeof todoQuerySchema>["query"];
