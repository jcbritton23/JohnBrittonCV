import { SafetyFilter } from '../types';
import OpenAI from 'openai';

let openai: OpenAI;
try {
  console.log('Initializing OpenAI client in safety module...');
  const apiKey = (import.meta as any).env?.VITE_OPENAI_API_KEY || 
                 (import.meta as any).env?.OPENAI_API_KEY || 
                 process.env.REACT_APP_OPENAI_API_KEY ||
                 process.env.OPENAI_API_KEY;
  
  console.log('Safety module API Key available:', !!apiKey);
  
  openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
  });
  
  console.log('Safety module OpenAI client initialized successfully');
} catch (error) {
  console.error('Failed to initialize OpenAI client in safety module:', error);
  throw error;
}

// Enhanced safety filter for psychology/internship context
// More sophisticated content moderation for professional contexts

const PROFANITY_WORDS: string[] = [
  // Add any profanity words that should be filtered
];

const TOXIC_PATTERNS = [
  /kill/i,
  /harm/i,
  /hurt/i,
  /attack/i,
  /bomb/i,
  /weapon/i,
];

const PERSONAL_INFO_PATTERNS = [
  /ssn|social security/i,
  /credit card|cc number/i,
  /password/i,
  /bank account/i,
];

// Define acceptable query topics for John Britton's CV
const ACCEPTABLE_TOPICS = [
  // Core professional topics
  /john\s+britton/i,
  /education/i,
  /degree/i,
  /psychology/i,
  /clinical/i,
  /therapy/i,
  /music.therapy/i,
  /research/i,
  /experience/i,
  /training/i,
  /internship/i,
  /appic/i,
  /supervision/i,
  /assessment/i,
  /evaluation/i,
  /treatment/i,
  /evidence.based/i,
  /cv|resume/i,
  /background/i,
  /qualifications/i,
  /skills/i,
  /competencies/i,
  
  // Professional development topics
  /strength/i,
  /weakness/i,
  /challenge/i,
  /growth/i,
  /development/i,
  /improvement/i,
  /feedback/i,
  /learning/i,
  /professional/i,
  /career/i,
  /goals/i,
  /interests/i,
  /approach/i,
  /philosophy/i,
  /values/i,
  
  // Academic/research topics
  /dissertation/i,
  /thesis/i,
  /publication/i,
  /presentation/i,
  /conference/i,
  /methodology/i,
  /statistics/i,
  /data/i,
  /analysis/i,
  /findings/i,
  /results/i,
  
  // Clinical topics
  /client/i,
  /patient/i,
  /population/i,
  /intervention/i,
  /protocol/i,
  /cognitive/i,
  /behavioral/i,
  /cbt/i,
  /dbt/i,
  /act/i,
  /emdr/i,
  /trauma/i,
  /anxiety/i,
  /depression/i,
  /assessment/i,
  /testing/i,
  /diagnosis/i,
  /psychotherapy/i,
  
  // Internship/training topics
  /site/i,
  /program/i,
  /training.director/i,
  /supervisor/i,
  /mentor/i,
  /placement/i,
  /rotation/i,
  /practicum/i,
  /externship/i,
  /hours/i,
  /licensing/i,
  /certification/i,
  
  // Professional context questions
  /why/i,
  /how/i,
  /what/i,
  /when/i,
  /where/i,
  /who/i,
  /tell.me/i,
  /describe/i,
  /explain/i,
  /discuss/i,
  /share/i,
  /contact/i,
  /phone/i,
  /email/i,
  /address/i,
  /reference/i,
  /recommendation/i
];

/**
 * Enhanced query relevance checker for psychology/internship context
 */
export const isRelevantQuery = (query: string): boolean => {
  const lowerQuery = query.toLowerCase();
  
  // Check if query contains any acceptable topics
  const isTopicRelevant = ACCEPTABLE_TOPICS.some(pattern => pattern.test(lowerQuery));
  
  // Allow general conversational starters
  const conversationalStarters = [
    /^(hi|hello|hey|good morning|good afternoon|good evening)/i,
    /^(can you|could you|would you|will you)/i,
    /^(i would like|i want to|i need to)/i,
    /^(please|thank you|thanks)/i
  ];
  
  const isConversational = conversationalStarters.some(pattern => pattern.test(lowerQuery));
  
  // Reject clearly unrelated topics
  const unrelatedTopics = [
    /weather/i,
    /sports/i,
    /politics/i,
    /cooking/i,
    /travel/i,
    /movies/i,
    /music(?!.*therapy)/i, // Allow music therapy but not general music
    /technology(?!.*clinical)/i, // Allow clinical technology
    /shopping/i,
    /fashion/i,
    /celebrity/i,
    /gossip/i,
    /news(?!.*psychology)/i
  ];
  
  const isUnrelated = unrelatedTopics.some(pattern => pattern.test(lowerQuery));
  
  return (isTopicRelevant || isConversational) && !isUnrelated;
};

// Short, focused forbidden topics
const FORBIDDEN_PATTERNS = [
  /money|payment|cost|fee|price|insurance|billing|financial|charge|salary|wage|income|reimbursement|claim/i,
  /suicide|self[- ]?harm|kill myself|hurt myself|ending my life|overdose|cutting|risk of harm|homicide|violence|abuse|assault|danger to self|danger to others|crisis|emergency|911|hotline/i
];

