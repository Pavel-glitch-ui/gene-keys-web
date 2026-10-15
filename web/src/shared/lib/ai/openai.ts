import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-openai-key',
  timeout: 25000,
  maxRetries: 0,
});

export const OPENAI_MODEL = 'gpt-4o-mini';
