import OpenAI from 'openai';
import { sanitizeQuery } from '../src/utils/safety';
import { getRelevantChunks } from '../src/utils/retriever';
import cvData from '../cv_json_data.json';

// Use only VITE_OPENAI_API_KEY for maximum Vite compatibility
const openai = new OpenAI({ apiKey: process.env.VITE_OPENAI_API_KEY });
const MODEL = 'gpt-4o-mini';

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
  const chunks = await getRelevantChunks(query, cvData);
  const context = chunks.map(chunk => chunk.content).join('\n');
  const sources = chunks.map(chunk => chunk.source);

  // Compose prompt
  const prompt = `You are an expert assistant answering questions about John Britton's CV. Use only the provided context. Cite sources if possible.\n\nContext:\n${context}\n\nUser question: ${query}`;

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: 'You are a helpful assistant for CV Q&A.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 300,
      temperature: 0.4
    });
    const answer = completion.choices[0]?.message?.content || '';
    return res.status(200).json({ answer, sources });
  } catch (error) {
    console.error('OpenAI error:', error);
    if (error && typeof error === 'object') {
      try { console.error('OpenAI error details:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2)); } catch (e) { console.error('Error stringifying OpenAI error:', e); }
    }
    return res.status(500).json({ error: 'AI service error. Please try again later.' });
  }
} 