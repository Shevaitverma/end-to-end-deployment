import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { AppError, sendError } from "../utils/api-response.js";
import { env } from "../config/env.js";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // AppError (known operational errors)
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    sendError(res, "Validation failed", 422, errors);
    return;
  }

  // Mongoose cast error (invalid ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    sendError(res, `Invalid ${err.path}: ${err.value}`, 400);
    return;
  }

  // MongoDB duplicate key error
  if (err.name === "MongoServerError" && (err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0];
    sendError(res, `Duplicate value for field: ${field}`, 409);
    return;
  }

  // Unknown errors
  console.error("[error]", err);
  const message =
    env.NODE_ENV === "production" ? "Internal server error" : err.message;
  sendError(res, message, 500);
}
