import { generateText } from 'ai';
import { LivestockAssistant } from '../assistant/LivestockAssistant';
import { WELCOME_MESSAGE } from '../assistant/systemPrompt';
import { ProviderConfig } from '../assistant/providers';
import { LanguageModel } from 'ai';

jest.mock('ai', () => ({
  generateText: jest.fn(),
}));

const mockGenerateText = generateText as jest.MockedFunction<typeof generateText>;

// A minimal stub that satisfies the ProviderConfig shape without hitting any real API
const mockProvider: ProviderConfig = {
  name: 'openai',
  model: {} as LanguageModel,
};

describe('LivestockAssistant', () => {
  let assistant: LivestockAssistant;

  beforeEach(() => {
    jest.clearAllMocks();
    assistant = new LivestockAssistant(mockProvider);
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
      mockGenerateText.mockResolvedValue({
        text: '¡Hola! ¿En qué puedo ayudarte?',
        usage: { inputTokens: 30, outputTokens: 12 },
      } as Awaited<ReturnType<typeof generateText>>);

      const { sessionId } = assistant.createSession();
      const result = await assistant.chat(sessionId, '¿Cómo prevenir mastitis?');

      expect(result.sessionId).toBe(sessionId);
      expect(result.response).toBe('¡Hola! ¿En qué puedo ayudarte?');
      expect(result.tokens).toBe(42);
    });

    it('passes the system prompt and user messages to generateText', async () => {
      mockGenerateText.mockResolvedValue({
        text: 'Respuesta',
        usage: { inputTokens: 10, outputTokens: 5 },
      } as Awaited<ReturnType<typeof generateText>>);

      const { sessionId } = assistant.createSession();
      await assistant.chat(sessionId, 'Hola');

      expect(mockGenerateText).toHaveBeenCalledWith(
        expect.objectContaining({
          system: expect.any(String),
          messages: expect.arrayContaining([
            expect.objectContaining({ role: 'user', content: 'Hola' }),
          ]),
        }),
      );
    });

    it('auto-creates a session when sessionId does not exist', async () => {
      mockGenerateText.mockResolvedValue({
        text: 'Respuesta de prueba',
        usage: { inputTokens: 5, outputTokens: 5 },
      } as Awaited<ReturnType<typeof generateText>>);

      const result = await assistant.chat('unknown-session', 'Hola');
      expect(result.response).toBe('Respuesta de prueba');
      expect(assistant.getActiveSessionCount()).toBe(1);
    });

    it('accumulates messages in the session history', async () => {
      mockGenerateText.mockResolvedValue({
        text: 'Respuesta 1',
        usage: { inputTokens: 5, outputTokens: 5 },
      } as Awaited<ReturnType<typeof generateText>>);

      const { sessionId } = assistant.createSession();
      await assistant.chat(sessionId, 'Pregunta 1');

      const history = assistant.getHistory(sessionId);
      expect(history).toHaveLength(2); // user + assistant
      expect(history[0].role).toBe('user');
      expect(history[0].content).toBe('Pregunta 1');
      expect(history[1].role).toBe('assistant');
      expect(history[1].content).toBe('Respuesta 1');
    });

    it('sums inputTokens and outputTokens for total token count', async () => {
      mockGenerateText.mockResolvedValue({
        text: 'ok',
        usage: { inputTokens: 100, outputTokens: 50 },
      } as Awaited<ReturnType<typeof generateText>>);

      const { sessionId } = assistant.createSession();
      const result = await assistant.chat(sessionId, 'test');
      expect(result.tokens).toBe(150);
    });

    it('handles undefined token counts gracefully', async () => {
      mockGenerateText.mockResolvedValue({
        text: 'ok',
        usage: { inputTokens: undefined, outputTokens: undefined },
      } as Awaited<ReturnType<typeof generateText>>);

      const { sessionId } = assistant.createSession();
      const result = await assistant.chat(sessionId, 'test');
      expect(result.tokens).toBe(0);
    });
  });

  describe('getHistory', () => {
    it('returns empty array for unknown session', () => {
      expect(assistant.getHistory('non-existent')).toEqual([]);
    });

    it('returns empty array for a freshly created session with no messages', () => {
      const { sessionId } = assistant.createSession();
      expect(assistant.getHistory(sessionId)).toEqual([]);
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
