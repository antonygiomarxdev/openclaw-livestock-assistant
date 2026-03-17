import { generateText, ModelMessage } from 'ai';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, ChatSession, AssistantResponse } from './types';
import { SYSTEM_PROMPT, WELCOME_MESSAGE } from './systemPrompt';
import { ProviderConfig, resolveProviderFromEnv } from './providers';

export class LivestockAssistant {
  private provider: ProviderConfig;
  private sessions: Map<string, ChatSession>;

  constructor(provider?: ProviderConfig) {
    this.provider = provider ?? resolveProviderFromEnv();
    this.sessions = new Map();
  }

  /**
   * Creates a new chat session and returns the welcome message.
   */
  createSession(): { sessionId: string; welcome: string } {
    const sessionId = uuidv4();
    const session: ChatSession = {
      id: sessionId,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.sessions.set(sessionId, session);
    return { sessionId, welcome: WELCOME_MESSAGE };
  }

  /**
   * Sends a message to the assistant and returns the response.
   * The system prompt is passed separately so any provider can handle it.
   */
  async chat(sessionId: string, message: string): Promise<AssistantResponse> {
    let session = this.sessions.get(sessionId);
    if (!session) {
      session = {
        id: sessionId,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.sessions.set(sessionId, session);
    }

    const userMessage: ChatMessage = { role: 'user', content: message };
    session.messages.push(userMessage);

    // Build the messages array for the SDK (user + assistant only)
    const sdkMessages: ModelMessage[] = session.messages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    const { text, usage } = await generateText({
      model: this.provider.model,
      system: SYSTEM_PROMPT,
      messages: sdkMessages,
      temperature: 0.7,
      maxOutputTokens: 1024,
    });

    const assistantMessage: ChatMessage = { role: 'assistant', content: text };
    session.messages.push(assistantMessage);
    session.updatedAt = new Date();

    return {
      response: text,
      sessionId,
      tokens: (usage.inputTokens ?? 0) + (usage.outputTokens ?? 0),
    };
  }

  /**
   * Returns the message history for a session (user + assistant messages only).
   */
  getHistory(sessionId: string): ChatMessage[] {
    const session = this.sessions.get(sessionId);
    if (!session) return [];
    return session.messages.filter((m) => m.role !== 'system');
  }

  /**
   * Deletes a session from the assistant.
   */
  deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  /**
   * Returns the number of active sessions.
   */
  getActiveSessionCount(): number {
    return this.sessions.size;
  }
}

