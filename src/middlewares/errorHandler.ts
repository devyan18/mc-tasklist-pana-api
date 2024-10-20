// src/middlewares/errorHandler.ts

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

// Middleware de manejo de errores
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map(error => ({
      path: error.path.join('.'),
      message: error.message,
    }));

    console.log(err);

    res.status(400).json({
      message: 'Validation Error',
      errors: formattedErrors,
    });
    return;
  }

  // Manejo de otros tipos de errores
  console.error(err);

  // Verifica si res.status es una función antes de llamarla
  if (typeof res.status === 'function') {
    res.status(500).json({
      message: 'Internal Server Error',
    });
  } else {
    // Si res.status no es una función, envía una respuesta genérica
    res.send('Internal Server Error');
  }

  next();
};
