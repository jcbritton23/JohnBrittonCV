const DEFAULT_OPENAI_MODEL = 'gpt-5-nano';

const gatherCandidateEntries = () => {
  const entries = [];
  const pushEntry = (value, source) => {
    entries.push({ value: typeof value === 'string' ? value : value ?? '', source });
  };

  if (typeof process !== 'undefined' && process?.env) {
    pushEntry(process.env.OPENAI_RESPONSES_MODEL, 'process.env.OPENAI_RESPONSES_MODEL');
    pushEntry(process.env.OPENAI_MODEL, 'process.env.OPENAI_MODEL');
    pushEntry(process.env.VITE_OPENAI_MODEL, 'process.env.VITE_OPENAI_MODEL');
    pushEntry(process.env.PUBLIC_OPENAI_MODEL, 'process.env.PUBLIC_OPENAI_MODEL');
  }

  try {
    const metaEnv = typeof import.meta !== 'undefined' && import.meta?.env ? import.meta.env : null;
    if (metaEnv) {
      pushEntry(metaEnv.OPENAI_RESPONSES_MODEL, 'import.meta.env.OPENAI_RESPONSES_MODEL');
      pushEntry(metaEnv.OPENAI_MODEL, 'import.meta.env.OPENAI_MODEL');
      pushEntry(metaEnv.VITE_OPENAI_MODEL, 'import.meta.env.VITE_OPENAI_MODEL');
      pushEntry(metaEnv.PUBLIC_OPENAI_MODEL, 'import.meta.env.PUBLIC_OPENAI_MODEL');
    }
  } catch (error) {
    entries.push({
      value: '',
      source: 'import.meta.env',
      error: error instanceof Error ? error.message : String(error)
    });
  }

  return entries;
};

const pickFirstCandidate = (entries) => {
  for (const entry of entries) {
    if (typeof entry.value === 'string' && entry.value.trim()) {
      return { ...entry, trimmed: entry.value.trim() };
    }
  }
  return null;
};

const analyseModelSelection = () => {
  const candidates = gatherCandidateEntries();
  const chosen = pickFirstCandidate(candidates);

  let model = DEFAULT_OPENAI_MODEL;
  let enforcedDefault = true;
  let reason = 'no override provided';

  if (chosen) {
    const normalized = chosen.trimmed.toLowerCase();
    if (normalized.startsWith('gpt-5-nano')) {
      model = chosen.trimmed;
      enforcedDefault = false;
      reason = null;
    } else {
      reason = `override "${chosen.trimmed}" from ${chosen.source || 'unknown source'} is not gpt-5-nano`;
      console.warn(
        `Configured OpenAI model "${chosen.trimmed}" from ${chosen.source || 'unknown source'} is not gpt-5-nano. Falling back to ${DEFAULT_OPENAI_MODEL}.`
      );
    }
  }

  return {
    model,
    enforcedDefault,
    reason,
    rawCandidate: chosen ? chosen.value : '',
    candidateSource: chosen ? chosen.source || null : null,
    candidates
  };
};

let cachedDetails = null;

const getModelDetails = () => {
  if (!cachedDetails) {
    cachedDetails = analyseModelSelection();
  }
  return cachedDetails;
};

export const resolveOpenAIModel = () => getModelDetails().model;
export const OPENAI_MODEL = resolveOpenAIModel();
export const inspectOpenAIModelConfig = () => {
  const details = getModelDetails();
  return {
    model: details.model,
    enforcedDefault: details.enforcedDefault,
    reason: details.reason,
    rawCandidate: details.rawCandidate,
    candidateSource: details.candidateSource,
    candidates: details.candidates.map(entry => ({
      source: entry.source,
      value: entry.value,
      ...(entry.error ? { error: entry.error } : {})
    }))
  };
};

export const refreshOpenAIModelDiagnostics = () => {
  cachedDetails = analyseModelSelection();
  return inspectOpenAIModelConfig();
};

export const logOpenAIModelDiagnostics = (context = 'runtime') => {
  const details = inspectOpenAIModelConfig();
  const prefix = `[openaiModel:${context}]`;
  console.info(`${prefix} resolved model: ${details.model}`);
  if (details.enforcedDefault) {
    if (details.rawCandidate) {
      console.warn(
        `${prefix} ignored override "${details.rawCandidate}" from ${details.candidateSource || 'unknown source'}; enforcing ${DEFAULT_OPENAI_MODEL}.`
      );
    } else {
      console.info(`${prefix} no override detected; using default ${DEFAULT_OPENAI_MODEL}.`);
    }
  }

  const meaningfulCandidates = details.candidates.filter(entry => entry.value && entry.value.trim());
  if (meaningfulCandidates.length > 0) {
    console.info(
      `${prefix} candidate sources: ${meaningfulCandidates
        .map(entry => `${entry.source}="${entry.value.trim()}"`)
        .join(', ')}`
    );
  } else {
    console.info(`${prefix} no candidate environment variables supplied a model value.`);
  }
};

export { DEFAULT_OPENAI_MODEL };
