import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { errorResponse, logger } from '@zeemo/shared';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error('Unhandled API Error', { error: err.message, stack: err.stack });

  if (err instanceof ZodError) {
    res.status(400).json(errorResponse('Validation error', 'VALIDATION_ERROR', err.errors));
    return;
  }

  res.status(500).json(errorResponse(err.message || 'Internal Server Error', 'INTERNAL_SERVER_ERROR'));
}
