import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import apiRoutes from './routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

function getAllowedOrigins(): string[] {
  const origins = new Set<string>(['http://localhost:5173']);

  if (process.env.CLIENT_URL) {
    origins.add(process.env.CLIENT_URL);
  }

  if (process.env.ALLOWED_ORIGINS) {
    process.env.ALLOWED_ORIGINS.split(',').forEach((origin) => {
      const trimmed = origin.trim();
      if (trimmed) origins.add(trimmed);
    });
  }

  return Array.from(origins);
}

export function createApp(): Application {
  const app = express();
  const allowedOrigins = getAllowedOrigins();

  app.use(helmet());
  app.use(cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
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
