import { ResumeData, Basics, Education, Work, Reference } from '../types';

// Define the custom CV data structure
interface CVData {
  personalInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  education?: Array<{
    degree: string;
    institution: string;
    location: string;
    date: string;
    details?: string;
  }>;
  supervisedClinicalExperience?: Array<{
    position: string;
    organization: string;
    location: string;
    dates: string;
    supervisor?: string;
    supervisors?: string[];
    responsibilities: string[];
  }>;
  evidenceBasedProtocols?: {
    cognitiveAndBehavioral?: string[];
    parentingAndChild?: string[];
    traumaFocused?: string[];
    thirdWave?: string[];
  };
  supervisoryExperience?: Array<{
    position: string;
    organization: string;
    location: string;
    dates: string;
    responsibilities: string[];
  }>;
  additionalClinicalExperience?: Array<{
    position: string;
    organization: string;
    location: string;
    dates: string;
    responsibilities: string[];
    specialProjects?: string[];
  }>;
  researchExperience?: Array<{
    type?: string;
    title?: string;
    institution: string;
    dates: string;
    chair?: string;
    supervisor?: string;
    supervisors?: string[];
    status?: string;
    description: string[];
  }>;
  teachingExperience?: Array<{
    position: string;
    institution: string;
    location: string;
    dates: string;
    course?: string;
    supervisor?: string;
    description: string[];
  }>;
  honorsAndAwards?: Array<{
    year: string;
    award: string;
  }>;
  presentations?: Array<{
    title: string;
    date: string;
    venue: string;
    type: string;
    authors: string[];
  }>;
  technologyTools?: Array<{
    name: string;
    date: string;
    description: string;
    link: string;
  }>;
  professionalMemberships?: Array<{
    organization: string;
    status?: string;
    dates: string;
    certifyingBody?: string;
  }>;
  trainingAndEducation?: Array<{
    title: string;
    date: string;
    presenters?: string[];
    presenter?: string;
    type?: string;
    description?: string;
  }>;
  communityService?: Array<{
    organization: string;
    position?: string;
    location: string;
    dates: string;
    activities: string[];
  }>;
  administrativeRoles?: Array<{
    position: string;
    organization: string;
    location: string;
    dates: string;
    responsibilities: string[];
  }>;
  references?: Array<{
    name: string;
    title: string;
    organization: string;
    location: string;
    phone: string;
    email: string;
  }>;
}

/**
 * Transform custom CV data to ResumeData format for chatbot compatibility
 */
export function transformCVDataToResumeData(cvData: CVData): ResumeData {
  console.log('Transforming CV data to resume data...');
  console.log('Input CV data:', cvData);
  const resumeData: ResumeData = {
    basics: transformBasics(cvData.personalInfo),
    education: transformEducation(cvData.education),
    work: transformWork(cvData),
    references: transformReferences(cvData.references)
  };

  return resumeData;
}

function transformBasics(personalInfo: CVData['personalInfo']): Basics {
  return {
    name: personalInfo.name,
    label: 'Clinical Psychology Doctoral Student',
    image: '',
    email: personalInfo.email,
    phone: personalInfo.phone,
    url: '',
    summary: '',
    location: {
      address: personalInfo.address,
      postalCode: '',
      city: '',
      countryCode: 'US',
      region: ''
    },
    profiles: []
  };
}

function transformEducation(education?: CVData['education']): Education[] {
  if (!education) return [];
  
  return education.map(edu => ({
    institution: edu.institution,
    url: '',
    area: edu.degree.includes('Psychology') ? 'Psychology' : edu.degree.includes('Music') ? 'Music' : 'Other',
    studyType: edu.degree,
    startDate: '',
    endDate: edu.date,
    score: edu.details?.includes('GPA') ? edu.details : '',
    courses: []
  }));
}

function transformWork(cvData: CVData): Work[] {
  const work: Work[] = [];
  
  // Add supervised clinical experience
  if (cvData.supervisedClinicalExperience) {
    cvData.supervisedClinicalExperience.forEach(exp => {
      work.push({
        name: exp.organization,
        position: exp.position,
        url: '',
        startDate: exp.dates.split(' - ')[0] || '',
        endDate: exp.dates.split(' - ')[1] || '',
        summary: exp.responsibilities.join('. '),
        highlights: exp.responsibilities,
        location: exp.location,
        supervisor: exp.supervisor || (exp.supervisors && exp.supervisors.join(', '))
      });
    });
  }
  
  // Add additional clinical experience
  if (cvData.additionalClinicalExperience) {
    cvData.additionalClinicalExperience.forEach(exp => {
      work.push({
        name: exp.organization,
        position: exp.position,
        url: '',
        startDate: exp.dates.split(' - ')[0] || '',
        endDate: exp.dates.split(' - ')[1] || '',
        summary: exp.responsibilities.join('. '),
        highlights: exp.responsibilities,
        location: exp.location
      });
    });
  }
  
  // Add research experience
  if (cvData.researchExperience) {
    cvData.researchExperience.forEach(exp => {
      work.push({
        name: exp.institution,
        position: exp.title || 'Research Position',
        url: '',
        startDate: exp.dates.split(' - ')[0] || '',
        endDate: exp.dates.split(' - ')[1] || '',
        summary: exp.description.join('. '),
        highlights: exp.description,
        location: '',
        supervisor: exp.supervisor || exp.chair || (exp.supervisors && exp.supervisors.join(', '))
      });
    });
  }
  
  // Add teaching experience
  if (cvData.teachingExperience) {
    cvData.teachingExperience.forEach(exp => {
      work.push({
        name: exp.institution,
        position: exp.position + (exp.course ? ` - ${exp.course}` : ''),
        url: '',
        startDate: exp.dates.split(' - ')[0] || '',
        endDate: exp.dates.split(' - ')[1] || '',
        summary: exp.description.join('. '),
        highlights: exp.description,
        location: exp.location,
        supervisor: exp.supervisor
      });
    });
  }
  
  return work;
}

function transformReferences(references?: CVData['references']): Reference[] {
  if (!references) return [];
  
  return references.map(ref => ({
    name: ref.name,
    position: ref.title,
    organization: ref.organization,
    phone: ref.phone,
    email: ref.email
  }));
} 