import { CVData, Chunk } from '../types';

// In a production environment, this would use vector embeddings and cosine similarity.
// For this project, we use a simpler keyword-based retrieval for cost-effectiveness.

export interface SearchResult {
  chunks: Chunk[];
  confidence: number;
}

/**
 * Creates searchable chunks from the raw CV JSON data.
 * This function iterates over all sections of the CV and flattens them into a single
 * array of "chunks" that can be searched for relevant information.
 */
export const createChunks = (cvData: CVData): Chunk[] => {
  const chunks: Chunk[] = [];
  let chunkId = 0;

  // Helper to create a chunk and add it to the list
  const addChunk = (content: string, section: string, source: string) => {
    chunks.push({
      id: `chunk-${chunkId++}`,
      content,
      section,
      source,
      score: 0,
    });
  };

  // 1. Personal Info
  if (cvData.personalInfo) {
    const { name, address, phone, email } = cvData.personalInfo;
    addChunk(
      `Contact Information for ${name}: Address is ${address}, Phone is ${phone}, Email is ${email}.`,
      'personalInfo',
      'Personal Info'
    );
  }

  // 2. Education
  if (cvData.education) {
    cvData.education.forEach((edu) => {
      addChunk(
        `${edu.degree} from ${edu.institution} (${edu.location}), expected ${edu.date}. ${edu.details || ''}`,
        'education',
        `Education: ${edu.degree}`
      );
    });
  }

  // 3. Supervised Clinical Experience
  if (cvData.supervisedClinicalExperience) {
    cvData.supervisedClinicalExperience.forEach((exp) => {
      const supervisor = exp.supervisor || (Array.isArray(exp.supervisors) ? exp.supervisors.join(', ') : exp.supervisors) || 'N/A';
      const baseInfo = `${exp.position} at ${exp.organization} (${exp.location}) from ${exp.dates}, supervised by ${supervisor}.`;
      addChunk(baseInfo, 'supervisedClinicalExperience', `Clinical Experience: ${exp.organization}`);
      if (exp.responsibilities) {
        exp.responsibilities.forEach((resp) => {
          addChunk(`${baseInfo} Responsibility: ${resp}`, 'supervisedClinicalExperience', `Clinical Experience: ${exp.organization}`);
        });
      }
    });
  }

  // 4. Evidence-Based Protocols
  if (cvData.evidenceBasedProtocols) {
    Object.entries(cvData.evidenceBasedProtocols).forEach(([category, protocols]) => {
      if (Array.isArray(protocols)) {
        addChunk(
          `Trained in ${category.replace(/([A-Z])/g, ' $1')} protocols: ${protocols.join(', ')}.`,
          'evidenceBasedProtocols',
          `Evidence-Based Protocols: ${category}`
        );
      }
    });
  }

  // 5. Supervisory Experience
  if (cvData.supervisoryExperience) {
    cvData.supervisoryExperience.forEach((exp) => {
        const baseInfo = `Peer Supervisor at ${exp.organization} from ${exp.dates}, supervised by ${exp.supervisor}.`;
        addChunk(baseInfo, 'supervisoryExperience', `Supervisory Experience: ${exp.organization}`);
        if(exp.responsibilities) {
            exp.responsibilities.forEach((resp) => {
                addChunk(`${baseInfo} Responsibility: ${resp}`, 'supervisoryExperience', `Supervisory Experience: ${exp.organization}`);
            });
        }
    });
  }

  // Add other sections similarly...
  // Research, Teaching, Honors, Presentations, etc.

  // 6. Research Experience
  if (cvData.researchExperience) {
    cvData.researchExperience.forEach((exp) => {
      const supervisor = exp.supervisor || exp.chair || 'N/A';
      const baseInfo = `${exp.title || exp.type} at ${exp.institution} (${exp.dates}), supervised by ${supervisor}.`;
      addChunk(baseInfo, 'researchExperience', `Research: ${exp.title || exp.type}`);
      if (exp.description) {
        exp.description.forEach((desc) => {
          addChunk(`${baseInfo} Description: ${desc}`, 'researchExperience', `Research: ${exp.title || exp.type}`);
        });
      }
    });
  }

  // 7. Teaching Experience
  if (cvData.teachingExperience) {
      cvData.teachingExperience.forEach((exp) => {
          const baseInfo = `${exp.position} for ${exp.course} at ${exp.institution} (${exp.dates}).`;
          addChunk(baseInfo, 'teachingExperience', `Teaching: ${exp.course}`);
          if (exp.description) {
              exp.description.forEach((desc) => {
                  addChunk(`${baseInfo} Description: ${desc}`, 'teachingExperience', `Teaching: ${exp.course}`);
              });
          }
      });
  }

  // 8. References
  if (cvData.references) {
    cvData.references.forEach((ref) => {
      addChunk(
        `Reference: ${ref.name}, ${ref.title} at ${ref.organization}. Contact: ${ref.email}, ${ref.phone}`,
        'references',
        `Reference: ${ref.name}`
      );
    });
  }


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
  const relevantChunks = searchResult.chunks.filter(chunk => chunk.score >= threshold);
  
  return relevantChunks.slice(0, 6); // Return top 6 most relevant chunks
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