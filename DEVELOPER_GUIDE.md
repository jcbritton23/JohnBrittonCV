# John Britton's Interactive CV Developer Guide

_Last updated: June 2024 — Enhanced Model Strategy, cost tracking, and safety pipeline now fully implemented._

---

## 1. Overview

**Design Philosophy & Goals**

* **Professional Excellence:** Clean, APA‑compliant formatting that exceeds APPIC standards.
* **Intelligent Integration:** AI features enhance rather than distract.
* **Accessibility First:** WCAG 2.1 AA compliance with full keyboard navigation & screen‑reader labels.
* **Progressive Enhancement:** Core CV renders perfectly without JavaScript; AI and timeline layers load only if JS available.

**Target Audience**

1. APPIC internship reviewers & training directors
2. Professional colleagues / collaborators
3. Students & peers exploring AI in psychology

---

## 2. Visual Design System

### 2.1 Color Palette

```css
:root {
  /* Primary */
  --primary-blue: #1e3a8a;   /* Deep professional blue */
  --secondary-blue: #3b82f6; /* Bright accent blue */
  --accent-gold: #f59e0b;    /* Sophisticated gold */

  /* Neutrals */
  --text-primary: #111827;   /* Nearly black */
  --text-secondary: #6b7280; /* Medium gray */
  --background: #ffffff;     /* White */
  --surface: #f8fafc;        /* Light surface */
  --border: #e5e7eb;         /* Subtle border */

  /* Semantic */
  --success: #10b981;
  --warning: #f59e0b;
  --error:   #ef4444;
  --info:    #3b82f6;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0,0,0,.05);
  --shadow:    0 4px 6px -1px rgba(0,0,0,.1);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,.1);
  --shadow-xl: 0 20px 25px -5px rgba(0,0,0,.1);
}
```

### 2.2 Typography

```css
/* Base Font Stack */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Scale */
--text-xs: 0.75rem;  /* 12px */
--text-sm: 0.875rem; /* 14px */
--text-base: 1rem;   /* 16px */
--text-lg: 1.125rem; /* 18px */
--text-xl: 1.25rem;  /* 20px */
--text-2xl: 1.5rem;  /* 24px */
--text-3xl: 1.875rem;/* 30px */
--text-4xl: 2.25rem; /* 36px */

/* Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line‑Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
```

### 2.3 Spacing

```css
/* 8‑px base unit */
--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem;  /* 8px */
--space-3: 0.75rem; /* 12px */
--space-4: 1rem;    /* 16px */
--space-5: 1.25rem; /* 20px */
--space-6: 1.5rem;  /* 24px */
--space-8: 2rem;    /* 32px */
```

---

## 3. Privacy & Data Flow

1. **Privacy Notice (footer):**

   > *"Privacy Notice:*
   > *This site uses the OpenAI API to process chatbot queries in real time. No personal data beyond your queries is stored; logs are anonymized."*
2. **Data Flow:**

   * **User** types question → Chatbot component captures input.
   * **Pre‑processing:** Sanitize input, run tone/safety filter.
   * **Retrieval:** Vector‑search top K chunks from `resume.json` + supplemental docs embeddings.
   * **LLM Call:** Send sanitized query + context to OpenAI API.
   * **Post‑processing:** Re‑phrase negative or uncertain answers positively.
   * **UI:** Display answer with citations (optionally highlight source bullet on page).

---

## 4. Tech Stack (Free & AI‑Friendly)

| Tier        | Technology                              | Why It's Free & AI‑Easy                           |
| ----------- | --------------------------------------- | ------------------------------------------------- |
| Framework   | React + Vite (or Create‑React‑App)      | Zero‑cost, broad Cursor support                   |
| Language    | TypeScript                              | AI loves annotated types; prevents runtime errors |
| Styling     | Tailwind CSS                            | Utility‑first, minimal custom CSS                 |
| Icons & UI  | shadcn/ui (headless) + lucide‑react     | MIT license; integrates with Tailwind             |
| Timeline    | react‑vertical‑timeline‑component       | Free MIT; easy props                              |
| Chatbot SDK | `openai` JS SDK + optional LangChain JS | OpenAI free quota; LangChain open source          |
| Data Schema | JSON Resume                             | Community‑standard; extensible                    |
| Hosting     | GitHub Pages (or Netlify Free)          | No cost; CI/CD via Actions                        |

