import { describe, it, expect, mock } from "bun:test";
import { validate } from "../../src/middleware/validate.js";
import { createTodoSchema, todoIdSchema } from "../../src/schemas/todo.schema.js";

function createMockReqResNext(overrides: any = {}) {
  const req: any = {
    body: {},
    query: {},
    params: {},
    ...overrides,
  };
  const res: any = {
    status: mock(() => res),
    json: mock(() => res),
  };
  const next = mock(() => {});
  return { req, res, next };
}

describe("validate middleware", () => {
  it("should call next() for valid input", () => {
    const { req, res, next } = createMockReqResNext({
      body: { title: "Test Todo" },
    });

    validate(createTodoSchema)(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should return 422 for invalid input", () => {
    const { req, res, next } = createMockReqResNext({
      body: { title: "" },
    });

    validate(createTodoSchema)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Validation failed",
      })
    );
  });

  it("should return 422 for missing required fields", () => {
    const { req, res, next } = createMockReqResNext({
      body: {},
    });

    validate(createTodoSchema)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(422);
  });

  it("should validate todo ID format", () => {
    const { req, res, next } = createMockReqResNext({
      params: { id: "invalid-id" },
    });

    validate(todoIdSchema)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(422);
  });

  it("should accept valid ObjectId", () => {
    const { req, res, next } = createMockReqResNext({
      params: { id: "507f1f77bcf86cd799439011" },
    });

    validate(todoIdSchema)(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
