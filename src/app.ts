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
import { cleanRouter } from './routes/clean.routes';

export const bootstrap = async () => {
  const app: Application = express();

  // middlewares
  app.use(
    express.json({
      limit: '50mb',
    }),
  );
  // app.use(express.urlencoded({ extended: true }));
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          imgSrc: ["'self'", 'http://localhost:4000'],
        },
      },
    }),
  );
  app.use(
    cors({
      origin: [
        'http://localhost:5000',
        'https://8cz7fhdl-5000.brs.devtunnels.ms',
      ],
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
  app.use('/clean', cleanRouter);

  app.use(errorHandler);

  return app;
};
