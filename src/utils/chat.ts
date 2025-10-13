import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = 'gpt-5-nano';

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

export async function simpleChat(prompt: string) {
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
  return extractResponseText(completion);
}