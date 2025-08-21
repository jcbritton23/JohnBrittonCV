import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Load CV data
let cvData = null;
try {
  const cvDataPath = path.join(process.cwd(), 'cv_json_data.json');
  const cvDataRaw = fs.readFileSync(cvDataPath, 'utf8');
  cvData = JSON.parse(cvDataRaw);
  console.log('CV Data Loaded: Yes');
  console.log('CV Data Keys:', Object.keys(cvData));
} catch (error) {
  console.error('Error loading CV data:', error.message);
  cvData = null;
}

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY
});

const MODEL = 'gpt-4o-mini';

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

  if (current.length) {
    paragraphs.push(current.join(' '));
  }

  return paragraphs.join('\n\n');
};

// Backend safety filtering (adapted from src/utils/safety.ts)
const ACCEPTABLE_TOPICS = [
  // Core professional topics
  /john\s+britton/i,
  /education/i,
  /degree/i,
  /psychology/i,
  /psych/i,
  /clinical/i,
  /therapy/i,
  /music.therapy/i,
  /research/i,
  /experience/i,
  /training/i,
  /internship/i,
  /appic/i,
  /supervision/i,
  /assessment/i,
  /evaluation/i,
  /treatment/i,
  /evidence.based/i,
  /cv|resume/i,
  /background/i,
  /qualifications/i,
  /skills/i,
  /competencies/i,
  /strength/i,
  /weakness/i,
  /challenge/i,
  /growth/i,
  /development/i,
  /professional/i,
  /career/i,
  /goals/i,
  /interests/i,
  /approach/i,
  /philosophy/i,
  /values/i,
  /dissertation/i,
  /thesis/i,
  /publication/i,
  /presentation/i,
  /conference/i,
  /client/i,
  /patient/i,
  /population/i,
  /intervention/i,
  /cognitive/i,
  /behavioral/i,
  /trauma/i,
  /anxiety/i,
  /depression/i,
  /psychotherapy/i,
  /site/i,
  /program/i,
  /supervisor/i,
  /mentor/i,
  /placement/i,
  /rotation/i,
  /practicum/i,
  /hours/i,
  /licensing/i,
  /certification/i,
  // Psychology specialties and settings
  /health.psychology/i,
  /health.psych/i,
  /medical.psychology/i,
  /behavioral.medicine/i,
  /neuropsychology/i,
  /forensic.psychology/i,
  /school.psychology/i,
  /counseling.psychology/i,
  /rehabilitation.psychology/i,
  /pediatric.psychology/i,
  /geropsychology/i,
  /community.psychology/i,
  /hospital/i,
  /medical.center/i,
  /healthcare/i,
  /outpatient/i,
  /inpatient/i,
  /setting/i,
  /environment/i,
  /workplace/i,
  /facility/i,
  /clinic/i,
  /practice/i,
  /fit/i,
  /suitable/i,
  /appropriate/i,
  /match/i,
  /compatible/i,
  // Question words and phrases
  /why/i,
  /how/i,
  /what/i,
  /when/i,
  /where/i,
  /who/i,
  /tell.me/i,
  /describe/i,
  /explain/i,
  /discuss/i,
  /share/i,
  /contact/i,
  /phone/i,
  /email/i,
  /address/i,
  /reference/i,
  /recommendation/i
];

const FORBIDDEN_PATTERNS = [
  /money|payment|cost|fee|price|insurance|billing|financial|charge|salary|wage|income|reimbursement|claim/i,
  /suicide|self[- ]?harm|kill myself|hurt myself|ending my life|overdose|cutting|risk of harm|homicide|violence|abuse|assault|danger to self|danger to others|crisis|emergency|911|hotline/i
];

