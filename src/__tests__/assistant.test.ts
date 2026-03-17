import { LivestockAssistant } from '../assistant/LivestockAssistant';
import { WELCOME_MESSAGE } from '../assistant/systemPrompt';
import OpenAI from 'openai';

jest.mock('openai');

const mockCreate = jest.fn();
(OpenAI as jest.MockedClass<typeof OpenAI>).mockImplementation(() => {
  return {
    chat: {
      completions: {
        create: mockCreate,
      },
    },
  } as unknown as OpenAI;
});

describe('LivestockAssistant', () => {
  let assistant: LivestockAssistant;

  beforeEach(() => {
    jest.clearAllMocks();
    assistant = new LivestockAssistant('test-api-key', 'gpt-4o');
  });

  describe('createSession', () => {
    it('returns a sessionId and welcome message', () => {
      const result = assistant.createSession();
      expect(result.sessionId).toBeDefined();
      expect(typeof result.sessionId).toBe('string');
      expect(result.welcome).toBe(WELCOME_MESSAGE);
    });

    it('increments active session count', () => {
      expect(assistant.getActiveSessionCount()).toBe(0);
      assistant.createSession();
      expect(assistant.getActiveSessionCount()).toBe(1);
      assistant.createSession();
      expect(assistant.getActiveSessionCount()).toBe(2);
    });

    it('generates unique session IDs', () => {
      const a = assistant.createSession();
      const b = assistant.createSession();
      expect(a.sessionId).not.toBe(b.sessionId);
    });
  });

  describe('chat', () => {
    it('sends the user message and returns the assistant response', async () => {
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: '¡Hola! ¿En qué puedo ayudarte?' } }],
        usage: { total_tokens: 42 },
      });

      const { sessionId } = assistant.createSession();
      const result = await assistant.chat(sessionId, '¿Cómo prevenir mastitis?');

      expect(result.sessionId).toBe(sessionId);
      expect(result.response).toBe('¡Hola! ¿En qué puedo ayudarte?');
      expect(result.tokens).toBe(42);
    });

    it('auto-creates a session when sessionId does not exist', async () => {
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: 'Respuesta de prueba' } }],
        usage: { total_tokens: 10 },
      });

      const result = await assistant.chat('unknown-session', 'Hola');
      expect(result.response).toBe('Respuesta de prueba');
      expect(assistant.getActiveSessionCount()).toBe(1);
    });

    it('accumulates messages in the session history', async () => {
      mockCreate.mockResolvedValue({
        choices: [{ message: { content: 'Respuesta 1' } }],
        usage: { total_tokens: 5 },
      });

      const { sessionId } = assistant.createSession();
      await assistant.chat(sessionId, 'Pregunta 1');

      const history = assistant.getHistory(sessionId);
      expect(history).toHaveLength(2); // user message + assistant response
      expect(history[0].role).toBe('user');
      expect(history[0].content).toBe('Pregunta 1');
      expect(history[1].role).toBe('assistant');
      expect(history[1].content).toBe('Respuesta 1');
    });
  });

  describe('getHistory', () => {
    it('returns empty array for unknown session', () => {
      expect(assistant.getHistory('non-existent')).toEqual([]);
    });

    it('excludes the system prompt from history', () => {
      const { sessionId } = assistant.createSession();
      const history = assistant.getHistory(sessionId);
      expect(history.every((m) => m.role !== 'system')).toBe(true);
    });
  });

  describe('deleteSession', () => {
    it('deletes an existing session and returns true', () => {
      const { sessionId } = assistant.createSession();
      expect(assistant.deleteSession(sessionId)).toBe(true);
      expect(assistant.getActiveSessionCount()).toBe(0);
    });

    it('returns false when deleting a non-existent session', () => {
      expect(assistant.deleteSession('non-existent')).toBe(false);
    });
  });
});
