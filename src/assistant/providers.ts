import { LanguageModel } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export type ProviderName = 'openai' | 'anthropic' | 'google';

export interface ProviderConfig {
  name: ProviderName;
  model: LanguageModel;
}

/**
 * Default model IDs used when none is explicitly specified per provider.
 * Updated to the latest production models as of early 2026.
 */
export const DEFAULT_MODELS: Record<ProviderName, string> = {
  openai: 'gpt-5',
  anthropic: 'claude-opus-4-6',
  google: 'gemini-2.5-pro',
};

/**
 * Creates a ProviderConfig for the given provider name.
 * API keys are read from environment variables if not supplied explicitly.
 */
export function createProvider(name: ProviderName, modelId?: string, apiKey?: string): ProviderConfig {
  const id = modelId ?? DEFAULT_MODELS[name];
  switch (name) {
    case 'openai': {
      const client = createOpenAI({ apiKey: apiKey ?? process.env.OPENAI_API_KEY });
      return { name, model: client(id) };
    }
    case 'anthropic': {
      const client = createAnthropic({ apiKey: apiKey ?? process.env.ANTHROPIC_API_KEY });
      return { name, model: client(id) };
    }
    case 'google': {
      const client = createGoogleGenerativeAI({
        apiKey: apiKey ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      });
      return { name, model: client(id) };
    }
  }
}

/**
 * Resolves a provider from environment variables.
 *
 * Resolution order:
 * 1. AI_PROVIDER + AI_MODEL env vars (explicit override)
 * 2. Auto-detect from whichever API key is present (OPENAI > ANTHROPIC > GOOGLE)
 * 3. Falls back to OpenAI (will fail at runtime if no key is set)
 */
export function resolveProviderFromEnv(): ProviderConfig {
  const providerName = (process.env.AI_PROVIDER ?? '').toLowerCase();
  const modelId = process.env.AI_MODEL || undefined;

  if (providerName === 'openai' || providerName === 'anthropic' || providerName === 'google') {
    return createProvider(providerName, modelId);
  }

  if (process.env.OPENAI_API_KEY) return createProvider('openai', modelId);
  if (process.env.ANTHROPIC_API_KEY) return createProvider('anthropic', modelId);
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) return createProvider('google', modelId);

  // Default — runtime will throw if the key is missing
  return createProvider('openai', modelId);
}
