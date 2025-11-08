import { Request, Response, NextFunction } from "express";

/**
 * Request logging middleware
 * Logs incoming HTTP requests for observability
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log(`[${req.method}] ${req.path}`);
  next();
};
