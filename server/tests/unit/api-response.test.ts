import { describe, it, expect, mock } from "bun:test";
import { sendSuccess, sendError, AppError } from "../../src/utils/api-response.js";

function createMockResponse() {
  const res: any = {};
  res.status = mock(() => res);
  res.json = mock(() => res);
  return res;
}

describe("API Response Utils", () => {
  describe("sendSuccess", () => {
    it("should send success response with default status 200", () => {
      const res = createMockResponse();
      sendSuccess(res, { id: "1" }, "Success");

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: { id: "1" },
        message: "Success",
      });
    });

    it("should send success with custom status code", () => {
      const res = createMockResponse();
      sendSuccess(res, { id: "1" }, "Created", 201);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should include pagination when provided", () => {
      const res = createMockResponse();
      const pagination = { page: 1, limit: 10, total: 50, totalPages: 5 };
      sendSuccess(res, [], "Success", 200, pagination);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: [],
        message: "Success",
        pagination,
      });
    });
  });

  describe("sendError", () => {
    it("should send error response with default status 500", () => {
      const res = createMockResponse();
      sendError(res, "Something went wrong");

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        data: null,
        message: "Something went wrong",
      });
    });

    it("should include errors when provided", () => {
      const res = createMockResponse();
      const errors = [{ field: "title", message: "Required" }];
      sendError(res, "Validation failed", 422, errors);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        data: null,
        message: "Validation failed",
        errors,
      });
    });
  });

  describe("AppError", () => {
    it("should create an error with status code", () => {
      const error = new AppError("Not found", 404);

      expect(error.message).toBe("Not found");
      expect(error.statusCode).toBe(404);
      expect(error.isOperational).toBe(true);
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
    });

    it("should support non-operational errors", () => {
      const error = new AppError("DB failure", 500, false);

      expect(error.isOperational).toBe(false);
    });
  });
});
