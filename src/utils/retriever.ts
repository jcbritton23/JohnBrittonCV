import { CVData, Chunk } from '../types';
import { supplementalContext } from '../data/supplementalContext';

// In a production environment, this would use vector embeddings and cosine similarity.
// For this project, we use a simpler keyword-based retrieval for cost-effectiveness.

export interface SearchResult {
  chunks: Chunk[];
  confidence: number;
}

/**
 * Generates searchable chunks from any section of the CV JSON.
 * Each object or sub-section becomes a chunk so every CV detail is discoverable.
 */
export const createChunks = (cvData: CVData): Chunk[] => {
  const chunks: Chunk[] = [];
  let chunkId = 0;

  const addChunk = (content: string, section: string, source: string) => {
    chunks.push({ id: `chunk-${chunkId++}`, content, section, source, score: 0 });
  };

  Object.entries(cvData as Record<string, any>).forEach(([section, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item: any) => {
        const source = item.organization || item.title || item.name || section;
        const parts: string[] = [];
        Object.entries(item).forEach(([key, val]) => {
          if (Array.isArray(val)) parts.push(`${key}: ${val.join(', ')}`);
          else parts.push(`${key}: ${val}`);
        });
        addChunk(parts.join('. '), section, source);
      });
    } else if (typeof value === 'object' && value !== null) {
      const parts = Object.entries(value).map(([k, v]) => `${k}: ${v}`);
      addChunk(parts.join('. '), section, section);
    }
  });

  return chunks;
};

/**
 * Enhanced search with query-type awareness
 */
export const searchChunks = (query: string, chunks: Chunk[]): SearchResult => {
  const lowerQuery = query.toLowerCase();
  const queryWords = lowerQuery.split(/\s+/).filter(word => word.length > 2);
  
  // Define boost factors for different query types
  const contextBoosts = {
    strengths: ['education', 'work', 'skills', 'achievements'],
    weaknesses: ['work', 'education', 'development'],
    clinical: ['work', 'clinical', 'therapy', 'treatment'],
    research: ['work', 'research', 'dissertation', 'publication'],
    academic: ['education', 'academic', 'research'],
    personal: ['basics', 'contact', 'background'],
    experience: ['work', 'clinical', 'research', 'teaching']
  };
  
  // Determine query context for boosting
  let queryContext = 'general';
  if (/strength|good|excel|positive|skilled|competent/.test(lowerQuery)) {
    queryContext = 'strengths';
  } else if (/weakness|challenge|improve|develop|growth|area.*development/.test(lowerQuery)) {
    queryContext = 'weaknesses';
  } else if (/clinical|therapy|treatment|patient|client/.test(lowerQuery)) {
    queryContext = 'clinical';
  } else if (/research|dissertation|study|methodology/.test(lowerQuery)) {
    queryContext = 'research';
  } else if (/education|degree|school|university|academic/.test(lowerQuery)) {
    queryContext = 'academic';
  } else if (/experience|background|work|position/.test(lowerQuery)) {
    queryContext = 'experience';
  }
  
  const scoredChunks = chunks.map(chunk => {
    let score = 0;
    const chunkContent = chunk.content.toLowerCase();
    
    // Base scoring: word matches
    queryWords.forEach(word => {
      if (chunkContent.includes(word)) {
        score += 1;
      }
    });
    
    // Context-based boosting
    const relevantSections = contextBoosts[queryContext as keyof typeof contextBoosts] || [];
    if (relevantSections.some(section => chunk.section.includes(section) || chunkContent.includes(section))) {
      score *= 1.5;
    }
    
    // Specific keyword boosting
    const keywordBoosts = {
      'john': 1.2,
      'britton': 1.2,
      'psychology': 1.3,
      'clinical': 1.3,
      'therapy': 1.3,
      'research': 1.2,
      'education': 1.2,
      'experience': 1.2,
      'supervision': 1.3,
      'training': 1.3,
      'internship': 1.4,
      'appic': 1.4
    };
    
    Object.entries(keywordBoosts).forEach(([keyword, boost]) => {
      if (chunkContent.includes(keyword)) {
        score *= boost;
      }
    });
    
    // Section-specific boosting
    const sectionBoosts = {
      'personalInfo': 1.1,
      'education': 1.2,
      'supervisedClinicalExperience': 1.3,
      'evidenceBasedProtocols': 1.2,
      'supervisoryExperience': 1.1,
      'researchExperience': 1.3,
      'teachingExperience': 1.2,
      'references': 1.1
    };
    
    const sectionBoost = sectionBoosts[chunk.section as keyof typeof sectionBoosts] || 1.0;
    score *= sectionBoost;
    
    return {
      ...chunk,
      score: score
    };
  });
  
  // Sort by score and return top results
  const sortedChunks = scoredChunks
    .filter(chunk => chunk.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8); // Limit to top 8 results
  
  const confidence = sortedChunks.length > 0 ? 
    Math.min(sortedChunks[0].score / 5, 1.0) : 0;
  
  return {
    chunks: sortedChunks,
    confidence: confidence
  };
};

/**
 * Enhanced retrieval with query-aware filtering
 */
export const getRelevantChunks = async (query: string, cvData: CVData): Promise<Chunk[]> => {
  const chunks = createChunks(cvData);
  const searchResult = searchChunks(query, chunks);

  // Apply minimum threshold
  const threshold = 0.5;
  const relevantChunks = searchResult.chunks.filter(chunk => chunk.score >= threshold).slice(0, 6);

  const supplementalChunks: Chunk[] = supplementalContext.map((item, index) => ({
    id: `supplemental-${index}`,
    content: item.content,
    section: `supplemental:${item.category}`,
    source: item.title,
    score: 1,
  }));

  return [...relevantChunks, ...supplementalChunks];
};

/**
 * Enhanced formatting for display
 */
export const formatChunkForDisplay = (chunk: Chunk): string => {
  return `**${chunk.source}**: ${chunk.content}`;
};

/**
 * Enhanced source information
 */
export const getSourceInfo = (chunk: Chunk): string => {
  return `${chunk.source} (${chunk.section})`;
}; 