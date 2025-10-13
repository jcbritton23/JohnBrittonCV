export interface SupplementalContextItem {
  id: string;
  title: string;
  category: 'theory' | 'research' | 'autobiographical' | 'culture_diversity' | string;
  keywords: string[];
  content: string;
}

export const supplementalContext: SupplementalContextItem[] = [
  {
    id: 'autobiographical-foundations',
    title: 'Autobiographical Foundations',
    category: 'autobiographical',
    keywords: ['autobiographical', 'background', 'music therapy', 'motivation', 'journey', 'transition'],
    content:
      "My dad once set colorful beads on the piano so I could find the notes, his way of helping me navigate early hand surgeries for amniotic banding and discover what was possible. What stayed was not the beads, but the years of practice that taught me to listen, adapt, and persist. Music gave me empathy, discipline, and learning when to lean in or when to let silence do its work. That foundation served me in music therapy, particularly with an adolescent in an Intensive Outpatient Program who, after asking to speak privately, spent long minutes staring at the floor. I stayed with the silence, recognizing his ambivalence. Eventually, he shared suicidal thoughts. Once I understood the situation, I walked with him to the ER for an inpatient evaluation. He returned two weeks later, fully engaged, and completed the program. That experience taught me the balance between patience and decisive action when safety is at stake. While music therapy taught me to meet people emotionally, I wanted more comprehensive tools for the complex biopsychosocial presentations I saw. Clinical psychology offered the systematic framework I needed to address these interwoven factors and provided a sustainable path for my family.",
  },
  {
    id: 'theory-health-psychology',
    title: 'Health Psychology Orientation',
    category: 'theory',
    keywords: ['theory', 'health psychology', 'behavioral medicine', 'functional neurological disorder', 'cbt-i'],
    content:
      "My pursuit of that framework led me to an interest in health psychology. At Clay City Center for Family Medicine, I have seen the value of this approach firsthand, serving a rural health community by collaborating with physicians and nurses. Experiences across all my training sites have reinforced this passion. For instance, one client with functional neurological disorder celebrated her second seizure-free day in a year and, taking ownership of her healing, started an online support group. Similarly, using CBT for Insomnia, I helped a client raise their sleep efficiency from 65% to 90% in five weeks, re-establishing sleep as a foundation for recovery.",
  },
  {
    id: 'research-trajectory',
    title: 'Research and Dissertation Focus',
    category: 'research',
    keywords: ['research', 'dissertation', 'music performance anxiety', 'behavioral inhibition', 'lang'],
    content:
      "As a musician turned music therapist with several years of experience in a medical setting, I developed an interest in the intersection of music and psychology, which ultimately led me to pursue research on music performance anxiety. This journey has allowed me to develop scientific thinking and research skills that enhance both my scholarly work and clinical practice and inform my understanding of the interplay between the two. During my graduate training in music therapy, I designed mindfulness-based music protocols delivered across chemotherapy and bone-marrow transplant units. After practicing music therapy for several years, I realized I felt limited both clinically and career-wise, leading me to pursue training with greater flexibility. While working in the Psychomusicology Lab at ISU, I contributed to research on sad music listening, rumination, and social comparison through qualitative analysis. My dissertation focuses on music performance anxiety (MPA) among college musicians, examining predictors such as early childhood temperament, specifically behavioral inhibition, as well as perfectionism and social anxiety. For this study, I developed a behavioral measure of MPA to assess avoidance, safety behaviors, and performance-interfering behaviors. This measure, in combination with another validated MPA measure employed in the study, aligns with Lang's three-system model of fear (physiological, cognitive, and behavioral). Cluster analysis will explore meaningful subtypes, distinguishing individuals with MPA alone compared to broader presentations involving generalized or social anxiety. I anticipate defending my dissertation in spring 2026, prior to internship, and I am eager to bridge research and practice through opportunities such as program evaluation and examining factors that enhance therapy outcomes.",
  },
  {
    id: 'culture-humility-practice',
    title: 'Culture and Diversity in Practice',
    category: 'culture_diversity',
    keywords: ['culture', 'diversity', 'cultural humility', 'rural', 'faith', 'identity'],
    content:
      "Cultural humility is a balance between awareness and openness. It requires self-reflection, ongoing education, and acknowledging limits. In practice, I ask open-ended questions about a client's perspective early in treatment, make room for what emerges, and translate what I learn into specific changes to assessment, pacing, and intervention design. I routinely assess personal identity, experiences of discrimination, and systematic barriers as part of my conceptualization process. Much of my training has been in low-SES, rural environments where transportation barriers, housing instability, and limited resources shape engagement and access. This lens shaped my work with a White woman active in a small, generational Christian congregation who presented with suicidality, self-harm history, depression, and complex trauma. Early on I assumed that my openness would be matched by hers. Pressing for details about suicidal ideation led to quiet and defensiveness, so I slowed the pace and shifted attention toward her primary concerns while maintaining consistent safety checks. When the client's pastor arrived unannounced and said he would contact child protective services given her self-harm history, I consulted my supervisor immediately while managing the crisis. With the client's consent I met with the pastor and client, set clear boundaries about clinical and pastoral roles, and clarified confidentiality. In time the client decided to leave that congregation and seek a community that better supported her safety and growth. I centered our goals on her values as a mother and a person of faith and encouraged outreach to family and a local mother's group to reduce isolation. Two months later she disclosed intimate partner violence, reflecting the safety of our therapeutic alliance we had developed.",
  },
];

export const supplementalContextText = supplementalContext
  .map((item) => `${item.title}: ${item.content}`)
  .join('\n\n');
