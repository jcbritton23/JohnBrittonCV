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

let nextChunkId = allChunks.length;
const appendChunk = (content, section, source) => {
  const trimmed = content.trim();
  if (!trimmed) return;
  allChunks.push({
    id: `chunk-${nextChunkId++}`,
    content: trimmed,
    section,
    source,
  });
};

const HIDDEN_BACKGROUND_TEXT = `My dad once set colorful beads on the piano so I could find the notes, his way of helping me navigate early hand surgeries for amniotic banding and discover what was possible. What stayed was not the beads, but the years of practice that taught me to listen, adapt, and persist. Music gave me empathy, discipline, and learning when to lean in or when to let silence do its work.

That foundation served me in music therapy, particularly with an adolescent in an Intensive Outpatient Program who, after asking to speak privately, spent long minutes staring at the floor. I stayed with the silence, recognizing his ambivalence. Eventually, he shared suicidal thoughts. Once I understood the situation, I walked with him to the ER for an inpatient evaluation. He returned two weeks later, fully engaged, and completed the program. That experience taught me the balance between patience and decisive action when safety is at stake. While music therapy taught me to meet people emotionally, I wanted more comprehensive tools for the complex biopsychosocial presentations I saw. Clinical psychology offered the systematic framework I needed to address these interwoven factors and provided a sustainable path for my family.

My pursuit of that framework led me to an interest in health psychology. At Clay City Center for Family Medicine, I have seen the value of this approach firsthand, serving a rural health community by collaborating with physicians and nurses. Experiences across all my training sites have reinforced this passion. For instance, one client with functional neurological disorder celebrated her second seizure-free day in a year and, taking ownership of her healing, started an online support group. Similarly, using CBT for Insomnia, I helped a client raise their sleep efficiency from 65% to 90% in five weeks, re-establishing sleep as a foundation for recovery.

These experiences reinforce my belief that psychological care requires innovation and draws me to the ethical integration of technology in mental health. As AI transforms healthcare, psychologists must guide its development to ensure new tools support clinicians and enhance human connection. I have begun developing privacy-protecting applications and training on responsible AI use, grounded in the centrality of the therapeutic relationship.

I seek internship training where I can deepen my knowledge and experience with a range of evidence-based interventions to treat complex medical and psychological challenges. I am particularly drawn to expanding my work with functional neurological disorder, having developed a strong interest in this area, alongside other medical comorbidities like diabetes, chronic pain, and sleep disorders. I'm interested in collaborative settings where I can contribute as part of a cohesive team. My long-term vision involves practicing in a setting like primary care, a group practice, or an FQHC, serving the full lifespan and continuing to develop AI tools that make evidence-based interventions more accessible.

The piano beads are long gone, but the understanding remains that adaptation and genuine collaboration, whether between clinician and patient, or human insight and technological innovation, can transform the impossible into something functional and meaningful.

My theoretical orientation is centered in cognitive behavioral theories but remains flexible, incorporating specific treatment modalities, including ACT, DBT, and other mindfulness interventions to meet diverse client needs. I prioritize collaborative conceptualization and client autonomy, utilizing shared meaning-making and goal setting to guide a selection of interventions that honor client agency and readiness for change. Throughout my work, I integrate evidence-based practice with genuine warmth, believing effectiveness grows from both intentional planning and authentic human relationship.

To put this approach into practice, the client and I work together to make sense of their concerns, a process I deeply value. We often create a map of how biological, psychological, and social factors interact to sustain problems, using hypothesis testing to confirm and refine our shared understanding. For example, we might see how a client’s health anxiety is maintained by checking behaviors that, while temporarily relieve worry, ultimately increase focus on bodily sensations, creating a self-perpetuating cycle. This joint framework becomes our foundation for treatment planning. From the first session, I use motivational interviewing to promote autonomy and ensure that evidence-based approaches are responsive to each client’s values and cultural context.

Once a shared framework is established, my intervention style emphasizes flexibility and responsiveness. I use CBT protocols as practical frameworks, tailoring them to individual readiness and life circumstances. In health psychology work, I draw on CBT approaches for concerns such as insomnia, chronic pain, or health anxiety, and I apply the same stance across other clinical presentations as indicated. I also maintain an interpersonal style that incorporates compassion and humor, emphasizing collaboration and client agency while keeping the therapeutic relationship central.

Ali (pseudonym), a woman in her mid-30s, presented with generalized anxiety, panic, and self-worth concerns within the context of a relationship marked by criticism, coercion, and interpersonal difficulties. We began with cognitive restructuring and self-compassion work to address her harsh internal critic and build self-esteem. As her confidence developed through this work, we introduced graded exposures in community settings to reduce avoidance and anxiety symptoms. With this foundation, Ali practiced direct communication and boundary-setting with her partner, which reinforced a growing sense of independence. These gains translated into meaningful life changes, such as launching a small business, and ultimately allowed her to make autonomous decisions about her relationship from a position of empowerment rather than resignation.

During internship, I aim to deepen my skills in case formulation and strengthen my ability to individualize interventions across diverse settings. Guided by CBT principles, I am committed to integrating cultural considerations and client values into empirically grounded work while maintaining flexibility. I look forward to supervision as a space for shared conceptualization and feedback, which will help refine my clinical judgment and broaden my perspective. My goal is to emerge from internship as a more skilled CBT-oriented clinician, able to adapt evidence-based practice with cultural humility and authenticity across diverse settings.

As a musician turned music therapist with several years of experience in a medical setting, I developed an interest in the intersection of music and psychology, which ultimately led me to pursue research on music performance anxiety. This journey has allowed me to develop scientific thinking and research skills that enhance both my scholarly work and clinical practice and inform my understanding of the interplay between the two.

During my graduate training in music therapy, I designed mindfulness-based music protocols delivered across chemotherapy and bone-marrow transplant units. This project taught me to apply principles of music, emotion, and attention to intervention development. By combining music and psychological interventions, I was able to make meaningful connections with individuals who used mindfulness through music and body scans to sustain a sense of bodily connection despite physical challenges.

After practicing music therapy for several years, I realized I felt limited both clinically and career-wise, leading me to pursue training with greater flexibility. I was fortunate to find a graduate program where I could pursue my interests in both music and psychology. While working in the Psychomusicology Lab at ISU, I contributed to research on sad music listening, rumination, and social comparison, through qualitative analysis. Working in this lab strengthened my skills as a researcher and deepened my interest in the psychology of music.

My interest in health psychology led me to notice patterns among professional musicians in my network experiencing gastrointestinal symptoms from performance anxiety. Since musicians face higher rates of mental health difficulties than the general population, this seemed important to explore. Performance anxiety in high-achieving musicians, where career pressures create significant challenges, naturally fit my interest in behavioral interventions and laid the foundation for my dissertation work.

My dissertation focuses on music performance anxiety (MPA) among college musicians, examining predictors such as early childhood temperament, specifically behavioral inhibition, as well as perfectionism and social anxiety. For this study, I developed a behavioral measure of MPA to assess avoidance, safety behaviors, and performance-interfering behaviors. This measure, in combination with one other validated MPA measure employed in the study, aligns with Lang's three-system model of fear (physiological, cognitive, and behavioral). Cluster analysis will explore meaningful subtypes, distinguishing individuals with MPA alone compared to broader presentations involving generalized or social anxiety. I hope that the results of this study will be the first to find a meaningful connection between behavioral inhibition and MPA and add to growing literature on subtypes of MPA. This work has implications for tailoring treatment approaches based on whether clients present with MPA alone or broader anxiety presentations. I anticipate defending my dissertation in spring 2026, prior to internship.

I am eager to bridge research and practice through opportunities such as program evaluation and examining factors that enhance therapy outcomes, while also strengthening my clinical skills. I am further interested in the intersection of music with mental and physical health and in developing group and individual interventions for musicians as a future specialty.

Cultural humility is a balance between awareness and openness. It requires self-reflection, ongoing education, and acknowledging limits. In practice, I ask open-ended questions about a client's perspective early in treatment, make room for what emerges, and translate what I learn into specific changes to assessment, pacing, and intervention design. I routinely assess personal identity, experiences of discrimination, and systematic barriers as part of my conceptualization process. This approach recognizes that effective care must honor who people are and the realities they navigate.

As a White, heterosexual, cisgender male with an evolving faith background, I recognize the institutional privilege I hold and connect with humility across belief systems. Much of my training has been in low-SES, rural environments where transportation barriers, housing instability, and limited resources shape engagement and access. These realities require adapting my approach so treatment fits the context people live in. When systemic barriers interfere with care, I don't hesitate to address these within our work together.

This lens shaped my work with a White woman active in a small, generational Christian congregation who presented with suicidality, self-harm history, depression, and complex trauma. Her intersecting identities as a woman of faith and mother in a rural, generational religious community created unique challenges, with faith and motherhood serving as her primary sources of meaning and survival. Early on I assumed that my openness would be matched by hers. Pressing for details about suicidal ideation led to quiet and defensiveness. I realized I was moving faster than our relationship could support. I slowed the pace, made space for her process, and shifted attention toward her primary concerns while maintaining consistent safety checks.

When the client's pastor arrived unannounced in the lobby and said he would contact child protective services given her self-harm history, the client told me she felt unsafe. I consulted my supervisor immediately while managing the crisis. With the client's consent I met with the pastor and client, set clear boundaries about clinical and pastoral roles, and clarified confidentiality. In time the client decided to leave that congregation and seek a community that better supported her safety and growth, despite this meaning the loss of her generational support network in their tight-knit rural community. I centered our goals on her values as a mother and a person of faith and encouraged outreach to family and a local mother's group to reduce isolation. Two months later she disclosed intimate partner violence, reflecting the safety of our therapeutic alliance we had developed.

These experiences carry forward into my practice and internship goals. I see cultural humility as a daily practice rather than a statement of belief. I plan to engage in deeper conversations about identity with clients early in treatment, strengthen how I adapt evidence-based care to clients' values and constraints, and continue building respectful collaboration with providers. I want to grow my work in settings with disadvantaged populations where systemic barriers strongly affect access and where team-based solutions help reach those who need it most.`;

HIDDEN_BACKGROUND_TEXT.split(/\n\s*\n/).forEach((paragraph, index) => {
  appendChunk(paragraph, 'background', `background-${index + 1}`);
});

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

