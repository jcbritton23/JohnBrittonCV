# John Britton's Interactive CV Website

A modern, interactive CV website built with React, TypeScript, and Tailwind CSS. Features an AI-powered chatbot for answering questions about John's background and experience.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📄 CV Updates (AI-Managed Pipeline)

**For CV Updates:** Simply drop your updated DOCX file (e.g., "John Britton Curriculum Vitae (CV) ...docx") into the project folder and notify the AI assistant. The AI will handle:

- Converting DOCX to custom JSON structure
- Validating and linting the output
- Updating `cv_json_data.json` and triggering a rebuild
- Ensuring APPIC/APA compliance

**No manual pipeline steps required** - the AI manages the entire process for you.

**See [CV_UPDATE_GUIDE.md](CV_UPDATE_GUIDE.md)** for detailed instructions on the update process and data structure.

## ✨ AI Chatbot Features (Updated)

- **Multi-model ensemble:** Specialized models analyze queries in parallel; a compiler model synthesizes the final answer.
- **Cost-optimized model chain:** Automatically routes queries to the most cost-effective model based on complexity and context.
- **Layered safety:** Forbidden topics filter and OpenAI Moderation API block unsafe queries before any model call.
- **Hallucination mitigation:** All answers must cite retrieved CV context; never makes up information.
- **Context-aware responses:** Adapts to the interviewer's context (internship, academic, clinical, general).
- **User-friendly error handling:** All errors are caught and shown as clear messages in the UI.

## ⚠️ Error Handling & Debugging (Updated)

- **Layered error handling:** All errors in the chatbot pipeline (safety, moderation, retrieval, model, network) are caught and surfaced to the user as clear, friendly messages.
- **React error boundary:** Catches rendering errors and displays a reload button and error details.
- **Console logging:** Key events and errors are logged for debugging.

## 📁 Project Structure

```
/
├── DEVELOPER_GUIDE.md          # Comprehensive development guide
├── CV_UPDATE_GUIDE.md          # Guide for updating CV with new documents
├── DATA_STRUCTURE.md           # Detailed data structure documentation
├── README.md                   # This file
├── package.json                # Dependencies and scripts
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
├── index.html                 # HTML entry point
├── public/                    # Static assets
│   └── John Britton Curriculum Vitae (CV).pdf  # Downloadable PDF
└── src/
    ├── main.tsx              # React entry point
    ├── App.tsx               # Main application component
    ├── styles/
    │   └── globals.css       # Global styles and Tailwind imports
    ├── types/
    │   └── index.ts          # TypeScript type definitions
    ├── components/
    │   ├── LeftNav.tsx       # Navigation sidebar (hamburger on mobile)
    │   ├── CVContent.tsx     # Main CV content renderer
    │   └── Chatbot.tsx       # AI-powered chatbot (always visible)
    ├── data/
    │   └── resume.json       # Legacy CV data (flat content blocks)
├── cv_json_data.json          # Current CV data in custom structure
    └── utils/
        ├── formatters.ts      # CV formatting utilities
        ├── retriever.ts       # Chatbot retrieval system
        └── safety.ts          # Content safety filters
```

## 🎨 Features

### ✅ Completed

- **Professional Design System**: Clean, APA-compliant formatting exceeding APPIC standards
- **Responsive Layout**: Mobile-first design with desktop grid layout
- **Interactive Navigation**: Sticky sidebar on desktop, hamburger menu on mobile
- **Always-Visible Chatbot**: AI-powered Q&A about CV content (right side on desktop, FAB on mobile)
- **PDF Download**: Direct download of prepared PDF with active links
- **Print-Ready**: Optimized PDF generation
- **Accessibility**: WCAG 2.1 AA compliance with keyboard navigation
- **Type Safety**: Full TypeScript implementation
- **Custom Data Structure**: Optimized JSON structure for APA/APPIC compliance
- **Error Handling**: Error boundaries, loading indicators, and console logging for robust debugging
- **AI-Managed Updates**: Automated DOCX to JSON pipeline
- **Comprehensive Documentation**: Update guides and data structure documentation

### 🔄 In Progress

- **OpenAI Integration**: Chatbot currently uses mock responses
- **Vector Embeddings**: Advanced retrieval system for better search
- **Testing**: Unit and E2E tests
- **Deployment**: GitHub Pages setup

### 📋 Still Needed

