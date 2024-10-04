// src/middlewares/validate.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AnyZodObject, ZodError } from 'zod';

interface ValidationSchemas {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
}

export const validate =
  (schemas: ValidationSchemas): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);

    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }

      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        }));

        res.status(400).json({
          message: 'Validation Error',
          errors: formattedErrors,
        });
        return;
      }

      // Si el error no es de Zod, pásalo al siguiente manejador de errores
      next(error);
    }
  };
