// JSON Resume extended schema for APPIC/APA compliance
export interface ResumeData {
  basics?: Basics;
  education?: Education[];
  work?: Work[];
  volunteer?: Volunteer[];
  projects?: Project[];
  publications?: Publication[];
  presentations?: Presentation[];
  skills?: Skill[];
  educationTraining?: EducationTraining[];
  workExperiences?: WorkExperience[];
  awards?: Award[];
  profiles?: Profile[];
  references?: Reference[];
  // New flat content blocks structure
  content_blocks?: ContentBlock[];
  metadata?: {
    total_blocks: number;
    source_file: string;
  };
}

// Content block structure for flat rendering
export interface ContentBlock {
  type: string; // 'paragraph' | 'table'
  text?: string;
  raw_text?: string;
  alignment?: string;
  data?: string[][]; // For tables
}

export interface Basics {
  name: string;
  label: string;
  image: string;
  email: string;
  phone: string;
  url: string;
  summary: string;
  location: Location;
  profiles: Profile[];
}

export interface Location {
  address: string;
  postalCode: string;
  city: string;
  countryCode: string;
  region: string;
}

export interface Education {
  institution: string;
  url: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate: string;
  score: string;
  courses: string[];
  dissertation?: {
    title: string;
    status: string;
    defenseDate: string;
    advisor: string;
  };
}

export interface Work {
  name: string;
  position: string;
  url: string;
  startDate: string;
  endDate: string;
  summary: string;
  highlights: string[];
  location: string;
  supervisor?: string;
  bullets?: string[];
}

export interface Volunteer {
  organization: string;
  position: string;
  url: string;
  startDate: string;
  endDate: string;
  summary: string;
  highlights: string[];
  location: string;
  supervisor?: string;
  bullets?: string[];
}

export interface Project {
  name: string;
  description: string;
  highlights: string[];
  keywords: string[];
  startDate: string;
  endDate: string;
  url: string;
  roles: string[];
  entity: string;
  type: string;
  chair?: string;
  status?: string;
}

export interface Publication {
  name: string;
  publisher: string;
  releaseDate: string;
  url: string;
  summary: string;
  citation?: string;
}

export interface Presentation {
  name: string;
  date: string;
  event: string;
  url: string;
  summary: string;
  title?: string;
  type?: string;
  venue?: string;
}

export interface Skill {
  name: string;
  level: string;
  keywords: string[];
  category?: string;
}

export interface EducationTraining {
  title: string;
  date: string;
  presenter?: string;
  instructor?: string;
  organization?: string;
  description?: string;
}

export interface WorkExperience {
  name: string;
  position: string;
  startDate: string;
  endDate: string;
  summary: string;
  highlights: string[];
  location: string;
  supervisor?: string;
}

export interface Award {
  title: string;
  date: string;
  awarder: string;
  summary: string;
  description?: string;
}

export interface Profile {
  network: string;
  username: string;
  url: string;
  memberSince?: string;
}

export interface Reference {
  name: string;
  position: string;
  organization: string;
  phone: string;
  email: string;
}

// Component Props
export interface LeftNavProps {
  sections: Section[];
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
}

export interface CVContentProps {
  cvData: CVData;
}

export interface TimelineProps {
  sections: Section[];
  onTimelineClick: (sectionId: string) => void;
}

export interface ChatbotProps {
  cvData: CVData;
}

export interface Section {
  id: string;
  title: string;
  icon: string;
  order: number;
}

// Chatbot types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  citations?: string[];
}

export interface ChatContext {
  query: string;
  relevantChunks: string[];
  confidence: number;
}

// Utility types
export interface Chunk {
  id: string;
  content: string;
  section: string;
  source: string;
  score: number;
}

export interface SafetyFilter {
  isSafe: boolean;
  sanitizedQuery: string;
  warnings: string[];
}

// Represents the structure of the cv_json_data.json file
export interface CVData {
  personalInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
    interactiveCV?: string;
  };
  education: {
    degree: string;
    institution: string;
    location: string;
    date: string;
    details?: string;
  }[];
  supervisedClinicalExperience: {
    position: string;
    organization: string;
    location: string;
    dates: string;
    supervisor?: string;
    supervisors?: string[];
    responsibilities: string[];
  }[];
  evidenceBasedProtocols?: {
    description?: string;
    cognitiveAndBehavioral?: string[];
    parentingAndChild?: string[];
    traumaFocused?: string[];
    thirdWave?: string[];
    [category: string]: string[] | string | undefined;
  };
  supervisoryExperience?: {
    position: string;
    organization: string;
    location: string;
    dates: string;
    supervisor?: string;
    responsibilities: string[];
  }[];
  additionalClinicalExperience?: {
    position: string;
    organization: string;
    location: string;
    dates: string;
    responsibilities: string[];
    specialProjects?: string[];
  }[];
  researchExperience: {
    type: string;
    title?: string;
    institution: string;
    location: string;
    dates: string;
    chair?: string;
    supervisor?: string;
    status?: string;
    description: string[];
  }[];
  teachingExperience?: {
    position: string;
    institution: string;
    location: string;
    dates: string;
    course: string;
    description: string[];
  }[];
  honorsAndAwards?: {
    award: string;
    year: string;
  }[];
  presentations?: {
    title: string;
    date: string;
    venue: string;
    type: string;
    authors: string[];
    category?: string;
  }[];
  administrativeRoles?: {
    position: string;
    organization: string;
    dates: string;
    location?: string;
    responsibilities?: string[];
  }[];
  technologyTools?: {
    name: string;
    date: string;
    description: string;
    details?: string;
    link?: string;
  }[];
  professionalMemberships?: {
    organization: string;
    role?: string;
    dates: string;
  }[];
  trainingAndEducation?: {
    title: string;
    type?: string;
    organization?: string;
    date: string;
    presenter?: string;
    presenters?: string[];
  }[];
  communityService?: {
    organization: string;
    position: string;
    location: string;
    dates: string;
    activities: string[];
  }[];
  references: {
    name: string;
    title: string;
    organization: string;
    location: string;
    phone: string;
    email: string;
  }[];
}