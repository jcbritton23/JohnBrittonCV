import { SafetyFilter } from '../types';
import OpenAI from 'openai';

let openai: OpenAI;
try {
  const apiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY ||
                 (import.meta as any).env?.OPENAI_API_KEY ||
                 process.env.REACT_APP_OPENAI_API_KEY ||
                 process.env.OPENAI_API_KEY;

  openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
} catch (error) {
  console.error('Failed to initialize OpenAI client in safety module:', error);
  throw error;
}

// Basic safety filters to block clearly harmful or sensitive queries
const PROFANITY_WORDS: string[] = [];
const TOXIC_PATTERNS = [/kill/i, /harm/i, /hurt/i, /attack/i, /bomb/i, /weapon/i];
const PERSONAL_INFO_PATTERNS = [/ssn|social security/i, /credit card|cc number/i, /password/i, /bank account/i];
const FORBIDDEN_PATTERNS = [
  /suicide|self[- ]?harm|kill myself|hurt myself|ending my life|overdose|cutting|risk of harm|homicide|violence|abuse|assault|danger to self|danger to others|crisis|emergency|911|hotline/i,
];

export const sanitizeQuery = (query: string): SafetyFilter => {
  const originalQuery = query.trim();
  let sanitizedQuery = originalQuery;
  const warnings: string[] = [];

  if (FORBIDDEN_PATTERNS.some(p => p.test(sanitizedQuery))) {
    return { isSafe: false, sanitizedQuery, warnings: ["I'm sorry, I can't discuss that topic."] };
  }

  if (!sanitizedQuery) {
    return { isSafe: false, sanitizedQuery: '', warnings: ['Please provide a valid question.'] };
  }

  if (sanitizedQuery.length > 500) {
    warnings.push('Query is too long');
    sanitizedQuery = sanitizedQuery.slice(0, 500);
  }

  if (PROFANITY_WORDS.some(w => sanitizedQuery.toLowerCase().includes(w))) {
    warnings.push('Query contains inappropriate language');
    sanitizedQuery = sanitizedQuery.replace(new RegExp(PROFANITY_WORDS.join('|'), 'gi'), '[REDACTED]');
  }

  if (TOXIC_PATTERNS.some(p => p.test(sanitizedQuery))) {
    warnings.push('Query contains potentially harmful content');
    sanitizedQuery = sanitizedQuery.replace(/kill|harm|hurt|attack|bomb|weapon/gi, '[REDACTED]');
  }

  if (PERSONAL_INFO_PATTERNS.some(p => p.test(sanitizedQuery))) {
    warnings.push('Query requests personal information');
    sanitizedQuery = sanitizedQuery.replace(/ssn|social security|credit card|cc number|password|bank account/gi, '[REDACTED]');
  }

  return { isSafe: warnings.length === 0, sanitizedQuery, warnings };
};

export async function moderateQueryOpenAI(query: string): Promise<{ flagged: boolean; categories?: any; }> {
  try {
    const moderation = await openai.moderations.create({ input: query });
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

