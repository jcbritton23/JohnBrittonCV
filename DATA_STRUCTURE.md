# CV Data Structure Documentation

## Overview

This document provides a comprehensive reference for the JSON data structure used in `cv_json_data.json`. This structure is specifically designed for APA/APPIC-compliant CV formatting and is used by the React application to render the interactive CV.

## Top-Level Structure

```json
{
  "personalInfo": { ... },
  "education": [ ... ],
  "supervisedClinicalExperience": [ ... ],
  "evidenceBasedProtocols": { ... },
  "supervisoryExperience": [ ... ],
  "additionalClinicalExperience": [ ... ],
  "specialProjects": [ ... ],
  "researchExperience": [ ... ],
  "teachingExperience": [ ... ],
  "honorsAndAwards": [ ... ],
  "presentations": [ ... ],
  "administrativeRoles": [ ... ],
  "technologyTools": [ ... ],
  "professionalMemberships": [ ... ],
  "trainingAndEducation": [ ... ],
  "communityService": [ ... ],
  "references": [ ... ]
}
```

## Section Definitions

### 1. personalInfo (Object)

Basic contact information displayed at the top of the CV.

**Fields:**
- `name` (string): Full name
- `address` (string): Complete postal address
- `phone` (string): Phone number with area code
- `email` (string): Professional email address

**Example:**
```json
"personalInfo": {
  "name": "John Britton",
  "address": "1952 Cobblestone Way S, Terre Haute, IN 47802",
  "phone": "(615) 485-2333",
  "email": "jbritton10@sycamores.indstate.edu"
}
```

### 2. education (Array)

Educational background in reverse chronological order.

**Fields:**
- `degree` (string): Full degree name with abbreviation
- `institution` (string): Institution name
- `location` (string): City, State
- `date` (string): Graduation date or expected date
- `details` (string, optional): Additional information like GPA

**Example:**
```json
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

### 3. supervisedClinicalExperience (Array)

Clinical experience under supervision, crucial for APPIC applications.

**Fields:**
- `position` (string): Job title/role
- `organization` (string): Organization name
- `location` (string): City, State
- `dates` (string): Date range (e.g., "June 2025 - Present")
- `supervisor` (string): Supervisor name with credentials
- `responsibilities` (array): List of key responsibilities
- `supervisors` (array, optional): Multiple supervisors if applicable

**Example:**
```json
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

### 4. evidenceBasedProtocols (Object)

Categorized list of evidence-based treatment protocols.

**Categories:**
- `cognitiveAndBehavioral` (array): CBT and related approaches
- `parentingAndChild` (array): Child and family interventions
- `traumaFocused` (array): Trauma-specific treatments
- `thirdWave` (array): Third-wave therapies

**Example:**
```json
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

### 5. supervisoryExperience (Array)

Experience providing supervision to others.

**Fields:**
- `position` (string): Supervisory role
- `organization` (string): Organization name
- `location` (string): City, State
- `dates` (string): Date range
- `responsibilities` (array): Supervisory duties

**Example:**
```json
"supervisoryExperience": [
  {
    "position": "Peer Supervisor",
    "organization": "Indiana State University Psychology Clinic",
    "location": "Terre Haute, IN",
    "dates": "August 2024 - Present",
    "responsibilities": [
      "Provided peer supervision to first-year doctoral students",
      "Facilitated group supervision sessions"
    ]
  }
]
```

### 6. additionalClinicalExperience (Array)

Other clinical experience not under direct supervision.

**Fields:**
- `position` (string): Position title
- `organization` (string): Organization name
- `location` (string): City, State
- `dates` (string): Date range
- `responsibilities` (array): Key responsibilities

### 7. specialProjects (Array)

Special projects and initiatives.

**Fields:**
- `title` (string): Project title
- `organization` (string): Organization name
- `location` (string): City, State
- `dates` (string): Date range
- `responsibilities` (array): Project responsibilities

### 8. researchExperience (Array)

Research experience and projects.

**Fields:**
- `title` (string): Research project title
- `institution` (string): Institution name
- `dates` (string): Date range
- `position` (string): Role in research
- `supervisor` (string): Research supervisor with credentials
- `description` (array): Description of research activities

**Example:**
```json
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

### 9. teachingExperience (Array)

