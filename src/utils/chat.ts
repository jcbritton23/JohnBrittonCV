import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = 'gpt-5-nano';

export async function simpleChat(prompt: string) {
  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: 'system', content: 'You are a helpful assistant for CV Q&A.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 300,
    temperature: 0.4
  });
  return completion.choices[0]?.message?.content || '';
} 