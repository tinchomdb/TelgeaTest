import { Request, Response, NextFunction } from "express";

/**
 * Centralized error handling middleware
 * Captures all errors passed via next(error) and formats consistent responses
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(`[Error] ${req.method} ${req.path}:`, error.message);

  const statusCode = isValidationError(error.message) ? 400 : 500;

  res.status(statusCode).json({
    error: error.message,
  });
};

function isValidationError(message: string): boolean {
  return (
    message.includes("Invalid") ||
    message.includes("Missing") ||
    message.includes("required") ||
    message.includes("parse")
  );
}
