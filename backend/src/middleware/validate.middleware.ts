import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';

export function validate<T>(schema: ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}