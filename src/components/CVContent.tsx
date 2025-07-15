import React from 'react';
import { CVData, CVContentProps } from '../types';

const CVContent: React.FC<CVContentProps> = ({ cvData }) => {
  if (!cvData) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 print:shadow-none print:p-0">
        <p className="text-gray-500">CV data not available.</p>
      </div>
    );
  }

  const renderBulletPoints = (items: string[]) => {
    return items.map((item, index) => (
      <li key={index} className="text-gray-700 leading-relaxed">
        {item}
      </li>
    ));
  };

  const renderDateRight = (date: string) => (
    <div className="text-right text-gray-600 font-medium min-w-[140px] flex-shrink-0">
      {date}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 print:shadow-none print:p-0 cv-content max-w-4xl mx-auto min-h-screen">
      {/* Header - Contact Information */}
      <div className="text-center mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {cvData.personalInfo.name}
        </h1>
        <div className="text-gray-600 space-y-1">
          <div>{cvData.personalInfo.address}</div>
          <div>{cvData.personalInfo.phone}</div>
          <div>
            <a 
              href={`mailto:${cvData.personalInfo.email}`} 
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {cvData.personalInfo.email}
            </a>
          </div>
        </div>
      </div>

      {/* Education */}
      <section id="education" className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2 cv-section-header">
          Education
        </h2>
        {cvData.education && cvData.education.map((edu, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-start mb-1">
              <div>
                <div className="font-semibold text-gray-900">{edu.degree}</div>
                {/* --- Metadata Line Start --- */}
                <div className="text-gray-500 text-sm mt-0.5">
                  {edu.institution}
                  {edu.location && <span> <span className="mx-1">|</span> {edu.location}</span>}
                  {edu.details && <span> <span className="mx-1">|</span> {edu.details}</span>}
                </div>
                {/* --- Metadata Line End --- */}
              </div>
              {renderDateRight(edu.date)}
            </div>
          </div>
        ))}
      </section>

      {/* Supervised Clinical Experience */}
      <section id="supervisedClinicalExperience" className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-1">
          Supervised Clinical Experience
        </h2>
        {cvData.supervisedClinicalExperience && cvData.supervisedClinicalExperience.map((exp, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-semibold text-gray-900">{exp.position}</div>
                <div className="text-gray-700">{exp.organization}{exp.location && `, ${exp.location}`}</div>
                {/* --- Supervisor Line Start --- */}
                {exp.supervisor && (
                  <div className="text-gray-700">Supervisor: {exp.supervisor}</div>
                )}
                {exp.supervisors && (
                  <div className="text-gray-700">Supervisors: {exp.supervisors.join(', ')}</div>
                )}
                {/* --- Supervisor Line End --- */}
              </div>
              {renderDateRight(exp.dates)}
            </div>
            <ul className="cv-bullet-list pl-6">
              {renderBulletPoints(exp.responsibilities)}
            </ul>
          </div>
        ))}
      </section>

      {/* Evidence-Based Protocols */}
      {cvData.evidenceBasedProtocols && (
        <section id="evidenceBasedProtocols" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-1">
            Evidence-Based Protocols
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cognitive & Behavioral Therapies */}
            {cvData.evidenceBasedProtocols.cognitiveAndBehavioral && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Cognitive & Behavioral Therapies
                </h3>
                <ul className="space-y-1">
                  {cvData.evidenceBasedProtocols.cognitiveAndBehavioral.map((protocol, index) => (
                    <li key={index} className="text-gray-700 text-sm flex items-start">
                      <span className="text-gray-600 mr-2">•</span>
                      {protocol}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Parenting & Child Therapies */}
            {cvData.evidenceBasedProtocols.parentingAndChild && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Parenting & Child Therapies
                </h3>
                <ul className="space-y-1">
                  {cvData.evidenceBasedProtocols.parentingAndChild.map((protocol, index) => (
                    <li key={index} className="text-gray-700 text-sm flex items-start">
                      <span className="text-gray-600 mr-2">•</span>
                      {protocol}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Trauma-Focused Therapies */}
            {cvData.evidenceBasedProtocols.traumaFocused && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Trauma-Focused Therapies
                </h3>
                <ul className="space-y-1">
                  {cvData.evidenceBasedProtocols.traumaFocused.map((protocol, index) => (
                    <li key={index} className="text-gray-700 text-sm flex items-start">
                      <span className="text-gray-600 mr-2">•</span>
                      {protocol}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Third-Wave Therapies */}
            {cvData.evidenceBasedProtocols.thirdWave && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Third-Wave Therapies
                </h3>
                <ul className="space-y-1">
                  {cvData.evidenceBasedProtocols.thirdWave.map((protocol, index) => (
                    <li key={index} className="text-gray-700 text-sm flex items-start">
                      <span className="text-gray-600 mr-2">•</span>
                      {protocol}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}
      
      {/* Supervisory Experience */}
      {cvData.supervisoryExperience && cvData.supervisoryExperience.length > 0 && (
      <section id="supervisoryExperience" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-1">
            Supervisory Experience
          </h2>
          {cvData.supervisoryExperience && cvData.supervisoryExperience.map((exp, index) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold text-gray-900">{exp.position}</div>
                  <div className="text-gray-700">{exp.organization}{exp.location && `, ${exp.location}`}</div>
                  {exp.supervisor && (
                    <div className="text-gray-700">Supervisor: {exp.supervisor}</div>
                  )}
                </div>
                {renderDateRight(exp.dates)}
              </div>
              <ul className="cv-bullet-list pl-6">
                {renderBulletPoints(exp.responsibilities)}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Additional Clinical Experience */}
      {cvData.additionalClinicalExperience && cvData.additionalClinicalExperience.length > 0 && (
      <section id="additionalClinicalExperience" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-1">
            Additional Clinical Experience
          </h2>
          {cvData.additionalClinicalExperience.map((exp, index) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold text-gray-900">{exp.position}</div>
                  <div className="text-gray-700">{exp.organization}{exp.location && `, ${exp.location}`}</div>
                </div>
                {renderDateRight(exp.dates)}
              </div>
              <ul className="cv-bullet-list pl-6">
                {renderBulletPoints(exp.responsibilities)}
              </ul>
              {exp.specialProjects && exp.specialProjects.length > 0 && (
                <section id="specialProjects" className="mt-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Special Projects</h3>
                  <ul className="cv-bullet-list">
                    {exp.specialProjects.map((project, pIndex) => (
                      <li key={pIndex} className="text-gray-700 leading-relaxed">
                        {project}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Research Experience */}
      <section id="researchExperience" className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-1">
          Research Experience
        </h2>
        {cvData.researchExperience && cvData.researchExperience.map((research, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-semibold text-gray-900">
                  {research.type === 'Doctoral Dissertation' ? (
                    <span><strong>Doctoral Dissertation:</strong> {research.title}</span>
                  ) : (
                    research.title
                  )}
                </div>
                <div className="text-gray-700">{research.institution}</div>
                {/* --- Supervisor Line Start --- */}
                {research.supervisor && (
                  <div className="text-gray-700">Supervisor: {research.supervisor}</div>
                )}
                {/* --- Supervisor Line End --- */}
              </div>
              {renderDateRight(research.dates)}
            </div>
            <ul className="cv-bullet-list pl-6">
              {renderBulletPoints(research.description)}
            </ul>
          </div>
        ))}
      </section>

      {/* Teaching Experience */}
      {cvData.teachingExperience && cvData.teachingExperience.length > 0 && (
      <section id="teachingExperience" className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-1">
          Teaching Experience
        </h2>
        {cvData.teachingExperience.map((exp, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-semibold text-gray-900">{exp.position}</div>
                <div className="text-gray-700">{exp.institution}{exp.location && `, ${exp.location}`}</div>
              </div>
              {renderDateRight(exp.dates)}
            </div>
            <ul className="cv-bullet-list pl-6">
              {renderBulletPoints(exp.description)}
            </ul>
          </div>
        ))}
      </section>
      )}

      {/* Honors & Awards */}
      {cvData.honorsAndAwards && cvData.honorsAndAwards.length > 0 && (
      <section id="honorsAndAwards" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-1">
            Honors & Awards
          </h2>
          {cvData.honorsAndAwards && cvData.honorsAndAwards.map((award, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-gray-900">{award.award}</div>
                </div>
                {renderDateRight(award.year)}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Presentations */}
      {cvData.presentations && cvData.presentations.length > 0 && (
      <section id="presentations" className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-1">
          Presentations
        </h2>
        {cvData.presentations.map((pres, index) => (
          <div key={index} className="mb-4">
            <div className="text-gray-700 text-sm leading-relaxed">
              <span className="font-normal">
                {pres.authors && pres.authors.join(', ')} ({pres.date}). <em>{pres.title}</em>. {pres.type}, {pres.venue}.
              </span>
            </div>
          </div>
        ))}
      </section>
      )}

      {/* Professional Memberships */}
      <section id="professionalMemberships" className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-1">
          Professional Memberships & Affiliations
        </h2>
        {cvData.professionalMemberships && cvData.professionalMemberships.map((mem, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-gray-900">{mem.organization}</div>
                {(mem as any).status && (
                  <div className="text-gray-500 text-sm">{(mem as any).status}</div>
                )}
                {(mem as any).certifyingBody && (
                  <div className="text-gray-600 text-sm mt-1">Certifying Body: {(mem as any).certifyingBody}</div>
                )}
                {mem.role && (
                  <div className="text-gray-600 text-sm">{mem.role}</div>
                )}
              </div>
              {renderDateRight(mem.dates)}
            </div>
          </div>
        ))}
      </section>

      {/* Administrative Roles */}
      {cvData.administrativeRoles && cvData.administrativeRoles.length > 0 && (
      <section id="administrativeRoles" className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-1">
          Administrative Roles
        </h2>
        {cvData.administrativeRoles.map((exp, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-semibold text-gray-900">{exp.position}</div>
                <div className="text-gray-700">{exp.organization}</div>
              </div>
              {renderDateRight(exp.dates)}
            </div>
          </div>
        ))}
      </section>
      )}

      {/* Technology & Tools */}
      {cvData.technologyTools && (
        <section id="technologyTools" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-1">
            Technology & Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cvData.technologyTools.map((tool, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="mb-2">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900 text-lg pr-4">{tool.name}</h3>
                    <span className="text-sm text-gray-600 flex-shrink-0">
                      {tool.date}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {tool.description}
                  </p>
                </div>
                  {tool.link && (
                    <div className="mt-3">
                      {tool.link.startsWith('http') ? (
                        <a 
                          href={tool.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Tool
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ) : (
                        <span className="inline-flex items-center text-blue-600 text-sm font-medium">
                          {tool.link}
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </section>
      )}
 
      {/* Selected Trainings & Continuing Education */}
      <section id="trainingAndEducation" className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-1">
          Selected Trainings & Continuing Education
        </h2>
        {cvData.trainingAndEducation && cvData.trainingAndEducation.map((training, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-start mb-1">
              <div>
                <div className="font-semibold text-gray-900">{training.title}</div>
                {training.type && <div className="text-gray-500 text-sm">({training.type})</div>}
                {training.organization && <div className="text-gray-600">{training.organization}</div>}
                {training.presenter && (
                  <div className="text-gray-600 text-sm">Presented by: {training.presenter}</div>
                )}
                {training.presenters && (
                  <div className="text-gray-600 text-sm">
                    Presented by: {training.presenters.join(', ')}
                  </div>
                )}
              </div>
              {renderDateRight(training.date)}
            </div>
          </div>
        ))}
      </section>

      {/* Community Service */}
      {cvData.communityService && cvData.communityService.length > 0 && (
      <section id="communityService" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-1">
            Community Service
          </h2>
          {cvData.communityService.map((service, index) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold text-gray-900">{service.organization}</div>
                  <div className="text-gray-600">{service.location}</div>
                  {service.position && (
                    <div className="text-gray-600 text-sm">Position: {service.position}</div>
                  )}
                </div>
                {renderDateRight(service.dates)}
              </div>
              <ul className="cv-bullet-list">
                {renderBulletPoints(service.activities)}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* References */}
      <section id="references" className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-1">
            References
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cvData.references && cvData.references.map((reference, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="font-semibold text-gray-900">{reference.name}</div>
                <div className="text-gray-700 text-sm">{reference.title}</div>
                <div className="text-gray-700 text-sm">{reference.organization}</div>
                <div className="text-gray-700 text-sm">{reference.location}</div>
                <div className="text-gray-600 text-sm mt-2">
                  <div>{reference.phone}</div>
                  <div>
                    <a 
                      href={`mailto:${reference.email}`} 
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {reference.email}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
    </div>
  );
};

export default CVContent; 