1. **Environment Setup**
   - Create `.env` file for OpenAI API key
   - Configure deployment settings

2. **Advanced Features**
   - Real OpenAI API integration
   - Vector embeddings for better search
   - Advanced safety filters
   - Analytics integration

3. **Testing & Quality**
   - Unit tests for components
   - E2E tests for user flows
   - Performance optimization
   - SEO optimization

4. **Deployment**
   - GitHub Actions workflow
   - Domain configuration
   - SSL certificate setup

## 📚 Documentation

- **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)**: Comprehensive development guide with design system, architecture, and coding standards
- **[CV_UPDATE_GUIDE.md](CV_UPDATE_GUIDE.md)**: Step-by-step guide for updating CV with new DOCX documents
- **[DATA_STRUCTURE.md](DATA_STRUCTURE.md)**: Complete reference for the JSON data structure with field definitions and examples

## 🛠 Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI**: OpenAI API (planned)
- **Hosting**: GitHub Pages (planned)

## 📊 Data Schema

The CV uses a custom JSON structure optimized for APA/APPIC compliance:

```json
{
  "personalInfo": { /* Contact information */ },
  "education": [ /* Education entries */ ],
  "supervisedClinicalExperience": [ /* Supervised clinical work */ ],
  "evidenceBasedProtocols": { /* Categorized treatment protocols */ },
  "supervisoryExperience": [ /* Supervision provided */ ],
  "additionalClinicalExperience": [ /* Other clinical work */ ],
  "specialProjects": [ /* Special projects */ ],
  "researchExperience": [ /* Research work */ ],
  "teachingExperience": [ /* Teaching roles */ ],
  "honorsAndAwards": [ /* Awards received */ ],
  "presentations": [ /* Conference presentations */ ],
  "administrativeRoles": [ /* Administrative positions */ ],
  "technologyTools": [ /* Technology skills */ ],
  "professionalMemberships": [ /* Professional memberships */ ],
  "trainingAndEducation": [ /* Continuing education */ ],
  "communityService": [ /* Community service */ ],
  "references": [ /* Professional references */ ]
}
```

**See [DATA_STRUCTURE.md](DATA_STRUCTURE.md)** for complete field definitions and examples.

## 🎯 APPIC Compliance

The website follows APPIC internship application standards:

- **Section Order**: Education → Clinical Experience → Assessment → Supervision → Research → Teaching → Publications → Awards → Service → References
- **Bullet Format**: Past-tense action verbs (Provided, Conducted, Administered)
- **Date Format**: Month Year ranges, right-aligned
- **Supervisor Info**: Credentials included (Ph.D., HSPP, etc.)
- **No Padding**: Focused on relevant experience only

## 🤖 Chatbot Features

- **Always Visible**: Prominent placement for easy access
- **Safety Filters**: Content moderation and query sanitization
- **Context Retrieval**: Smart search through CV data
- **Citation System**: Sources for all responses
- **Error Handling**: Graceful fallbacks for unknown queries
- **Privacy Compliance**: No personal data storage

## 📱 Responsive Design

- **Desktop**: 3-column layout with left nav, center CV content, and right chatbot
- **Mobile**: Hamburger menu navigation, full-width CV content, floating chatbot button
- **All Links**: Open in new tabs for better user experience

## 🚀 Deployment

### Local Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Production Deployment
```bash
npm run deploy       # Deploy to GitHub Pages
```

## 📝 Contributing

1. Follow the coding standards in `DEVELOPER_GUIDE.md`
2. Use conventional commits: `feat:`, `fix:`, `docs:`
3. Ensure all tests pass before submitting PRs
4. Follow accessibility guidelines 

## Environment Variables: OpenAI API Key (Vite Projects)

**Important:** For both frontend and backend code to access your OpenAI API key in a Vite project, you must use the `VITE_` prefix in your `.env` file:

```
VITE_OPENAI_API_KEY=sk-...yourkey...
```

- Do **not** use `OPENAI_API_KEY` unless you are running a separate Node.js backend and loading `.env` with `dotenv`.
- Vite only exposes variables prefixed with `VITE_` to both frontend and backend/serverless code.
- If you use `OPENAI_API_KEY`, your backend code will not see the key and the app will break (white screen or API errors).

**Troubleshooting:**
- If you see a white screen or the chatbot fails to load, double-check your `.env` file and ensure the key is named `VITE_OPENAI_API_KEY`.
- After editing `.env`, always restart your dev server. 