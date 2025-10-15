import cvData from '../../cv_json_data.json';
import type { CVData, EssayInsight } from '../types';

export interface SupplementalContextItem extends EssayInsight {
  category: EssayInsight['category'];
}

const typedData = cvData as CVData;

const normalizeKeywords = (keywords: unknown): string[] => {
  if (Array.isArray(keywords)) {
    return keywords.map(keyword => String(keyword));
  }
  return [];
};

const toSupplementalItem = (insight: EssayInsight, index: number): SupplementalContextItem => {
  const normalizedKeywords = normalizeKeywords(insight.keywords);
  const trimmedContent = insight.content?.trim() ?? '';

  return {
    id: insight.id || `essay-${index}`,
    title: insight.title || `Essay Insight ${index + 1}`,
    category: insight.category || 'narrative',
    keywords: normalizedKeywords,
    content: trimmedContent,
  };
};

export const supplementalContext: SupplementalContextItem[] =
  (typedData.essayInsights ?? []).map(toSupplementalItem);

export const supplementalContextText = supplementalContext
  .map((item) => `${item.title}: ${item.content}`)
  .join('\n\n');