const isRelevantQuery = (query) => {
  const lowerQuery = query.toLowerCase();
  
  // Check if query contains any acceptable topics
  const isTopicRelevant = ACCEPTABLE_TOPICS.some(pattern => pattern.test(lowerQuery));
  
  // Allow general conversational starters
  const conversationalStarters = [
    /^(hi|hello|hey|good morning|good afternoon|good evening)/i,
    /^(can you|could you|would you|will you)/i,
    /^(i would like|i want to|i need to)/i,
    /^(please|thank you|thanks)/i
  ];
  
  const isConversational = conversationalStarters.some(pattern => pattern.test(lowerQuery));
  
  // Reject clearly unrelated topics
  const unrelatedTopics = [
    /weather/i,
    /sports/i,
    /politics/i,
    /cooking/i,
    /travel/i,
    /movies/i,
    /music(?!.*therapy)/i, // Allow music therapy but not general music
    /technology(?!.*clinical)/i, // Allow clinical technology
    /shopping/i,
    /fashion/i,
    /celebrity/i,
    /gossip/i,
    /news(?!.*psychology)/i
  ];
  
  const isUnrelated = unrelatedTopics.some(pattern => pattern.test(lowerQuery));
  
  return (isTopicRelevant || isConversational) && !isUnrelated;
};

const sanitizeQuery = (query) => {
  const originalQuery = query.trim();
  
  // Check for forbidden topics
  const forbidden = FORBIDDEN_PATTERNS.some(pattern => pattern.test(originalQuery));
  if (forbidden) {
    return {
      isSafe: false,
      sanitizedQuery: originalQuery,
      warnings: [
        "I'm sorry, I can't discuss that topic. Please ask about John's professional background, education, or experience."
      ]
    };
  }

  // Check for empty query
  if (!originalQuery.trim()) {
    return {
      isSafe: false,
      sanitizedQuery: '',
      warnings: ['Please provide a valid question about John\'s background and experience.']
    };
  }

  // Check query length
  if (originalQuery.length > 500) {
    return {
      isSafe: false,
      sanitizedQuery: originalQuery,
      warnings: ['Query is too long. Please keep questions concise.']
    };
  }

  // Check topic relevance
  if (!isRelevantQuery(originalQuery)) {
    return {
      isSafe: false,
      sanitizedQuery: originalQuery,
      warnings: ['I can only answer questions about John\'s professional background, education, clinical experience, research, and qualifications for psychology internships. Please ask about his CV, training, or clinical work.']
    };
  }

  return {
    isSafe: true,
    sanitizedQuery: originalQuery,
    warnings: []
  };
};

