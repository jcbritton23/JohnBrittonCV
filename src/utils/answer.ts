import { getRelevantChunks } from './retriever';
import { sanitizeQuery } from './safety';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = 'gpt-5-nano';

export async function simpleGenerateAnswer(question: string, cvData: any) {
  const safetyResult = sanitizeQuery(question);
  if (!safetyResult.isSafe) {
    return { content: safetyResult.warnings[0] || 'Unsafe query', error: true };
  }
  const chunks = await getRelevantChunks(question, cvData);
  const context = chunks.map(chunk => chunk.content).join('\n');
  const sources = chunks.map(chunk => chunk.source);
  const prompt = `You are an expert assistant answering questions about John Britton's CV. Use only the provided context. Cite sources if possible.\n\nContext:\n${context}\n\nUser question: ${question}`;
  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: 'You are a helpful assistant for CV Q&A.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 300,
    temperature: 0.4
  });
  return { content: completion.choices[0]?.message?.content || '', sources };
} 