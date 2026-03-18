import express, { Application, Request, Response, NextFunction } from 'express';
import { LivestockAssistant } from '../assistant/LivestockAssistant';
import { AnimalManager } from '../modules/AnimalManager';
import { createAssistantRouter } from './routes/assistant';
import { createAnimalsRouter } from './routes/animals';

export function createApp(): Application {
  const app = express();

  app.use(express.json());

  // Shared service instances
  const assistant = new LivestockAssistant();
  const animalManager = new AnimalManager();

  // Health check
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'openclaw-livestock-assistant' });
  });

  // API routes
  app.use('/api/assistant', createAssistantRouter(assistant));
  app.use('/api/animals', createAnimalsRouter(animalManager));

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Ruta no encontrada.' });
  });

  // Global error handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor.' });
  });

  return app;
}
