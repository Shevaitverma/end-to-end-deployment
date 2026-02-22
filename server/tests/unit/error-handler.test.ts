import { describe, it, expect, mock, beforeEach, spyOn } from "bun:test";
import { errorHandler } from "../../src/middleware/error-handler.js";
import { AppError } from "../../src/utils/api-response.js";
import * as envModule from "../../src/config/env.js";

function createMockResponse() {
  const res: any = {};
  res.status = mock(() => res);
  res.json = mock(() => res);
  return res;
}

function createMockRequest(): any {
  return {};
}

describe("errorHandler", () => {
  let res: any;
  let req: any;
  let next: any;

  beforeEach(() => {
    res = createMockResponse();
    req = createMockRequest();
    next = mock(() => {});
  });

  describe("AppError handling", () => {
    it("should send correct status and message for AppError", () => {
      const error = new AppError("Resource not found", 404);

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          data: null,
          message: "Resource not found",
        })
      );
    });

    it("should handle AppError with 400 status", () => {
      const error = new AppError("Bad request", 400);

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          data: null,
          message: "Bad request",
        })
      );
    });

    it("should handle AppError with 422 status", () => {
      const error = new AppError("Unprocessable entity", 422);

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Unprocessable entity",
        })
      );
    });
  });

  describe("MongoServerError handling (duplicate key)", () => {
    it("should send 409 with duplicate field message for code 11000", () => {
      const error: any = new Error("E11000 duplicate key error");
      error.name = "MongoServerError";
      error.code = 11000;
      error.keyValue = { email: "test@example.com" };

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          data: null,
          message: "Duplicate value for field: email",
        })
      );
    });

    it("should extract the correct field name from keyValue", () => {
      const error: any = new Error("E11000 duplicate key error");
      error.name = "MongoServerError";
      error.code = 11000;
      error.keyValue = { title: "Duplicate Title" };

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Duplicate value for field: title",
        })
      );
    });
  });

  describe("generic Error handling", () => {
    it("should send 500 with error message in non-production", () => {
      spyOn(envModule, "env" as any, "get").mockReturnValue({
        ...envModule.env,
        NODE_ENV: "development",
      });

      const error = new Error("Something broke internally");

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          data: null,
          message: "Something broke internally",
        })
      );
    });

    it("should send 500 for unknown error types", () => {
      const error = new Error("Unexpected failure");

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          data: null,
        })
      );
    });

    it("should not treat MongoServerError with non-11000 code as duplicate", () => {
      const error: any = new Error("Some other mongo error");
      error.name = "MongoServerError";
      error.code = 12345;

      errorHandler(error, req, res, next);

      // Should fall through to generic error handler (500)
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
