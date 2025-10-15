import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { OPENAI_MODEL, logOpenAIModelDiagnostics } from './openaiModel.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Load CV data once at startup
let cvData = {};
try {
  const cvPath = path.join(process.cwd(), 'cv_json_data.json');
  cvData = JSON.parse(fs.readFileSync(cvPath, 'utf8'));
  console.log('CV data loaded. Sections:', Object.keys(cvData).length);
} catch (err) {
  console.error('Failed to load CV data:', err.message);
}

const openAIApiKey = process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
let openai = null;

if (!openAIApiKey) {
  console.warn('OpenAI API key not found. Chat assistant will be disabled.');
} else {
  openai = new OpenAI({ apiKey: openAIApiKey });
}

const MODEL = OPENAI_MODEL;
if (openai) {
  console.log(`OpenAI model configured: ${MODEL}`);
  logOpenAIModelDiagnostics('server');
}

const extractResponseText = (response) => {
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

// --- Response formatter to keep paragraphs short ---
const formatResponse = (text) => {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const paragraphs = [];
  let current = [];
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

// --- Simple RAG implementation ---
const createChunks = (data) => {
  const chunks = [];
  let id = 0;
  const addChunk = (content, section, source) => {
    chunks.push({ id: `chunk-${id++}`, content, section, source });
  };

  Object.entries(data).forEach(([section, value]) => {
    if (section === 'essayInsights' && Array.isArray(value)) {
      value.forEach((item, itemIndex) => {
        const metadata = [];
        if (item.title) metadata.push(`title: ${item.title}`);
        if (item.category) metadata.push(`category: ${item.category}`);
        if (Array.isArray(item.keywords) && item.keywords.length > 0) {
          metadata.push(`keywords: ${item.keywords.join(', ')}`);
        }

        const title = item.title || `Essay Insight ${itemIndex + 1}`;
        const paragraphs = typeof item.content === 'string'
          ? item.content.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean)
          : [];

        if (paragraphs.length === 0) {
          if (typeof item.content === 'string' && item.content.trim()) {
            addChunk([...metadata, `content: ${item.content}`].join('. '), section, title);
          }
          return;
        }

        paragraphs.forEach((paragraph, paragraphIndex) => {
          const label = paragraphs.length > 1
            ? `${title} (Part ${paragraphIndex + 1})`
            : title;
          addChunk([...metadata, `narrative: ${paragraph}`].join('. '), section, label);
        });
      });
    } else if (section === 'personalInsights' && value && typeof value === 'object') {
      Object.entries(value).forEach(([key, insight]) => {
        if (typeof insight === 'string' && insight.trim()) {
          addChunk(`${key}: ${insight}`, section, `${section}:${key}`);
        }
      });
    } else if (Array.isArray(value)) {
      value.forEach((item) => {
        const source = item.organization || item.title || item.name || section;
        const parts = [];
        Object.entries(item).forEach(([key, val]) => {
          if (Array.isArray(val)) parts.push(`${key}: ${val.join(', ')}`);
          else parts.push(`${key}: ${val}`);
        });
        addChunk(parts.join('. '), section, source);
      });
    } else if (typeof value === 'object' && value !== null) {
      const parts = Object.entries(value).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`);
      addChunk(parts.join('. '), section, section);
    }
  });
  return chunks;
};

const allChunks = createChunks(cvData);

const searchChunks = (query, chunks) => {
  const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  return chunks
    .map(chunk => {
      const text = chunk.content.toLowerCase();
      let score = 0;
      words.forEach(w => { if (text.includes(w)) score += 1; });
      return { ...chunk, score };
    })
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
};

const getRelevantChunks = (query) => searchChunks(query, allChunks).slice(0, 6);

const sanitizeQuery = (query) => {
  const text = query.trim();
  if (!text) {
    return { isSafe: false, sanitizedQuery: '', warnings: ['Please provide a valid question.'] };
  }
  const warnings = [];
  let sanitized = text;
  if (text.length > 1000) {
    sanitized = text.slice(0, 1000);
    warnings.push('Query truncated to 1000 characters.');
  }
  return { isSafe: true, sanitizedQuery: sanitized, warnings };
};

// --- Chat endpoint ---
app.post('/api/chat', async (req, res) => {
  if (!openai) {
    return res.json({ answer: 'The AI assistant is currently unavailable because no API key is configured.' });
  }

  try {
    const userMessage = req.body.message || 'Hello';
    const safety = sanitizeQuery(userMessage);
    if (!safety.isSafe) {
      return res.json({ answer: safety.warnings[0] });
    }

    const relevant = getRelevantChunks(safety.sanitizedQuery);
    const context = relevant.map(c => c.content).join('\n');

    const systemPrompt = `You are a helpful assistant for questions related to John Britton. Use the CV data, essays, and any other provided context to craft the most informative response you can. If the request goes beyond the available information, be transparent about the limits while still offering your best synthesis or inference grounded in the supplied material. Keep responses concise, organized in short theme-based paragraphs, and use markdown when helpful. Maintain a balanced, professional tone that shares accomplishments factually without exaggeration or superlatives, and avoid phrases that imply perfection.\n\nCV context:\n${context}`;

    const completion = await openai.responses.create({
      model: MODEL,
      input: [
        {
          role: 'system',
          content: [
            { type: 'text', text: systemPrompt }
          ]
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: safety.sanitizedQuery }
          ]
        }
      ],
      max_output_tokens: 300,
      temperature: 0.4
    });

    const rawAnswer = extractResponseText(completion);
    const answer = formatResponse(rawAnswer);
    res.json({ answer });
  } catch (err) {
    console.error('OpenAI error:', err.message);
    res.json({ answer: 'Error: Could not connect to OpenAI' });
  }
});

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'dist')));
app.use((_, res) =>
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
);

const PORT = 5050;
app.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`);
});

