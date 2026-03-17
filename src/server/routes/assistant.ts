import { Router, Request, Response } from 'express';
import { LivestockAssistant } from '../../assistant/LivestockAssistant';

export function createAssistantRouter(assistant: LivestockAssistant): Router {
  const router = Router();

  /**
   * POST /api/assistant/sessions
   * Creates a new conversation session.
   */
  router.post('/sessions', (_req: Request, res: Response) => {
    const result = assistant.createSession();
    res.status(201).json(result);
  });

  /**
   * POST /api/assistant/sessions/:sessionId/messages
   * Sends a message and returns the assistant's response.
   */
  router.post('/sessions/:sessionId/messages', async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const { message } = req.body as { message?: string };

    if (!message || typeof message !== 'string' || message.trim() === '') {
      res.status(400).json({ error: 'El campo "message" es requerido y no puede estar vacío.' });
      return;
    }

    const result = await assistant.chat(sessionId, message.trim());
    res.json(result);
  });

  /**
   * GET /api/assistant/sessions/:sessionId/history
   * Returns the message history of a session.
   */
  router.get('/sessions/:sessionId/history', (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const history = assistant.getHistory(sessionId);
    res.json({ sessionId, history });
  });

  /**
   * DELETE /api/assistant/sessions/:sessionId
   * Deletes a conversation session.
   */
  router.delete('/sessions/:sessionId', (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const deleted = assistant.deleteSession(sessionId);
    if (!deleted) {
      res.status(404).json({ error: 'Sesión no encontrada.' });
      return;
    }
    res.status(204).send();
  });

  return router;
}
