import OpenAI from 'openai';

const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || '';
const baseURL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';

export const openrouter = new OpenAI({
  apiKey: apiKey || 'dummy-openrouter-key',
  baseURL,
  defaultHeaders: {
    'HTTP-Referer': 'https://gene-keys.app',
    'X-Title': 'Gene Keys Web Profiler',
  },
});

export const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet';
