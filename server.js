import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

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

const openai = new OpenAI({ apiKey: process.env.VITE_OPENAI_API_KEY });
const MODEL = 'gpt-5-nano';

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
    if (Array.isArray(value)) {
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
      const parts = Object.entries(value).map(([k, v]) => `${k}: ${v}`);
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

// --- Minimal safety filter ---
const FORBIDDEN_PATTERNS = [
  /suicide|self[- ]?harm|kill myself|hurt myself|ending my life|overdose|cutting|risk of harm|homicide|violence|abuse|assault|danger to self|danger to others|crisis|emergency|911|hotline/i,
  /credit card|ssn|social security|password|bank account|routing number/i
];

const sanitizeQuery = (query) => {
  const text = query.trim();
  if (!text) {
    return { isSafe: false, sanitizedQuery: '', warnings: ['Please provide a valid question.'] };
  }
  if (FORBIDDEN_PATTERNS.some(p => p.test(text))) {
    return { isSafe: false, sanitizedQuery: text, warnings: ["I'm sorry, I can't discuss that topic."] };
  }
  if (text.length > 500) {
    return { isSafe: true, sanitizedQuery: text.slice(0, 500), warnings: ['Query truncated to 500 characters.'] };
  }
  return { isSafe: true, sanitizedQuery: text, warnings: [] };
};

// --- Chat endpoint ---
app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body.message || 'Hello';
    const safety = sanitizeQuery(userMessage);
    if (!safety.isSafe) {
      return res.json({ answer: safety.warnings[0] });
    }

    const relevant = getRelevantChunks(safety.sanitizedQuery);
    const context = relevant.map(c => c.content).join('\n');

    const systemPrompt = `You are a helpful assistant that answers questions about John Britton's professional background and qualifications. Keep responses concise, organized in short theme-based paragraphs, and use markdown when helpful. Maintain a balanced, professional tone that shares accomplishments factually without exaggeration or superlatives, and avoid phrases that imply perfection.\n\nCV context:\n${context}`;

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: safety.sanitizedQuery }
      ]
    });

    const rawAnswer = completion.choices[0].message.content;
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

