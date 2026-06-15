import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import apiRoutes from './routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

export function createApp(): Application {
  const app = express();

  app.use(helmet());
  app.use(cors({
    origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
    credentials: true,
  }));
  app.use(express.json());
  app.use(cookieParser());

  app.get('/api/v1/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'success',
      message: 'SaaSImperialBarber API operando correctamente',
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api/v1', apiRoutes);
  app.use(errorHandler);

  return app;
}

const app = createApp();
export default app;