---

## 5. Project Structure

```
/├── public/            # Static assets (favicon, robots.txt)
├── src/                # App source code
│   ├── components/     # Reusable UI pieces
│   │   ├── LeftNav.tsx
│   │   ├── CVSection.tsx
│   │   ├── Timeline.tsx
│   │   └── Chatbot.tsx
│   ├── data/           # JSON data & embeddings
│   │   └── resume.json
│   ├── styles/         # Tailwind config + globals.css
│   ├── utils/          # Retrieval, safety, formatting helpers
│   ├── pages/          # If using Vite: App.tsx as entry
│   └── main.tsx        # React root
├── .github/            # GitHub Actions workflows
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 6. JSON Schema & Data Source

* We use a custom JSON structure optimized for APA/APPIC CV requirements, stored in `cv_json_data.json`.

### 6.1. Current Data Structure

The CV uses the following main sections:

| JSON Key                      | CV Section                                          |
| ----------------------------- | --------------------------------------------------- |
| `personalInfo`                | Name, address, phone, email                         |
| `education`                   | Education entries with degrees and institutions     |
| `supervisedClinicalExperience`| Supervised Clinical Experience                      |
| `evidenceBasedProtocols`      | Evidence-Based Protocols (categorized)             |
| `supervisoryExperience`       | Supervisory Experience                              |
| `additionalClinicalExperience`| Additional Clinical Experience                      |
| `specialProjects`             | Special Projects                                    |
| `researchExperience`          | Research Experience                                 |
| `teachingExperience`          | Teaching Experience                                 |
| `honorsAndAwards`             | Honors & Awards                                     |
| `presentations`               | Conference & Professional Presentations             |
| `administrativeRoles`         | Administrative Roles                                |
| `technologyTools`             | Technology Tools (categorized)                     |
| `professionalMemberships`     | Professional Memberships & Affiliations             |
| `trainingAndEducation`        | Selected Trainings & Continuing Education           |
| `communityService`            | Community Service                                   |
| `references`                  | References                                          |

### 6.2. Data Structure Examples

* **Personal Information**

  ```jsonc
  "personalInfo": {
    "name": "John Britton",
    "address": "1952 Cobblestone Way S, Terre Haute, IN 47802",
    "phone": "(615) 485-2333",
    "email": "jbritton10@sycamores.indstate.edu"
  }
  ```

* **Education**

  ```jsonc
  "education": [
    {
      "degree": "Doctor of Clinical Psychology (Psy.D.)",
      "institution": "Indiana State University (ISU)",
      "location": "Terre Haute, IN",
      "date": "May 2027 (Expected)",
      "details": "Current GPA: 4.0"
    }
  ]
  ```

* **Supervised Clinical Experience**

  ```jsonc
  "supervisedClinicalExperience": [
    {
      "position": "Graduate Student Clinician",
      "organization": "Murphy, Urban, & Associates",
      "location": "Terre Haute, IN",
      "dates": "June 2025 - Present",
      "supervisor": "Thomas Rea, Psy.D., HSPP",
      "responsibilities": [
        "Provided individual psychotherapy services to child, adolescent, and adult clients in a private practice setting",
        "Completed comprehensive integrative psychological evaluations using cognitive ability, academic achievement, and objective personality measures"
      ]
    }
  ]
  ```

* **Evidence-Based Protocols**

  ```jsonc
  "evidenceBasedProtocols": {
    "cognitiveAndBehavioral": [
      "Cognitive Behavioral Therapy (CBT)",
      "Cognitive Processing Therapy (CPT)",
      "Prolonged Exposure (PE)"
    ],
    "parentingAndChild": [
      "Parent-Child Interaction Therapy (PCIT)",
      "Trauma-Focused CBT (TF-CBT)"
    ],
    "traumaFocused": [
      "Eye Movement Desensitization and Reprocessing (EMDR)",
      "Cognitive Processing Therapy (CPT)"
    ],
    "thirdWave": [
      "Acceptance and Commitment Therapy (ACT)",
      "Dialectical Behavior Therapy (DBT)"
    ]
  }
  ```

* **Research Experience**

  ```jsonc
  "researchExperience": [
    {
      "title": "Doctoral Dissertation",
      "institution": "Indiana State University",
      "dates": "February 2025 - Present",
      "position": "Principal Investigator",
      "supervisor": "Thomas Johnson, Ph.D., HSPP",
      "description": [
        "Quantitative study testing associations between childhood temperament and music performance anxiety",
        "IRB approved study examining factors contributing to performance anxiety among college musicians"
      ]
    }
  ]
  ```

* **Presentations**

  ```jsonc
  "presentations": [
    {
      "title": "Ethical and Effective Use of AI in Clinical Care",
      "date": "September 2025",
      "venue": "Clients & Science Seminar, ISU",
      "type": "Academic presentation",
      "authors": ["Britton, J."]
    }
  ]
  ```

* **References**

  ```jsonc
  "references": [
    {
      "name": "Elizabeth Smith, Psy.D., HSPP",
      "title": "Assistant Professor, Clinical Supervisor",
      "organization": "Indiana State University, Department of Psychology",
      "location": "Terre Haute, IN",
      "phone": "(812) 237-2465",
      "email": "Liz.Smith@indstate.edu"
    }
  ]
  ```

### 6.3. AI-Managed CV Updates

* **All content** is driven by `cv_json_data.json`.
* **To update**: Drop your updated DOCX file into the project folder and notify the AI assistant.
* **AI handles the pipeline**: DOCX → JSON conversion, validation, and rebuild.
* **No manual steps required** - the AI manages the entire process.
* **Validate** against the custom JSON structure before deploying.
* **Refer to CV_UPDATE_GUIDE.md** for detailed instructions on the update process.

---

## 7. UI Layout & Components

1. **Layout Container** (`<div className="grid grid-cols-12 gap-4">`)

   * **Col 1–2**: `<LeftNav />` (sticky sidebar on desktop, hamburger menu on mobile)
   * **Col 3–9**: `<CVContent />` (scrollable, print‑friendly)
   * **Col 10–12**: `<Chatbot />` (always visible on desktop, floating button on mobile)
2. **LeftNav.tsx**

   * Reads section anchors, highlights on scroll via IntersectionObserver.
   * Mobile: Hamburger menu with slide-out panel.
3. **CVContent.tsx**

   * Renders title, date span (align right), bullets. Ensure consistent spacing & hyphens.
   * All links open in new tabs.
4. **Chatbot.tsx**

   * Always visible on desktop (right side), floating action button on mobile.
   * Input box + history; shows source citations.
   * Designed for fast, accurate retrieval from CV and related documents.

---

## 8. Design System & UI Layout Standards

### 8.1 Design Tokens

```css
:root {
  --font-sans: 'Inter', sans-serif;
  --color-primary: #1e3a8a;
  --color-secondary: #f59e0b;
  --color-text: #111827;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
}
```

### 8.2 Typography Standards

* **Header Sizing (Compact for Space Efficiency):**
  * Site header: `text-2xl font-bold` (not text-3xl - too tall)
  * Subtitle: `text-base` (not text-lg - saves vertical space)
  * Section headings: `text-xl font-bold`
  * Subsection headings: `text-lg font-semibold`

* **Body Text:** `text-base leading-relaxed`
* **Spacing:** Tailwind's 4‑point scale (0.25, 0.5, 1, 1.5, 2, …)
* **Breakpoints:** `sm` ≥ 640px, `md` ≥ 768px, `lg` ≥ 1024px, `xl` ≥ 1280px

### 8.3 Professional Formatting Rules (APA/APPIC Compliance)

**CRITICAL: NO COLORS in professional sections** - All CV content must use only gray color scheme:
* Evidence-Based Protocols: `bg-gray-50 border-gray-200` only
* Technology Tools: `bg-gray-50 border-gray-200` only  
* All professional sections: Gray backgrounds only, never blue/green/purple variants

**Typography for Secondary Information:**
* Use `text-gray-600` or `text-gray-500` for secondary info (institution, organization, location, status, type, etc.)
* Do **not** use italics for these fields—gray text is more readable and accessible
* **Only** use italics for APA-required cases (e.g., presentation/publication titles in Presentations section)

**Layout Patterns:**
* **Technology Tools Box Layout:**
  ```jsx
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
    <div className="mb-2">
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-semibold text-gray-900 text-lg pr-4">{tool.name}</h3>
        <span className="text-sm text-gray-600 flex-shrink-0">{tool.date}</span>
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">{tool.description}</p>
    </div>
    {/* Links section with mt-3 spacing */}
  </div>
  ```

* **Header Dimensions (Optimized for Space):**
  * Container padding: `py-3` (not py-6 - too tall)
  * Content top padding: `pt-16` (64px for compact header)
  * Fixed sidebar positioning: `top-24` (96px)
  * Scroll offsets: 100px for section highlighting, 80px for smooth scroll

### 8.4 Component Spacing Standards

* **Section margins:** `mb-8` between major sections
* **Subsection margins:** `mb-4` between entries
* **Title-to-content spacing:** `mb-1` between title row and description
* **Content-to-link spacing:** `mt-3` for action links
* **Grid gaps:** `gap-4` for 2-column layouts

### 8.5 Responsive Layout Rules

* **Desktop (lg+):** 3-column grid with fixed sidebars
* **Mobile:** Single column with hamburger navigation
* **Fixed positioning coordination:** All fixed elements must account for compact header height

### 8.6 Common Layout Anti-Patterns to Avoid

**❌ DON'T:**
* Use colors in professional CV sections (blue/green/purple backgrounds)
* Make headers too tall (`py-6`, `text-3xl`) - wastes precious vertical space
* Put dates directly next to long titles without proper spacing (`pr-4`)
* Use `justify-between` without `flex-shrink-0` on dates - causes text crowding
* Forget to update all fixed positioning when changing header height
* Use excessive margin/padding that breaks professional appearance

**✅ DO:**
* Use only gray color schemes for all professional content
* Keep headers compact (`py-3`, `text-2xl`) for space efficiency  
* Add proper spacing between title and date (`pr-4`, `flex-shrink-0`)
* Update all layout calculations when modifying header dimensions
* Test responsive behavior on mobile devices
* Maintain consistent spacing patterns across all sections

---

## 9. Responsive & Accessibility

* **Desktop:** 3-column layout with left nav, center CV content, and right chatbot.
* **Mobile:** Hamburger menu navigation, full-width CV content, floating chatbot button.
* **ARIA roles:** `<nav aria-label="CV sections">`, ensure `<button>` for navigation nodes.
* **Keyboard:** Tab into nav links, chatbot input. Focus outline visible.
* **Links:** All external links open in new tabs.

---

## 10. Chatbot Integration & Pipeline

### 10.1 GPT-5-nano Model Strategy (Unified RAG Pipeline)

The chatbot now runs entirely on GPT-5-nano for every reasoning step. This keeps latency, tone, and cost predictable while still allowing a multi-stage pipeline.

**Single-Model Flow:**
- **Retrieval + Summaries:** GPT-5-nano receives retrieved snippets and, when needed, returns short summaries to trim context.
- **Positive/Tone Rewrites:** The same GPT-5-nano prompt can rewrite queries or context for strengths/APA compliance without switching models.
- **Final Answer:** GPT-5-nano generates the final response with citations using the refined context.

**Adaptive Prompting:**
- Prompts include toggles (strengths, comparative, interview stage) so one model can serve multiple personas.
- Temperature and max-token values are adjusted per stage but the model stays the same.
- Structured outputs (citations, bullet points) are enforced through system/user prompt templates.

**Layered Safety System:**
- Forbidden topics filter (short, focused list)
- OpenAI Moderation API before any model call
- System prompts instruct models to never hallucinate or discuss forbidden topics

**Hallucination Mitigation:**
- All responses must cite at least one retrieved snippet
- If no relevant context, bot replies: "I don't currently have that information"
- Post-processor checks for unsupported claims

**Error Handling:**
- All errors (API, safety, data) are caught and shown as user-friendly messages in the UI
- The React app uses an error boundary to catch rendering errors and display a reload button
- See README for error handling summary

### 10.2 Environment Configuration

```bash
# .env (git-ignored)
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Chat model configuration
CHAT_MODEL=gpt-5-nano                # Single model for summaries, rewrites, and final answers

