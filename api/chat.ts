import OpenAI from 'openai';
import { sanitizeQuery } from '../src/utils/safety';
import { getRelevantChunks } from '../src/utils/retriever';
import cvData from '../cv_json_data.json';
import { OPENAI_MODEL } from '../openaiModel.js';

// Use only VITE_OPENAI_API_KEY for maximum Vite compatibility
const openai = new OpenAI({ apiKey: process.env.VITE_OPENAI_API_KEY });
const MODEL = OPENAI_MODEL;

logOpenAIModelDiagnostics('api/chat');

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

const formatResponse = (text: string) => {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const paragraphs: string[] = [];
  let current: string[] = [];
  for (const sentence of sentences) {
    current.push(sentence);
    if (current.length >= 2) {
      paragraphs.push(current.join(' '));
      current = [];
    }
  }
  if (current.length) paragraphs.push(current.join(' '));
  return paragraphs.join('\n\n');
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid query' });
  }

  // Safety check
  const safety = sanitizeQuery(query);
  if (!safety.isSafe) {
    return res.status(400).json({ error: safety.warnings[0] || 'Unsafe query' });
  }

  // Retrieve relevant CV context
  const chunks = await getRelevantChunks(safety.sanitizedQuery, cvData);
  const context = chunks.map(chunk => chunk.content).join('\n');
  const sources = Array.from(new Set(chunks.map(chunk => chunk.source)));

  // Compose prompt
  const prompt = `You are an expert assistant answering questions about John Britton's CV. Use only the provided context. Cite sources if possible.\n\nContext:\n${context}\n\nUser question: ${safety.sanitizedQuery}`;

  try {
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
    const raw = extractResponseText(completion);
    const answer = formatResponse(raw);
    return res.status(200).json({ answer, sources });
  } catch (error) {
    console.error('OpenAI error:', error);
    if (error && typeof error === 'object') {
      try { console.error('OpenAI error details:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2)); } catch (e) { console.error('Error stringifying OpenAI error:', e); }
    }
    return res.status(500).json({ error: 'AI service error. Please try again later.' });
  }
} 