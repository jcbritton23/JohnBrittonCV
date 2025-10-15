const DEFAULT_OPENAI_MODEL = 'gpt-5-nano';

const collectCandidateEntries = () => {
  const entries = [];

  const add = (source, value, error) => {
    entries.push({ source, value, error });
  };

  if (typeof process !== 'undefined' && process?.env) {
    add('process.env.OPENAI_RESPONSES_MODEL', process.env.OPENAI_RESPONSES_MODEL);
    add('process.env.OPENAI_MODEL', process.env.OPENAI_MODEL);
    add('process.env.VITE_OPENAI_MODEL', process.env.VITE_OPENAI_MODEL);
    add('process.env.PUBLIC_OPENAI_MODEL', process.env.PUBLIC_OPENAI_MODEL);
  } else {
    add('process.env', undefined, 'process.env is not available in this runtime');
  }

  let metaEnv = null;
  let metaEnvHandled = false;
  try {
    metaEnv = typeof import.meta !== 'undefined' && import.meta?.env ? import.meta.env : null;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    add('import.meta.env', undefined, message);
    metaEnvHandled = true;
  }

  if (metaEnv) {
    add('import.meta.env.OPENAI_RESPONSES_MODEL', metaEnv.OPENAI_RESPONSES_MODEL);
    add('import.meta.env.OPENAI_MODEL', metaEnv.OPENAI_MODEL);
    add('import.meta.env.VITE_OPENAI_MODEL', metaEnv.VITE_OPENAI_MODEL);
    add('import.meta.env.PUBLIC_OPENAI_MODEL', metaEnv.PUBLIC_OPENAI_MODEL);
  } else if (!metaEnvHandled) {
    add('import.meta.env', undefined, metaEnv === null ? 'import.meta.env is not available in this runtime' : undefined);
  }

  return entries;
};

const readCandidateModel = (entries) => {
  for (const entry of entries) {
    if (typeof entry.value === 'string' && entry.value.trim().length > 0) {
      return { value: entry.value, source: entry.source };
    }
  }
  return { value: '', source: '' };
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

let cachedDiagnostics = null;

const computeDiagnostics = () => {
  const candidates = collectCandidateEntries();
  const { value: rawCandidate, source: candidateSource } = readCandidateModel(candidates);
  const normalized = normalizeModel(rawCandidate);
  const trimmedCandidate = typeof rawCandidate === 'string' ? rawCandidate.trim() : '';
  const candidateAllowed = Boolean(trimmedCandidate) && trimmedCandidate.toLowerCase().startsWith('gpt-5-nano');
  const enforcedDefault = !candidateAllowed;

  return {
    model: candidateAllowed ? normalized : DEFAULT_OPENAI_MODEL,
    enforcedDefault,
    rawCandidate: trimmedCandidate,
    candidateSource,
    candidates
  };
};

export const refreshOpenAIModelDiagnostics = () => {
  cachedDiagnostics = computeDiagnostics();
  return cachedDiagnostics;
};

export const getOpenAIModelDiagnostics = () => {
  if (!cachedDiagnostics) {
    cachedDiagnostics = computeDiagnostics();
  }
  return cachedDiagnostics;
};

export const resolveOpenAIModel = () => getOpenAIModelDiagnostics().model;

export const logOpenAIModelDiagnostics = (context) => {
  const details = getOpenAIModelDiagnostics();
  const prefix = context ? `[${context}] ` : '';

  if (details.enforcedDefault) {
    if (details.rawCandidate) {
      console.warn(
        `${prefix}Enforced ${DEFAULT_OPENAI_MODEL} because override "${details.rawCandidate}" from ${details.candidateSource || 'unknown source'} is not allowed.`
      );
    } else {
      console.info(`${prefix}Defaulting to ${DEFAULT_OPENAI_MODEL}; no override provided.`);
    }
  } else {
    console.info(`${prefix}Using OpenAI model ${details.model}.`);
  }

  return details;
};

export const OPENAI_MODEL = resolveOpenAIModel();
export { DEFAULT_OPENAI_MODEL };