# Multi-document RAG settings
EMBED_MODEL=text-embedding-3-small   # $0.02/M tokens - most cost-effective
CHUNK_SIZE=512                       # optimal for mixed content types
CHUNK_OVERLAP=64                     # maintain context across chunks
MAX_CHUNKS_PER_QUERY=8               # balance context vs cost
SIM_THRESHOLD=0.75                   # lower for broader context

# Smart routing parameters
TEMPERATURE=0.4                      # lower for factual accuracy
MAX_TOKENS=512                       # reduced for cost optimization
CONFIDENCE_THRESHOLD=0.8             # escalation trigger
COST_LIMIT_PER_SESSION=0.10          # $0.10 budget per user session
ENABLE_QUERY_CLASSIFICATION=true     # smart routing based on query type
ENABLE_DOCUMENT_AWARENESS=true       # different handling per doc type
```

> **Important:** `openaiModel.js` reads several environment variables (`OPENAI_RESPONSES_MODEL`, `OPENAI_MODEL`, `VITE_OPENAI_MODEL`,
> etc.), but any value that does not start with `gpt-5-nano` is ignored and the runtime falls back to `gpt-5-nano`. This guarantees
> the production system cannot silently drift back to GPT-3.5 or any other legacy model.

### 10.3 Implementation Pipeline

1. **Embeddings Precompute:** Run once offline to embed `resume.json` bullets + supplemental docs; store vectors in a JSON or local vector-store.

2. **Retrieval (utils/retriever.ts):**
   * `getRelevantChunks(query: string): Array<Chunk>`
   * Use cosine similarity against precomputed vectors.

3. **Safety Filter (utils/safety.ts):**
   * Basic profanity/toxicity check; rephrase negative sentiment via GPT instruction.

4. **Model Runner (utils/chat.ts):**
   * GPT-5-nano wrapper around the OpenAI API
   * Applies stage-specific prompts (summary vs final answer)
   * Pulls its configuration from `openaiModel.js`, ensuring the enforced GPT-5-nano default is always used

5. **RAG Orchestration (utils/answer.ts):**
   * Combines retrieval, safety, and model chain
   * Formats context with citation IDs
   * Handles all error cases gracefully

6. **Error Handling:** Show user-friendly error message, e.g., "I'm sorry, something went wrong. Please try again."

### 10.4 System Prompts

```
SYSTEM:
You are John Britton's Interactive CV Assistant.
Answer ONLY with information from the excerpts.
Cite each fact [§ID]. If unknown, say
"I don't have that detail in the CV." Length ≤ 175 words.