export const sanitizeQuery = (query: string): SafetyFilter => {
  const originalQuery = query.trim();
  let sanitizedQuery = originalQuery;
  const warnings: string[] = [];

  // Check for forbidden topics
  const forbidden = FORBIDDEN_PATTERNS.some(pattern => pattern.test(sanitizedQuery));
  if (forbidden) {
    return {
      isSafe: false,
      sanitizedQuery,
      warnings: [
        "I'm sorry, I can't discuss that topic. Please ask about John's professional background, education, or experience."
      ]
    };
  }

  // Check for empty query
  if (!sanitizedQuery.trim()) {
    return {
      isSafe: false,
      sanitizedQuery: '',
      warnings: ['Please provide a valid question about John\'s background and experience.']
    };
  }

  // Check query length
  if (sanitizedQuery.length > 500) {
    warnings.push('Query is too long');
    sanitizedQuery = sanitizedQuery.substring(0, 500);
  }

  // Check for profanity
  const hasProfanity = PROFANITY_WORDS.some(word => 
    sanitizedQuery.toLowerCase().includes(word)
  );

  if (hasProfanity) {
    warnings.push('Query contains inappropriate language');
    sanitizedQuery = sanitizedQuery.replace(
      new RegExp(PROFANITY_WORDS.join('|'), 'gi'),
      '[REDACTED]'
    );
  }

  // Check for toxic patterns
  const hasToxicPatterns = TOXIC_PATTERNS.some(pattern => 
    pattern.test(sanitizedQuery)
  );

  if (hasToxicPatterns) {
    warnings.push('Query contains potentially harmful content');
    sanitizedQuery = sanitizedQuery.replace(
      /kill|harm|hurt|attack|bomb|weapon/gi,
      '[REDACTED]'
    );
  }

  // Check for personal information requests
  const hasPersonalInfo = PERSONAL_INFO_PATTERNS.some(pattern => 
    pattern.test(sanitizedQuery)
  );

  if (hasPersonalInfo) {
    warnings.push('Query requests personal information');
    sanitizedQuery = sanitizedQuery.replace(
      /ssn|social security|credit card|cc number|password|bank account/gi,
      '[REDACTED]'
    );
  }

  // Check topic relevance
  if (!isRelevantQuery(sanitizedQuery)) {
    return {
      isSafe: false,
      sanitizedQuery: sanitizedQuery,
      warnings: ['I can only answer questions about John\'s professional background, education, clinical experience, research, and qualifications for psychology internships. Please ask about his CV, training, or clinical work.']
    };
  }

  const isSafe = warnings.length === 0;

  return {
    isSafe,
    sanitizedQuery,
    warnings
  };
};

// --- OpenAI Moderation API ---
export async function moderateQueryOpenAI(query: string): Promise<{ flagged: boolean; categories?: any; }> {
  try {
    const moderation = await openai.moderations.create({ input: query });
    const result = moderation.results[0];
    return { flagged: result.flagged, categories: result.categories };
  } catch (error) {
    console.error('OpenAI Moderation API error:', error);
    // If moderation fails, default to not flagged (fail open, but log)
    return { flagged: false };
  }
}

export const validateResponse = (response: string): boolean => {
  // Check for potential hallucination indicators
  const hallucinationPatterns = [
    /i don't have access to/i,
    /i cannot provide/i,
    /i'm not able to/i,
    /i don't know/i,
    /i'm not sure/i,
  ];

  // Check for overly confident claims without citations
  const confidentPatterns = [
    /\bdefinitely\b/i,
    /\bcertainly\b/i,
    /\babsolutely\b/i,
    /\bwithout a doubt\b/i,
  ];

  // If response contains uncertainty patterns, it's likely safe
  if (hallucinationPatterns.some(pattern => pattern.test(response))) {
    return true;
  }

  // If response contains overly confident language without citations, flag it
  if (confidentPatterns.some(pattern => pattern.test(response)) && 
      !response.includes('according to') && 
      !response.includes('based on')) {
    return false;
  }

  return true;
};

export const rephraseNegativeResponse = (response: string): string => {
  // Rephrase negative or uncertain responses to be more helpful
  const negativePatterns = [
    {
      pattern: /i don't have that information/i,
      replacement: "I don't currently have that specific information in my knowledge base, but I can help you with other aspects of John's background and experience."
    },
    {
      pattern: /i cannot answer/i,
      replacement: "I may not have that specific detail, but I can share related information about John's qualifications and experience."
    },
    {
      pattern: /i don't know/i,
      replacement: "I don't have that particular information, but I can tell you about John's relevant experience and qualifications."
    }
  ];

  let rephrased = response;
  negativePatterns.forEach(({ pattern, replacement }) => {
    rephrased = rephrased.replace(pattern, replacement);
  });

  return rephrased;
};

export const addDisclaimers = (response: string): string => {
  // Add appropriate disclaimers for medical/clinical information
  const clinicalKeywords = [
    'diagnosis', 'treatment', 'therapy', 'clinical', 'patient',
    'assessment', 'intervention', 'psychology', 'mental health'
  ];

  const hasClinicalContent = clinicalKeywords.some(keyword => 
    response.toLowerCase().includes(keyword)
  );

  if (hasClinicalContent) {
    return response + "\n\n*Note: This information is for informational purposes only and should not be considered medical advice.*";
  }

  return response;
};

export const checkForPersonalData = (text: string): boolean => {
  // Check for potential personal data in responses
  const personalDataPatterns = [
    /\b\d{3}-\d{2}-\d{4}\b/, // SSN
    /\b\d{4}-\d{4}-\d{4}-\d{4}\b/, // Credit card
    /\b\d{3}-\d{3}-\d{4}\b/, // Phone
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
  ];

  return personalDataPatterns.some(pattern => pattern.test(text));
}; 