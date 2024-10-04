import express, { Application } from 'express';
import { authRouter } from './routes/auth.routes';

import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { errorHandler } from './middlewares/errorHandler';
import { taskRouter } from './routes/task.routes';
import { authGuard } from './guards/auth.guard';

import path from 'path';
import { itemRouter } from './routes/item.routes';
import { quickTaskRouter } from './routes/quick-task.routes';

export const bootstrap = async () => {
  const app: Application = express();

  // middlewares
  app.use(express.json());
  // app.use(express.urlencoded({ extended: true }));
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );
  app.use(
    cors({
      origin: 'http://localhost:5000',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true,
    }),
  );
  app.use(morgan('dev'));
  app.use(cookieParser());

  app.use('/public', express.static(path.join(__dirname, '../public')));

  // routes
  app.use('/auth', authRouter);
  app.use('/tasks', authGuard, taskRouter);
  app.use('/item', itemRouter);
  app.use('/quick-tasks', quickTaskRouter);

  app.use(errorHandler);

  return app;
};
