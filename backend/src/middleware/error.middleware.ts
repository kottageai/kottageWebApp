import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err.stack);

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.issues.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    });
  }

  if (err.message.includes('duplicate key')) {
    return res.status(409).json({ error: 'Profile already exists' });
  }

  res.status(500).json({ error: 'Internal server error' });
}