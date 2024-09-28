import express, { Application } from 'express';
import { authRouter } from './routes/auth.routes';

import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { errorHandler } from './middlewares/errorHandler';
import { taskRouter } from './routes/task.routes';
import { authGuard } from './guards/auth.guard';

export const bootstrap = async () => {
  const app: Application = express();

  // middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(helmet());
  app.use(cors());
  app.use(morgan('dev'));
  app.use(cookieParser());

  // routes
  app.use('/auth', authRouter);
  app.use('/tasks', authGuard, taskRouter);

  app.use(errorHandler);

  return app;
};