DEVELOPER (optional):
Format degrees in **bold** and bullet job tasks.  
End every reply with *— John Britton CV Bot*.
```

### 10.5 Cost Optimization Features

- **Single-model budgeting:** GPT-5-nano is the only model billed; adjust `CHAT_MODEL` in `.env` only if OpenAI updates pricing.
- **Token limits:** Adjust `MAX_TOKENS=600` if answers never need full 768.
- **Temperature control:** Lower to 0.45 if hallucinations increase.
- **Usage tracking:** Log GPT-5-nano usage for cost monitoring.

### 10.6 Multi-Document Support & Expansion

**Document Types Supported:**
- **CV/Resume**: Primary professional document (existing)
- **Internship Essays**: Personal statements, application essays
- **Cover Letters**: Job-specific application letters
- **Professional Bio**: Short biographical summaries
- **Research Papers**: Academic publications and drafts
- **Transcripts**: Educational records and grades
- **Recommendation Letters**: Reference letters (with permission)

**Document Processing Pipeline:**
1. **Ingestion**: Automated parsing of DOCX, PDF, TXT formats
2. **Chunking**: Intelligent segmentation by document type
3. **Embedding**: Separate vector spaces per document type
4. **Indexing**: Cross-document reference linking
5. **Retrieval**: Multi-document context assembly

**Smart Context Assembly:**
- **Primary Source**: Always include CV context for professional queries
- **Supplementary Sources**: Add essay/letter context for personality/fit questions
- **Cross-Reference**: Link related information across documents
- **Relevance Scoring**: Weight chunks by document type and query relevance

### 10.7 Cost Optimization Features

**Real-time Cost Tracking:**
- Session-based budget limits ($0.10 default)
- Per-query cost estimation and logging
- Automatic model downgrade when approaching limits
- Daily/weekly usage analytics

**Intelligent Routing:**
- Query complexity classification (factual/analytical/creative)
- Document-type awareness for optimal model selection
- Context size optimization (chunk selection)
- Batch processing for multiple related queries

### 10.8 Hallucination Mitigation

1. Response must cite at least one snippet from retrieved context
2. If no snippet score exceeds threshold (0.75 cosine), bot replies with "I don't currently have that information"
3. Post-processor checks for unsupported claims using regex against date & bullet patterns
4. Cross-document validation for consistency
5. Confidence scoring with automatic escalation for uncertain responses

---

## 11. Build, Run & Deploy

* **Local Dev:** `npm run dev` → [http://localhost:3000](http://localhost:3000)
* **Build:** `npm run build` → outputs to `dist/` or `.output/`.
* **Deploy GH Pages:**

  1. Add `gh-pages` package & script:

     ```jsonc
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
     ```
  2. Set `repository` in `package.json` and run `npm run deploy`.

---

## 12. Contribution & Coding Standards

* **Linting:** ESLint + Prettier (enforce TS and Tailwind lint).
* **Branching:** Feature branches; PRs reviewed by yourself/peers.
* **Commits:** Conventional commits: `feat:`, `fix:`, `docs:`.

---

## 13. Testing & QA

* **Unit tests:** Jest + React Testing Library for basic rendering & interactions.
* **E2E:** Playwright or Cypress on key flows: nav scroll, timeline click, chatbot Q&A.

---

## 14. Analytics & Logging (Optional)

* Use Plausible or self‑hosted Fathom (privacy‑focused, free tier) to track page & timeline engagement.
* Chatbot events: log anonymized query metadata to console or optional telemetry store.

---

## 15. APPIC‑Specific Formatting & Content Rules

> **Cursor Note:** Follow these rules in all CV‑related components and JSON transformations.

1. **Section Order (reverse‑chronological entries):**

   1. Education → Clinical Experience → Assessment Experience → Supervision → Research → Teaching → Publications/Presentations → Awards → Service → References.
2. **Bullet Construction:** 2–5 bullets per entry, each starts with a strong **past‑tense** action verb (e.g., *Provided, Conducted, Administered*).
3. **Date Alignment:** Month & year ranges right‑aligned and consistently formatted (e.g., *Aug 2024 – May 2025*).
4. **Supervisor Credentials:** Every clinical / assessment / supervision entry lists supervisor name **and** credentials *(Ph.D., HSPP, etc.)*.
5. **Assessment Section:** List formal instruments administered (e.g., *WAIS‑IV, WISC‑V, ADOS‑2*).
6. **No "Padding" Sections:** Omit coursework, irrelevant workshops, or personal hobbies—APPIC reviewers flag excess fluff.
7. **Publications:** Use APA 7 references; if >7 items, switch heading to **Selected Publications** (bot should truncate accordingly).
8. **References Section:** 3–4 referees max; phone & email required; get permission first.

These constraints should be validated during DOCX → JSON import and again by a linter script before deployment.

---

## 16. Automated DOCX → JSON Pipeline

1. **Convert:** Use a Python script (`scripts/docx2json.py`) with `python-docx` to extract headings, dates, bullets.
2. **Map:** Transform into the custom JSON structure used by `cv_json_data.json`.
3. **Validate:** Check JSON syntax and ensure all required fields are present.
4. **Test:** Verify the React application renders correctly with the new data.
5. **Commit:** Deploy only after validation and testing passes.

**See CV_UPDATE_GUIDE.md** for detailed instructions on the manual update process. Future automation can be added via GitHub Actions that re‑run the pipeline on new CV uploads.

---

## 17. Print & PDF Stylesheet

```css
@media print {
  nav, aside { display: none !important; }
  header { box-shadow: none; }
  a[href]:after { content: ""; } /* removes ugly print links */
  body { font-size: 12pt; line-height: 1.4; }
}
```

* Provide a **Download PDF** button that triggers `window.print()` or uses `react-to-print` to generate a reviewer‑ready file.
* Hide interactive widgets (timeline/chat) in print view.

---

## 18. Enhanced Privacy Disclosure

Update footer notice:

> "Queries are transmitted to OpenAI servers (U.S.‑hosted) for processing. By using the chatbot you consent to this transfer. No identifying personal data is stored."

---

## 19. Cost & Model Fallback

* Beyond free OpenAI credit, set soft usage limits; warn user if quota exceeds budget.
* Provide optional local model fallback via `llama.cpp` or `ollama` if API unavailable (non‑critical feature).

---

## 20. Hallucination Mitigation Rules

1. Response must cite at least one snippet from retrieved context.
2. If no snippet score exceeds threshold (0.75 cosine), bot replies with "I don't currently have that information."
3. Post‑processor checks for unsupported claims (regex against date & bullet patterns).

---

## 21. Debugging & Iterative Testing: Chatbot, HMR, and White Screen Issues

### 21.1 Symptom Patterns
- **White screen** on app load or after hot reload (HMR)
- **Infinite HMR loops**: Terminal logs show repeated updates to files like `Chatbot.tsx`, `globals.css`, `main.tsx`, etc.
- **Port conflicts**: Vite tries ports 3000–3004 due to zombie processes from failed reloads
- **App hangs** or reloads indefinitely after editing chatbot-related files

### 21.2 Systematic Debugging & Iterative Testing
1. **Isolate the Problem**
   - Start by commenting out or removing the suspected component (e.g., `<Chatbot />`)
   - If the app loads, the issue is likely in that component or its dependencies
2. **Test Each Utility File**
   - Systematically test each chatbot utility file (`chat.ts`, `safety.ts`, `retriever.ts`, `answer.ts`)
   - Temporarily replace their exports with stubs to see if the app stabilizes
   - Restore one file at a time to identify which causes reloads or errors
3. **Check for TypeScript Errors**
   - Incomplete or incorrect type definitions can cause runtime and HMR issues
   - Use type assertions as a temporary fix, but document all type gaps for later cleanup
4. **Monitor Terminal Output**
   - Look for repeated HMR update messages or port conflicts
   - Use `pkill -f "vite.*dev"` to kill zombie Vite processes before restarting
5. **Check for CSS/Global Style Loops**
   - Edits to `globals.css` can sometimes trigger infinite reloads if imported incorrectly
6. **Use the TODO List for Tracking**
   - Maintain a running TODO list (see below) for all debugging hypotheses, steps, and fixes
   - Mark each step as completed or pending to avoid repeating work

### 21.3 Example TODO List for Debugging
- [ ] Comment out `<Chatbot />` and verify app loads
- [ ] Test each chatbot utility file in isolation
- [ ] Check for type errors in `src/types/index.ts`
- [ ] Monitor for HMR loop triggers in terminal
- [ ] Document all findings and fixes in this guide

### 21.4 Lessons Learned
- **Always document debugging steps and root causes** in this guide
- **Update the TODO list** as you go—never rely on memory
- **If a white screen or HMR loop recurs,** refer to this section before starting from scratch
- **After major UI or integration changes,** update this section with new lessons

### 21.5 References
- See also: [Testing & QA](#13-testing--qa), [Contribution & Coding Standards](#12-contribution--coding-standards)
- For persistent issues, consider adding a `TROUBLESHOOTING.md` file for even more detailed logs and solutions

---

*Ready to start? Clone this repo template, drop in your `resume.json`, run `npm run dev`, and iterate!* 