app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body.message || "Hello";
    
    // Apply safety filtering
    const safetyResult = sanitizeQuery(userMessage);
    
    if (!safetyResult.isSafe) {
      return res.json({ 
        answer: safetyResult.warnings[0] || "I can only answer questions about John's professional background and qualifications."
      });
    }
    
    // Use the sanitized query for OpenAI
    const sanitizedMessage = safetyResult.sanitizedQuery;
    
    // Create comprehensive system prompt with complete CV context
    let systemPrompt = "You are a helpful assistant that answers questions about John Britton's professional background and qualifications for psychology internships. CRITICAL: Keep responses concise, scannable, and conversational. Organize the answer by theme using short paragraphs (2-3 sentences) separated by blank lines. Use bullet points when helpful, and get straight to the point. Match the tone of a knowledgeable colleague giving quick, direct answers. MOST IMPORTANT: Always include specific evidence from John's CV - mention specific organizations, dates, supervisors, protocols, or concrete examples. Don't give generic answers - pull actual details to support your points.";
    
    if (cvData) {
      systemPrompt += `\n\nJohn Britton Professional Profile:\n\n`;
      
      // Personal Information
      if (cvData.personalInfo) {
        systemPrompt += `John Britton is a doctoral psychology student at Indiana State University with a perfect 4.0 GPA, expected graduation May 2027. Contact: ${cvData.personalInfo.email} or ${cvData.personalInfo.phone}.\n\n`;
      }

      // Education - emphasize psychology focus
      if (cvData.education) {
        systemPrompt += `EDUCATION: Currently pursuing Psy.D. at Indiana State University (4.0 GPA, expected May 2027). Earned M.S. in Psychology from ISU (May 2024). Also holds M.M. in Music Therapy from University of Miami (2016) and B.M. in Jazz Studies from University of Rochester's Eastman School (2010). This interdisciplinary background provides unique expertise in therapeutic interventions and creative therapies.\n\n`;
      }

      // Clinical Experience - highlight psychology expertise with specific details
      if (cvData.supervisedClinicalExperience) {
        systemPrompt += `CLINICAL EXPERIENCE: Currently Graduate Student Clinician at Murphy, Urban, & Associates (June 2025-present) providing individual therapy and psychological evaluations. Previously at Clay City Center for Family Medicine (Aug 2024-May 2025) working in an INTEGRATED PRIMARY CARE SETTING, coordinating care with physicians, nurse practitioners, and nurses - this is direct health psychology experience. Also at ISU Psychology Clinic (Aug 2023-May 2024) for foundational training. Experienced with diverse populations and evidence-based interventions.\n\n`;
      }

      // Teaching Experience - emphasize psychology education
      if (cvData.teachingExperience) {
        systemPrompt += `TEACHING EXPERIENCE: Summer Faculty at ISU for PSY 321: Diversity and Ethics (May-July 2025) and PSY 101: General Psychology (June-Aug 2024). Graduate Teaching Assistant for PSY 101 (Aug 2023-May 2024) supporting ~70 students per semester. Strong background in psychology education and student engagement.\n\n`;
      }

      // Research Experience
      if (cvData.researchExperience) {
        systemPrompt += `RESEARCH EXPERIENCE: Doctoral dissertation on "Factors Contributing to Music Performance Anxiety Among College Musicians" (Chair: Thomas Johnson, Ph.D., HSPP, IRB approved Feb 2025). Graduate Research Assistant in ISU Psychomusicology Lab (Aug 2022-May 2025) conducting qualitative/quantitative analysis. Master's project on mindfulness-based music intervention for cancer patients at Sylvester Comprehensive Cancer Center (120 client-contact hours). Proficient in SPSS and R for statistical analysis.\n\n`;
      }

      // Add other sections concisely with psychology focus
      if (cvData.honorsAndAwards) {
        const awards = cvData.honorsAndAwards.map(award => `${award.award} (${award.year})`).join(', ');
        systemPrompt += `HONORS: ${awards}. Multiple awards recognizing academic excellence and research contributions.\n\n`;
      }

      if (cvData.presentations) {
        systemPrompt += `PRESENTATIONS: Multiple professional conference presentations demonstrating research and clinical work.\n\n`;
      }

      if (cvData.evidenceBasedProtocols) {
        const cognitiveProtocols = cvData.evidenceBasedProtocols.cognitiveAndBehavioral?.slice(0, 4).join(', ') || '';
        const traumaProtocols = cvData.evidenceBasedProtocols.traumaFocused?.slice(0, 3).join(', ') || '';
        const thirdWaveProtocols = cvData.evidenceBasedProtocols.thirdWave?.slice(0, 3).join(', ') || '';
        systemPrompt += `EVIDENCE-BASED TRAINING: Cognitive/Behavioral: ${cognitiveProtocols}. Trauma-Focused: ${traumaProtocols}. Third-Wave: ${thirdWaveProtocols}. Trained in scientifically-supported interventions across multiple modalities.\n\n`;
      }

      if (cvData.professionalMemberships) {
        systemPrompt += `PROFESSIONAL MEMBERSHIPS: Active in professional psychology organizations.\n\n`;
      }

      // Additional sections briefly
      ['supervisoryExperience', 'additionalClinicalExperience', 'administrativeRoles', 'trainingAndEducation', 'communityService'].forEach(section => {
        if (cvData[section] && cvData[section].length > 0) {
          const sectionTitle = section.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).toUpperCase();
          systemPrompt += `${sectionTitle}: ${cvData[section].length} additional professional experiences enhancing clinical competencies.\n\n`;
        }
      });
      
      systemPrompt += `RESPONSE STYLE: Answer directly and concisely. Use bullet points for lists. Keep paragraphs short (2-3 sentences) and theme-based, separated by blank lines. Be conversational but professional. Focus on the most relevant information for each question. ALWAYS include specific evidence: mention exact organizations (like "Clay City Center for Family Medicine"), dates ("June 2025-present"), supervisors ("Thomas Rea, Psy.D., HSPP"), specific protocols ("CBT for Chronic Pain", "EMDR"), or concrete examples. Replace generic statements with specific details from the CV data above.`;
    }
    
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: sanitizedMessage }
      ],
    });

    const rawAnswer = completion.choices[0].message.content;
    const answer = formatResponse(rawAnswer);
    res.json({ answer });
  } catch (error) {
    console.error('OpenAI Error:', error.message);
    
    // If quota exceeded or other OpenAI error, return a simulated response with CV context
    if (error.message.includes('quota') || error.message.includes('429')) {
      let simulatedResponse = `I understand you asked: "${req.body.message}".`;
      
      if (cvData && req.body.message) {
        const message = req.body.message.toLowerCase();
        // Count sections dynamically for comprehensive fallback responses
        const sectionCounts = {
          education: cvData.education?.length || 0,
          clinical: cvData.supervisedClinicalExperience?.length || 0,
          teaching: cvData.teachingExperience?.length || 0,
          research: cvData.researchExperience?.length || 0,
          awards: cvData.honorsAndAwards?.length || 0,
          presentations: cvData.presentations?.length || 0
        };
        
        if (message.includes('education')) {
          simulatedResponse += ` John has ${sectionCounts.education} degrees including a ${cvData.education[0].degree} from ${cvData.education[0].institution} (expected ${cvData.education[0].date}).`;
        } else if (message.includes('teaching') || message.includes('teach')) {
          simulatedResponse += ` John has ${sectionCounts.teaching} teaching positions including Summer Faculty roles for PSY 321 (Diversity and Ethics) and PSY 101 (General Psychology) at ISU.`;
        } else if (message.includes('research')) {
          simulatedResponse += ` John has ${sectionCounts.research} research experiences and has been involved in various psychology research projects.`;
        } else if (message.includes('award') || message.includes('honor')) {
          simulatedResponse += ` John has received ${sectionCounts.awards} honors and awards including the ISU Graduate Student Research Grant and Bakerman Student Research Award.`;
        } else if (message.includes('presentation')) {
          simulatedResponse += ` John has ${sectionCounts.presentations} professional presentations demonstrating his research and clinical work.`;
        } else if (message.includes('experience') || message.includes('clinical')) {
          simulatedResponse += ` John has ${sectionCounts.clinical} clinical positions including Graduate Student Clinician roles at multiple settings.`;
        } else if (message.includes('john') || message.includes('who')) {
          simulatedResponse += ` John Britton is a doctoral psychology student at Indiana State University with comprehensive experience across ${Object.keys(cvData).length} professional areas including clinical work, research, teaching, and community service.`;
        } else {
          const totalItems = Object.values(sectionCounts).reduce((a, b) => a + b, 0);
          simulatedResponse += ` This is a simulated response with complete CV context. John's professional profile includes ${totalItems} documented experiences across ${Object.keys(cvData).length} professional categories.`;
        }
      } else {
        simulatedResponse += ` This is a simulated OpenAI response due to quota limits.`;
      }
      
      res.json({ answer: simulatedResponse });
    } else {
      res.json({ answer: "Error: Could not connect to OpenAI" });
    }
  }
});

const PORT = 5050;
app.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`);
}); 