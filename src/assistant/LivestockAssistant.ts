import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, ChatSession, AssistantResponse } from './types';
import { SYSTEM_PROMPT, WELCOME_MESSAGE } from './systemPrompt';

export class LivestockAssistant {
  private client: OpenAI;
  private model: string;
  private sessions: Map<string, ChatSession>;

  constructor(apiKey?: string, model = 'gpt-4o') {
    this.client = new OpenAI({ apiKey: apiKey ?? process.env.OPENAI_API_KEY });
    this.model = model;
    this.sessions = new Map();
  }

  /**
   * Creates a new chat session and returns the welcome message.
   */
  createSession(): { sessionId: string; welcome: string } {
    const sessionId = uuidv4();
    const session: ChatSession = {
      id: sessionId,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.sessions.set(sessionId, session);
    return { sessionId, welcome: WELCOME_MESSAGE };
  }

  /**
   * Sends a message to the assistant and returns the response.
   */
  async chat(sessionId: string, message: string): Promise<AssistantResponse> {
    let session = this.sessions.get(sessionId);
    if (!session) {
      session = {
        id: sessionId,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.sessions.set(sessionId, session);
    }

    const userMessage: ChatMessage = { role: 'user', content: message };
    session.messages.push(userMessage);

    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: session.messages,
      temperature: 0.7,
      max_tokens: 1024,
    });

    const choice = completion.choices[0];
    const response = choice.message.content ?? '';

    const assistantMessage: ChatMessage = { role: 'assistant', content: response };
    session.messages.push(assistantMessage);
    session.updatedAt = new Date();

    return {
      response,
      sessionId,
      tokens: completion.usage?.total_tokens,
    };
  }

  /**
   * Returns the message history for a session (excluding the system prompt).
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

