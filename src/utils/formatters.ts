// Utility functions for formatting CV data according to APPIC standards

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

export const formatDateRange = (startDate: string, endDate: string): string => {
  const start = formatDate(startDate);
  const end = endDate === 'Present' ? 'Present' : formatDate(endDate);
  return `${start} – ${end}`;
};

export const formatName = (name: string): string => {
  return name.trim();
};

export const formatInstitution = (institution: string): string => {
  return institution.trim();
};

export const formatPosition = (position: string): string => {
  return position.trim();
};

export const formatLocation = (location: string): string => {
  return location.trim();
};

export const formatSupervisor = (supervisor: string): string => {
  if (!supervisor) return '';
  return supervisor.trim();
};

export const formatBullets = (bullets: string[]): string[] => {
  return bullets.map(bullet => {
    // Ensure bullet starts with past-tense action verb
    const trimmed = bullet.trim();
    if (!trimmed) return '';
    
    // Capitalize first letter if not already
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  }).filter(bullet => bullet.length > 0);
};

export const formatGPA = (gpa: string): string => {
  if (!gpa) return '';
  return `GPA: ${gpa}`;
};

export const formatScore = (score: string): string => {
  if (!score) return '';
  return score;
};

export const formatCourses = (courses: string[]): string => {
  if (!courses || courses.length === 0) return '';
  return courses.join(', ');
};

export const formatKeywords = (keywords: string[]): string => {
  if (!keywords || keywords.length === 0) return '';
  return keywords.join(', ');
};

export const formatCitation = (citation: string): string => {
  if (!citation) return '';
  return citation.trim();
};

export const formatPhone = (phone: string): string => {
  if (!phone) return '';
  return phone.trim();
};

export const formatEmail = (email: string): string => {
  if (!email) return '';
  return email.trim().toLowerCase();
};

export const formatAddress = (location: any): string => {
  if (!location) return '';
  
  const parts = [
    location.address,
    location.city,
    location.region,
    location.postalCode
  ].filter(part => part);
  
  return parts.join(', ');
};

export const formatURL = (url: string): string => {
  if (!url) return '';
  return url.trim();
};

// APPIC-specific formatting helpers
export const validatePastTenseVerbs = (bullets: string[]): string[] => {
  const pastTenseVerbs = [
    'provided', 'conducted', 'administered', 'completed', 'performed',
    'maintained', 'participated', 'collaborated', 'developed', 'implemented',
    'designed', 'recruited', 'assessed', 'utilized', 'presented',
    'created', 'established', 'facilitated', 'coordinated', 'supervised',
    'evaluated', 'analyzed', 'researched', 'published', 'taught',
    'mentored', 'advised', 'consulted', 'trained', 'educated'
  ];
  
  return bullets.map(bullet => {
    const words = bullet.toLowerCase().split(' ');
    const firstWord = words[0];
    
    if (pastTenseVerbs.includes(firstWord)) {
      return bullet;
    } else {
      // Try to find a past tense verb and suggest replacement
      console.warn(`Bullet may not start with past tense verb: "${bullet}"`);
      return bullet;
    }
  });
};

export const formatSectionTitle = (title: string): string => {
  const titleMap: { [key: string]: string } = {
    'education': 'Education',
    'work': 'Clinical Experience',
    'volunteer': 'Other Clinical Experience & Community Service',
    'projects': 'Research & Quality Improvement',
    'publications': 'Publications',
    'presentations': 'Presentations',
    'skills': 'Clinical Skills & Evidence-Based Protocols',
    'educationTraining': 'Selected Trainings & Continuing Education',
    'workExperiences': 'Supervisory Experience',
    'awards': 'Honors & Awards',
    'profiles': 'Professional Memberships & Affiliations',
    'references': 'References'
  };
  
  return titleMap[title.toLowerCase()] || title;
};

export const sortByDate = (items: any[], dateField: string = 'startDate'): any[] => {
  return [...items].sort((a, b) => {
    const dateA = a[dateField] === 'Present' ? new Date('9999-12-31') : new Date(a[dateField]);
    const dateB = b[dateField] === 'Present' ? new Date('9999-12-31') : new Date(b[dateField]);
    return dateB.getTime() - dateA.getTime(); // Reverse chronological
  });
}; 