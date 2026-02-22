import { describe, it, expect } from "bun:test";
import {
  createTodoSchema,
  updateTodoSchema,
  todoQuerySchema,
  todoIdSchema,
} from "../../src/schemas/todo.schema.js";

describe("Todo Schemas", () => {
  describe("createTodoSchema", () => {
    it("should accept valid input with all fields", () => {
      const input = {
        body: {
          title: "Buy groceries",
          description: "Milk, eggs, bread",
          priority: "high",
        },
      };

      const result = createTodoSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.body.title).toBe("Buy groceries");
        expect(result.data.body.description).toBe("Milk, eggs, bread");
        expect(result.data.body.priority).toBe("high");
      }
    });

    it("should accept valid input with only required title", () => {
      const input = {
        body: {
          title: "Simple task",
        },
      };

      const result = createTodoSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.body.title).toBe("Simple task");
        expect(result.data.body.priority).toBe("medium"); // default
      }
    });

    it("should reject when title is missing", () => {
      const input = {
        body: {
          description: "No title provided",
        },
      };

      const result = createTodoSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should reject when title is empty string", () => {
      const input = {
        body: {
          title: "",
        },
      };

      const result = createTodoSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should reject when title exceeds 200 characters", () => {
      const input = {
        body: {
          title: "a".repeat(201),
        },
      };

      const result = createTodoSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should accept title at exactly 200 characters", () => {
      const input = {
        body: {
          title: "a".repeat(200),
        },
      };

      const result = createTodoSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it("should reject invalid priority value", () => {
      const input = {
        body: {
          title: "Test",
          priority: "urgent",
        },
      };

      const result = createTodoSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should accept all valid priority values", () => {
      for (const priority of ["low", "medium", "high"]) {
        const input = {
          body: {
            title: "Test",
            priority,
          },
        };

        const result = createTodoSchema.safeParse(input);
        expect(result.success).toBe(true);
      }
    });

    it("should reject description exceeding 1000 characters", () => {
      const input = {
        body: {
          title: "Test",
          description: "a".repeat(1001),
        },
      };

      const result = createTodoSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should trim whitespace from title", () => {
      const input = {
        body: {
          title: "  Hello World  ",
        },
      };

      const result = createTodoSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.body.title).toBe("Hello World");
      }
    });
  });

  describe("updateTodoSchema", () => {
    it("should accept all fields as optional (empty body)", () => {
      const input = {
        body: {},
      };

      const result = updateTodoSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it("should accept valid partial update with title only", () => {
      const input = {
        body: {
          title: "Updated title",
        },
      };

      const result = updateTodoSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.body.title).toBe("Updated title");
      }
    });

    it("should accept valid partial update with completed only", () => {
      const input = {
        body: {
          completed: true,
        },
      };

      const result = updateTodoSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.body.completed).toBe(true);
      }
    });

    it("should accept all fields together", () => {
      const input = {
        body: {
          title: "Updated",
          description: "New desc",
          completed: true,
          priority: "high",
        },
      };

      const result = updateTodoSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.body.title).toBe("Updated");
        expect(result.data.body.description).toBe("New desc");
        expect(result.data.body.completed).toBe(true);
        expect(result.data.body.priority).toBe("high");
      }
    });

    it("should reject invalid priority", () => {
      const input = {
        body: {
          priority: "critical",
        },
      };

      const result = updateTodoSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should reject title exceeding 200 characters", () => {
      const input = {
        body: {
          title: "a".repeat(201),
        },
      };

      const result = updateTodoSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should reject completed as non-boolean", () => {
      const input = {
        body: {
          completed: "yes",
        },
      };

      const result = updateTodoSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe("todoQuerySchema", () => {
    it("should accept valid query with all parameters", () => {
      const input = {
        query: {
          page: "2",
          limit: "20",
          sortBy: "title",
          order: "asc",
          completed: "true",
          priority: "high",
          search: "groceries",
        },
      };

      const result = todoQuerySchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.query.page).toBe(2);
        expect(result.data.query.limit).toBe(20);
        expect(result.data.query.sortBy).toBe("title");
        expect(result.data.query.order).toBe("asc");
        expect(result.data.query.completed).toBe("true");
        expect(result.data.query.priority).toBe("high");
        expect(result.data.query.search).toBe("groceries");
      }
    });

    it("should accept empty query (all defaults)", () => {
      const input = {
        query: {},
      };

      const result = todoQuerySchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it("should reject negative page number", () => {
      const input = {
        query: {
          page: "-1",
        },
      };

      const result = todoQuerySchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should reject page of zero", () => {
      const input = {
        query: {
          page: "0",
        },
      };

      const result = todoQuerySchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should reject limit exceeding 100", () => {
      const input = {
        query: {
          limit: "101",
        },
      };

      const result = todoQuerySchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should reject limit of zero", () => {
      const input = {
        query: {
          limit: "0",
        },
      };

      const result = todoQuerySchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should reject invalid sortBy value", () => {
      const input = {
        query: {
          sortBy: "invalidField",
        },
      };

      const result = todoQuerySchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should accept all valid sortBy values", () => {
      for (const sortBy of ["createdAt", "updatedAt", "title", "priority"]) {
        const input = {
          query: { sortBy },
        };

        const result = todoQuerySchema.safeParse(input);
        expect(result.success).toBe(true);
      }
    });

    it("should reject invalid order value", () => {
      const input = {
        query: {
          order: "random",
        },
      };

      const result = todoQuerySchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should reject invalid completed value", () => {
      const input = {
        query: {
          completed: "yes",
        },
      };

      const result = todoQuerySchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should reject invalid priority in query", () => {
      const input = {
        query: {
          priority: "urgent",
        },
      };

      const result = todoQuerySchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe("todoIdSchema", () => {
    it("should accept a valid 24-character hex ObjectId", () => {
      const input = {
        params: {
          id: "507f1f77bcf86cd799439011",
        },
      };

      const result = todoIdSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.params.id).toBe("507f1f77bcf86cd799439011");
      }
    });

    it("should accept ObjectId with uppercase hex characters", () => {
      const input = {
        params: {
          id: "507F1F77BCF86CD799439011",
        },
      };

      const result = todoIdSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it("should reject an invalid ID format (too short)", () => {
      const input = {
        params: {
          id: "123",
        },
      };

      const result = todoIdSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should reject an invalid ID format (too long)", () => {
      const input = {
        params: {
          id: "507f1f77bcf86cd7994390111",
        },
      };

      const result = todoIdSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should reject an ID with non-hex characters", () => {
      const input = {
        params: {
          id: "507f1f77bcf86cd79943901z",
        },
      };

      const result = todoIdSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should reject an empty string ID", () => {
      const input = {
        params: {
          id: "",
        },
      };

      const result = todoIdSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should reject missing id param", () => {
      const input = {
        params: {},
      };

      const result = todoIdSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });
});
