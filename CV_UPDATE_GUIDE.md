# CV Update Guide

## Overview

This guide explains how to update John Britton's Interactive CV when you upload a new DOCX document. The process involves converting the DOCX content to the specific JSON structure used by the React application.

## Current Data Structure

The CV uses the file `cv_json_data.json` with the following main sections:

### Top-Level Structure
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

## Section-by-Section Mapping

### 1. Personal Information
```json
"personalInfo": {
  "name": "John Britton",
  "address": "1952 Cobblestone Way S, Terre Haute, IN 47802",
  "phone": "(615) 485-2333",
  "email": "jbritton10@sycamores.indstate.edu"
}
```

### 2. Education
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

### 3. Supervised Clinical Experience
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

### 4. Evidence-Based Protocols
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

### 5. Research Experience
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

### 6. Presentations
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

### 7. Technology Tools
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

### 8. Professional Memberships
```json
"professionalMemberships": [
  {
    "organization": "American Psychological Association (APA)",
    "role": "Student Member",
    "dates": "2024 - Present"
  }
]
```

### 9. References
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

## Update Process

### Step 1: Document Analysis
1. **Read through the new DOCX document carefully**
2. **Identify all sections and their corresponding JSON structure**
3. **Note any new sections that might need to be added**
4. **Check for formatting (bold, italics, bullet points)**

### Step 2: Data Extraction
1. **Extract personal information** (name, address, phone, email)
2. **Parse education entries** with degrees, institutions, dates, and any additional details
3. **Extract clinical experience** with positions, organizations, supervisors, and responsibilities
4. **Identify evidence-based protocols** and categorize them appropriately
5. **Extract research, teaching, and other professional experiences**
6. **Parse presentations, awards, and memberships**
7. **Extract references** with complete contact information

### Step 3: JSON Structure Conversion
1. **Create the top-level structure** with all required sections
2. **Populate each section** following the exact field names and structure
3. **Ensure consistent date formatting** (e.g., "June 2025 - Present", "May 2027 (Expected)")
4. **Maintain proper supervisor credential formatting** (e.g., "Thomas Rea, Psy.D., HSPP")
5. **Preserve bullet point content** in responsibility arrays
6. **Categorize evidence-based protocols** into appropriate subsections

### Step 4: Validation
1. **Check JSON syntax** for validity
2. **Verify all required fields** are present
3. **Ensure consistent formatting** across similar entries
4. **Validate supervisor credentials** are included for clinical experiences
5. **Check that all sections render properly** in the React application

### Step 5: Testing
1. **Replace the cv_json_data.json file** with the new version
2. **Start the development server** (`npm run dev`)
3. **Navigate through all sections** to ensure proper rendering
4. **Check the left navigation** updates correctly
5. **Verify print/PDF formatting** looks professional

## Common Pitfalls to Avoid

### 1. Date Formatting
- **Consistent format**: Use "Month YYYY - Present" or "Month YYYY - Month YYYY"
- **Expected dates**: Include "(Expected)" for future dates
- **Present tense**: Use "Present" not "Current" or "Ongoing"

### 2. Supervisor Information
- **Always include credentials**: "Name, Degree, License" format
- **Consistent formatting**: Use the same credential style throughout
- **Complete information**: Don't abbreviate names or credentials

### 3. Bullet Points
- **Use arrays**: Each responsibility should be a separate array item
- **Past tense verbs**: Start each bullet with a strong action verb
- **Consistent style**: Maintain similar bullet point length and structure

### 4. Section Organization
- **Maintain order**: Keep sections in the same order as the original
- **Don't skip sections**: Include all sections even if empty
- **Consistent naming**: Use exact field names from the structure

## Troubleshooting

### JSON Validation Errors
- Use a JSON validator to check syntax
- Common errors: missing commas, extra commas, unmatched brackets
- Check for proper quote escaping in text content

### Rendering Issues
- Check that all required fields are present
- Verify array structures are correct
- Ensure date formats are consistent

### Missing Content
- Compare with original DOCX to ensure nothing was missed
- Check that all bullet points were captured
- Verify all sections are included in the JSON

## File Locations

- **Main CV data**: `cv_json_data.json`
- **React component**: `src/components/CVContent.tsx`
- **Type definitions**: `src/types/index.ts`
- **Styling**: `src/styles/globals.css`

## Quick Reference Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Validate JSON structure
node -e "console.log(JSON.parse(require('fs').readFileSync('cv_json_data.json', 'utf8')))"
```

## Support

If you encounter issues during the update process:
1. Check the console for any error messages
2. Validate the JSON structure
3. Compare with the existing working structure
4. Test section by section to isolate issues
5. Refer to the DEVELOPER_GUIDE.md for additional technical details

Remember to maintain the professional APA/APPIC formatting standards and ensure all content from the original DOCX is preserved in the conversion process. 