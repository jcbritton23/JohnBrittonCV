import { SafetyFilter } from '../types';
import OpenAI from 'openai';

let openai: OpenAI | null = null;

const resolveApiKey = (): string => {
  try {
    const maybeEnv = (import.meta as any).env ?? {};
    return (
      maybeEnv.VITE_OPENAI_API_KEY ||
      maybeEnv.OPENAI_API_KEY ||
      process.env?.REACT_APP_OPENAI_API_KEY ||
      process.env?.OPENAI_API_KEY ||
      ''
    );
  } catch (error) {
    console.warn('Unable to read OpenAI API key from environment:', error);
    return '';
  }
};

const getOpenAIClient = (): OpenAI | null => {
  if (openai) return openai;
  const apiKey = resolveApiKey();
  if (!apiKey) {
    console.warn('OpenAI API key is not configured; moderation will be skipped.');
    return null;
  }

  try {
    openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
    return openai;
  } catch (error) {
    console.error('Failed to initialize OpenAI client in safety module:', error);
    return null;
  }
};

export const sanitizeQuery = (query: string): SafetyFilter => {
  const trimmedQuery = query.trim();
  const warnings: string[] = [];

  if (!trimmedQuery) {
    return { isSafe: false, sanitizedQuery: '', warnings: ['Please provide a valid question.'] };
  }

  let sanitizedQuery = trimmedQuery;
  const MAX_LENGTH = 1000;

  if (sanitizedQuery.length > MAX_LENGTH) {
    warnings.push(`Query was trimmed to ${MAX_LENGTH} characters for processing.`);
    sanitizedQuery = sanitizedQuery.slice(0, MAX_LENGTH);
  }

  return { isSafe: true, sanitizedQuery, warnings };
};

export async function moderateQueryOpenAI(query: string): Promise<{ flagged: boolean; categories?: any; }> {
  const client = getOpenAIClient();
  if (!client) {
    return { flagged: false };
  }

  try {
    const moderation = await client.moderations.create({ input: query });
    const result = moderation.results[0];
    return { flagged: result.flagged, categories: result.categories };
  } catch (error) {
    console.error('OpenAI Moderation API error:', error);
    return { flagged: false };
  }
}

export const validateResponse = (response: string): boolean => {
  return true;
};

export const rephraseNegativeResponse = (response: string): string => response;

export const addDisclaimers = (response: string): string => response;

export const checkForPersonalData = (text: string): boolean => {
  const patterns = [/\b\d{3}-\d{2}-\d{4}\b/, /\b\d{4}-\d{4}-\d{4}-\d{4}\b/, /\b\d{3}-\d{3}-\d{4}\b/, /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/];
  return patterns.some(p => p.test(text));
};

