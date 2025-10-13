# Enhanced Model Control Strategy

_Last updated: June 2024 — Now uses a modular, multi-stage backend pipeline for cost-effective, safe, and professional CV Q&A._

## Overview

The current system uses a secure, server-side, multi-stage pipeline to generate accurate, safe, and cost-effective answers to user queries about the CV. All model calls and logic are handled on the backend, ensuring API key security and full control over cost and extensibility.

## Pipeline Stages

1. **Rules-Based Safety Check**
   - All queries are first screened using a rules-based filter (forbidden topics, relevance, etc.).
   - Unsafe or off-topic queries are rejected before any model call.
   - (Optional: Add OpenAI Moderation API for additional safety.)

2. **Retrieval-Augmented Generation (RAG) with GPT-5-nano**
   - Relevant CV context is retrieved and optionally summarized using GPT-5-nano.
   - Summarization is triggered for long context to keep downstream costs low while keeping model usage consistent.

3. **Optional Strengths/Positive/APA Compliance Rewriter (GPT-5-nano)**
   - If the query requests strengths, positive framing, or APA compliance, a GPT-5-nano call rewrites the query or context accordingly.
   - This stage is modular and can be extended or toggled as needed without switching models.

4. **Final Synthesis with GPT-5-nano**
   - The final answer is generated using GPT-5-nano, using the (possibly summarized and rewritten) context and query.
   - The answer is polished, professional, and cites sources where possible.

## Key Benefits

- **Cost Control:** Every stage reuses GPT-5-nano, enabling a single rate card and predictable spend.
- **Security:** No API keys or model logic in the frontend; all sensitive logic is server-side.
- **Extensibility:** Each stage is modular and can be adjusted, extended, or toggled via backend code.
- **Safety:** Multi-layered safety checks before any user-facing answer is generated.
- **Transparency:** (Optional) The frontend can display a summary of the answer generation process for user trust.

## Example Pipeline Flow

1. User submits a query: "What are John's greatest strengths as a clinician?"
2. Backend runs rules-based safety check (rejects if unsafe).
3. Backend retrieves relevant CV context and summarizes it with GPT-5-nano if needed.
4. Backend detects "strengths" and rewrites the query for positive framing with GPT-5-nano.
5. Backend sends the rewritten query and summarized context to GPT-5-nano for final answer synthesis.
6. Backend returns the answer and sources to the frontend.

## How to Adjust or Extend the Pipeline

- **Add a new stage:** Insert a new function in the backend pipeline (e.g., for APA compliance, tone adjustment, etc.).
- **Change models:** Update the model constants in `api/chat.ts`.
- **Toggle stages:** Use simple conditionals to enable/disable stages based on query content or config.
- **Add safety layers:** Integrate OpenAI Moderation API or other filters as needed.

## Implementation Notes

- All model calls are server-side for security and cost control.
- The pipeline is easy to extend for new document types, compliance checks, or answer styles.
- Error handling is robust and user-friendly; all errors are caught and returned as clear messages.

## Previous Strategy (Deprecated)

- The previous system used client-side cost tracking, ensemble/multi-model logic, and session budget logic. This has been replaced by the new backend pipeline for simplicity, security, and maintainability. 