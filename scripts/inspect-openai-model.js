#!/usr/bin/env node
import { refreshOpenAIModelDiagnostics, DEFAULT_OPENAI_MODEL } from '../openaiModel.js';

const details = refreshOpenAIModelDiagnostics();

console.log('OpenAI model resolution diagnostics');
console.log('------------------------------------');
console.log(`Resolved model: ${details.model}`);
if (details.enforcedDefault) {
  if (details.rawCandidate) {
    console.log(
      `Enforced default model (${DEFAULT_OPENAI_MODEL}) because override "${details.rawCandidate}" from ${details.candidateSource || 'unknown source'} is not allowed.`
    );
  } else {
    console.log(`No override detected; defaulting to ${DEFAULT_OPENAI_MODEL}.`);
  }
} else {
  console.log('Using provided override that already targets gpt-5-nano.');
}

if (details.candidates.length === 0) {
  console.log('No candidate environment variables were found.');
} else {
  console.log('\nCandidate values (in evaluation order):');
  details.candidates.forEach((entry, index) => {
    const label = entry.source || `candidate-${index + 1}`;
    const value = entry.value ? entry.value : '(empty)';
    console.log(`  ${index + 1}. ${label}: ${value}`);
    if (entry.error) {
      console.log(`     ↳ Error reading source: ${entry.error}`);
    }
  });
}
