import { getRelevantChunks } from './retriever';
import { sanitizeQuery } from './safety';
import OpenAI from 'openai';
import { OPENAI_MODEL } from '../../openaiModel.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = OPENAI_MODEL;

const extractResponseText = (response: any): string => {
  if (!response) return '';
  if (typeof response.output_text === 'string' && response.output_text.trim()) {
    return response.output_text;
  }
  const output = response.output;
  if (Array.isArray(output)) {
    for (const item of output) {
      if (Array.isArray(item.content)) {
        for (const part of item.content) {
          if (typeof part.text === 'string' && part.text.trim()) {
            return part.text;
          }
        }
      }
    }
  }
  return '';
};

export async function simpleGenerateAnswer(question: string, cvData: any) {
  const safetyResult = sanitizeQuery(question);
  if (!safetyResult.isSafe) {
    return { content: safetyResult.warnings[0] || 'Unsafe query', error: true };
  }
  const chunks = await getRelevantChunks(question, cvData);
  const context = chunks.map(chunk => chunk.content).join('\n');
  const sources = Array.from(new Set(chunks.map(chunk => chunk.source)));
  const prompt = `You are an expert assistant answering questions about John Britton's CV. Use only the provided context. Cite sources if possible.\n\nContext:\n${context}\n\nUser question: ${question}`;
  const completion = await openai.responses.create({
    model: MODEL,
    input: [
      {
        role: 'system',
        content: [
          { type: 'text', text: 'You are a helpful assistant for CV Q&A.' }
        ]
      },
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt }
        ]
      }
    ],
    max_output_tokens: 300,
    temperature: 0.4
  });
  return { content: extractResponseText(completion), sources };
}