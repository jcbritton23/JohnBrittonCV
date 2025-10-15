import { describe, it, expect } from 'vitest';
import cvDataRaw from '../../../cv_json_data.json';
import { createChunks } from '../retriever';
import type { CVData } from '../../types';
import { supplementalContext } from '../../data/supplementalContext';

const cvData = cvDataRaw as CVData;

describe('retriever essay integration', () => {
  it('includes essay insight narratives in generated chunks', () => {
    const chunks = createChunks(cvData);
    const essayChunks = chunks.filter((chunk) => chunk.section === 'essayInsights');

    expect(essayChunks.length).toBeGreaterThan(0);
    expect(
      essayChunks.some((chunk) =>
        chunk.content.toLowerCase().includes('music performance anxiety')
      )
    ).toBe(true);
  });

  it('exposes supplemental context derived from essays', () => {
    expect(supplementalContext.length).toBeGreaterThan(0);
    expect(supplementalContext[0].content).toContain('My dad once set colorful beads');
  });
});
