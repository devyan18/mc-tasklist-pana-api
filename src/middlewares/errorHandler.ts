// src/middlewares/errorHandler.ts
import { Request, Response } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  // next: NextFunction,
) => {
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map(error => ({
      path: error.path.join('.'),
      message: error.message,
    }));

    res.status(400).json({
      message: 'Validation Error',
      errors: formattedErrors,
    });
    return;
  }

  // Manejo de otros tipos de errores
  console.error(err);

  res.status(500).json({
    message: 'Internal Server Error',
  });
};