Teaching and educational experience.

**Fields:**
- `position` (string): Teaching role
- `organization` (string): Institution name
- `location` (string): City, State
- `dates` (string): Date range
- `description` (array): Teaching responsibilities

### 10. honorsAndAwards (Array)

Academic and professional honors.

**Fields:**
- `title` (string): Award name
- `date` (string): Date received
- `description` (string, optional): Additional details

**Example:**
```json
"honorsAndAwards": [
  {
    "title": "Graduate Student Research Award",
    "date": "2025",
    "description": "Awarded for outstanding research contribution"
  }
]
```

### 11. presentations (Array)

Conference presentations and professional talks.

**Fields:**
- `title` (string): Presentation title
- `date` (string): Presentation date
- `venue` (string): Conference or venue name
- `type` (string): Type of presentation
- `authors` (array): List of authors

**Example:**
```json
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

### 12. administrativeRoles (Array)

Administrative and leadership positions.

**Fields:**
- `position` (string): Administrative role
- `organization` (string): Organization name
- `location` (string): City, State
- `dates` (string): Date range
- `responsibilities` (array): Administrative duties

### 13. technologyTools (Array)

Technology skills and tools, categorized by type.

**Fields:**
- `category` (string): Tool category
- `tools` (array): List of specific tools

**Example:**
```json
"technologyTools": [
  {
    "category": "Assessment & Testing",
    "tools": ["Q-interactive", "WISC-V", "WAIS-IV", "MMPI-2-RF"]
  },
  {
    "category": "Data Analysis",
    "tools": ["SPSS", "R", "Python", "Jamovi"]
  }
]
```

### 14. professionalMemberships (Array)

Professional organization memberships.

**Fields:**
- `organization` (string): Organization name
- `role` (string): Membership type or role
- `dates` (string): Membership period

**Example:**
```json
"professionalMemberships": [
  {
    "organization": "American Psychological Association (APA)",
    "role": "Student Member",
    "dates": "2024 - Present"
  }
]
```

### 15. trainingAndEducation (Array)

Continuing education and professional training.

**Fields:**
- `title` (string): Training title
- `date` (string): Training date
- `presenters` (array): List of presenters/instructors
- `description` (string, optional): Additional details

**Example:**
```json
"trainingAndEducation": [
  {
    "title": "Spirituality and Mental Health",
    "date": "October 2024",
    "presenters": ["Kenneth I. Pargament, Ph.D.", "Michael J. Pearce, Ph.D."],
    "description": "6-hour continuing education workshop"
  }
]
```

### 16. communityService (Array)

Community service and volunteer activities.

**Fields:**
- `organization` (string): Organization name
- `location` (string): City, State
- `dates` (string): Service period
- `activities` (array): List of activities

**Example:**
```json
"communityService": [
  {
    "organization": "Local Mental Health Center",
    "location": "Terre Haute, IN",
    "dates": "2024 - Present",
    "activities": [
      "Volunteer crisis counselor",
      "Community mental health education"
    ]
  }
]
```

### 17. references (Array)

Professional references with complete contact information.

**Fields:**
- `name` (string): Reference name with credentials
- `title` (string): Professional title
- `organization` (string): Organization name
- `location` (string): City, State
- `phone` (string): Phone number
- `email` (string): Email address

**Example:**
```json
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

## Data Validation Rules

### Required Fields
- All sections must be present (can be empty arrays/objects)
- `personalInfo` must have all four fields
- Clinical experience entries must include supervisor credentials
- References must include complete contact information

### Format Standards
- Dates: Use consistent format (e.g., "Month YYYY - Present")
- Credentials: Include full credentials for supervisors and references
- Locations: Use "City, State" format
- Phone numbers: Include area code in parentheses

### Content Guidelines
- Use past-tense action verbs for bullet points
- Maintain professional tone throughout
- Include specific details for clinical experiences
- Ensure all information is accurate and verifiable

## Usage in React Application

The data structure is consumed by:
- `src/components/CVContent.tsx`: Main rendering component
- `src/components/LeftNav.tsx`: Navigation generation
- `src/types/index.ts`: TypeScript type definitions

Each section is rendered with appropriate styling and formatting to match APA/APPIC standards while maintaining responsive design and accessibility features. 