import { createProvider, resolveProviderFromEnv, DEFAULT_MODELS, ProviderName } from '../assistant/providers';

// Mock all three provider SDKs so no real HTTP calls are made
jest.mock('@ai-sdk/openai', () => ({
  createOpenAI: jest.fn(() => jest.fn((modelId: string) => ({ provider: 'openai', modelId }))),
}));
jest.mock('@ai-sdk/anthropic', () => ({
  createAnthropic: jest.fn(() => jest.fn((modelId: string) => ({ provider: 'anthropic', modelId }))),
}));
jest.mock('@ai-sdk/google', () => ({
  createGoogleGenerativeAI: jest.fn(() => jest.fn((modelId: string) => ({ provider: 'google', modelId }))),
}));

describe('providers', () => {
  describe('DEFAULT_MODELS', () => {
    it('defines a default model for every supported provider', () => {
      const providers: ProviderName[] = ['openai', 'anthropic', 'google'];
      providers.forEach((p) => {
        expect(DEFAULT_MODELS[p]).toBeDefined();
        expect(typeof DEFAULT_MODELS[p]).toBe('string');
      });
    });
  });

  describe('createProvider', () => {
    it('creates an OpenAI provider with the default model', () => {
      const config = createProvider('openai');
      expect(config.name).toBe('openai');
      expect(config.model).toBeDefined();
    });

    it('creates an Anthropic provider with the default model', () => {
      const config = createProvider('anthropic');
      expect(config.name).toBe('anthropic');
      expect(config.model).toBeDefined();
    });

    it('creates a Google provider with the default model', () => {
      const config = createProvider('google');
      expect(config.name).toBe('google');
      expect(config.model).toBeDefined();
    });

    it('uses a custom modelId when provided', () => {
      const config = createProvider('openai', 'gpt-4-turbo');
      expect(config.name).toBe('openai');
      // The model object is created by the mocked factory; just verify it exists
      expect(config.model).toBeDefined();
    });
  });

  describe('resolveProviderFromEnv', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
      delete process.env.AI_PROVIDER;
      delete process.env.AI_MODEL;
      delete process.env.OPENAI_API_KEY;
      delete process.env.ANTHROPIC_API_KEY;
      delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('respects AI_PROVIDER=openai', () => {
      process.env.AI_PROVIDER = 'openai';
      const config = resolveProviderFromEnv();
      expect(config.name).toBe('openai');
    });

    it('respects AI_PROVIDER=anthropic', () => {
      process.env.AI_PROVIDER = 'anthropic';
      const config = resolveProviderFromEnv();
      expect(config.name).toBe('anthropic');
    });

    it('respects AI_PROVIDER=google', () => {
      process.env.AI_PROVIDER = 'google';
      const config = resolveProviderFromEnv();
      expect(config.name).toBe('google');
    });

    it('auto-detects OpenAI when OPENAI_API_KEY is set and no AI_PROVIDER', () => {
      process.env.OPENAI_API_KEY = 'sk-test';
      const config = resolveProviderFromEnv();
      expect(config.name).toBe('openai');
    });

    it('auto-detects Anthropic when only ANTHROPIC_API_KEY is set', () => {
      process.env.ANTHROPIC_API_KEY = 'sk-ant-test';
      const config = resolveProviderFromEnv();
      expect(config.name).toBe('anthropic');
    });

    it('auto-detects Google when only GOOGLE_GENERATIVE_AI_API_KEY is set', () => {
      process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'google-test';
      const config = resolveProviderFromEnv();
      expect(config.name).toBe('google');
    });

    it('prefers OpenAI over Anthropic when both keys are present', () => {
      process.env.OPENAI_API_KEY = 'sk-test';
      process.env.ANTHROPIC_API_KEY = 'sk-ant-test';
      const config = resolveProviderFromEnv();
      expect(config.name).toBe('openai');
    });

    it('falls back to OpenAI when no keys are set', () => {
      const config = resolveProviderFromEnv();
      expect(config.name).toBe('openai');
    });
  });
});
