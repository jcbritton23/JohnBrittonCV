const DEFAULT_OPENAI_MODEL = 'gpt-5-nano';

const readCandidateModel = () => {
  const candidates = [];

  if (typeof process !== 'undefined' && process?.env) {
    candidates.push(
      process.env.OPENAI_RESPONSES_MODEL,
      process.env.OPENAI_MODEL,
      process.env.VITE_OPENAI_MODEL,
      process.env.PUBLIC_OPENAI_MODEL
    );
  }

  try {
    const metaEnv = typeof import.meta !== 'undefined' && import.meta?.env ? import.meta.env : null;
    if (metaEnv) {
      candidates.push(
        metaEnv.OPENAI_RESPONSES_MODEL,
        metaEnv.OPENAI_MODEL,
        metaEnv.VITE_OPENAI_MODEL,
        metaEnv.PUBLIC_OPENAI_MODEL
      );
    }
  } catch (error) {
    // Accessing import.meta.env can throw in some build tools; ignore.
  }

  for (const value of candidates) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value;
    }
  }

  return '';
};

const normalizeModel = (candidate) => {
  if (typeof candidate !== 'string') {
    return DEFAULT_OPENAI_MODEL;
  }
  const trimmed = candidate.trim();
  if (!trimmed) {
    return DEFAULT_OPENAI_MODEL;
  }

  if (!trimmed.toLowerCase().startsWith('gpt-5-nano')) {
    console.warn(`Configured OpenAI model "${trimmed}" is not gpt-5-nano. Falling back to ${DEFAULT_OPENAI_MODEL}.`);
    return DEFAULT_OPENAI_MODEL;
  }

  return trimmed;
};

export const resolveOpenAIModel = () => normalizeModel(readCandidateModel());
export const OPENAI_MODEL = resolveOpenAIModel();
export { DEFAULT_OPENAI_MODEL };
