import React, { useState, useEffect } from 'react';
import { Section, CVData } from './types';
import cvData from '../cv_json_data.json';
import LeftNav from './components/LeftNav';
import CVContent from './components/CVContent';
import Chatbot from './components/Chatbot';
import { MessageCircle } from 'lucide-react';

// Simple error boundary for individual components
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; componentName: string },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; componentName: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Error in ${this.props.componentName}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
          <h3 className="text-red-800 font-semibold mb-2">
            {this.props.componentName} Error
          </h3>
          <p className="text-red-600 text-sm">
            Something went wrong loading this component.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Safe component wrapper
const SafeComponent: React.FC<{
  componentName: string;
  children: React.ReactNode;
}> = ({ componentName, children }) => {
  return (
    <ErrorBoundary componentName={componentName}>
      {children}
    </ErrorBoundary>
  );
};

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState('education');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatbotModalOpen, setIsChatbotModalOpen] = useState(false);

  // Scroll tracking to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'education', 'supervisedClinicalExperience', 'evidenceBasedProtocols', 
        'supervisoryExperience', 'additionalClinicalExperience', 'specialProjects', 
        'researchExperience', 'teachingExperience', 'honorsAndAwards', 
        'presentations', 'professionalMemberships', 'administrativeExperience',
        'technologyTools', 'trainingAndEducation', 'communityService', 'references'
      ];
      
      const headerOffset = 100; // Account for fixed header
      let currentSectionId = 'education';
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= headerOffset && rect.bottom >= headerOffset) {
            currentSectionId = sectionId;
            break;
          }
        }
      }
      
      setCurrentSection(currentSectionId);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once to set initial state
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Convert CV data to sections
  const sections: Section[] = [
    { id: 'education', title: 'Education', icon: 'graduation-cap', order: 1 },
    { id: 'supervisedClinicalExperience', title: 'Supervised Clinical Experience', icon: 'briefcase', order: 2 },
    { id: 'evidenceBasedProtocols', title: 'Evidence-Based Protocols', icon: 'award', order: 3 },
    { id: 'supervisoryExperience', title: 'Supervisory Experience', icon: 'users', order: 4 },
    { id: 'additionalClinicalExperience', title: 'Additional Clinical Experience', icon: 'heart', order: 5 },
    { id: 'researchExperience', title: 'Research Experience', icon: 'book-open', order: 6 },
    { id: 'teachingExperience', title: 'Teaching Experience', icon: 'presentation', order: 7 },
    { id: 'honorsAndAwards', title: 'Honors & Awards', icon: 'trophy', order: 8 },
    { id: 'presentations', title: 'Presentations', icon: 'presentation', order: 9 },
    { id: 'administrativeExperience', title: 'Administrative Experience', icon: 'briefcase', order: 10 },
    { id: 'technologyTools', title: 'Technology Tools', icon: 'certificate', order: 11 },
    { id: 'professionalMemberships', title: 'Professional Memberships', icon: 'network', order: 12 },
    { id: 'trainingAndEducation', title: 'Training & Education', icon: 'certificate', order: 13 },
    { id: 'communityService', title: 'Community Service', icon: 'heart', order: 14 },
    { id: 'references', title: 'References', icon: 'user-check', order: 15 }
  ];

  const handleSectionClick = (sectionId: string) => {
    setCurrentSection(sectionId);
    setIsMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      // Account for fixed header height (64px) plus some padding
      const headerOffset = 80;
      const elementPosition = element.offsetTop - headerOffset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleDownloadPDF = () => {
    const link = document.createElement('a');
    const pdfPath = `${import.meta.env.BASE_URL}John_Britton_CV.pdf`;
    link.href = pdfPath;
    link.download = 'John_Britton_CV.pdf';
    link.rel = 'noopener';
    link.target = '_blank';
    link.click();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <SafeComponent componentName="Header">
        <header className="bg-primary-blue text-white shadow-lg fixed top-0 left-0 right-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">{cvData.personalInfo.name}</h1>
                <p className="text-secondary-blue text-base">Clinical Psychology Doctoral Student</p>
              </div>
              <div className="hidden md:flex space-x-4">
                <button
                  onClick={handleDownloadPDF}
                  className="bg-secondary-gold hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Download PDF
                </button>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </header>
      </SafeComponent>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-primary-blue text-white">
          <div className="container mx-auto px-4 py-4">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  className={`block w-full text-left px-3 py-2 rounded ${
                    currentSection === section.id
                      ? 'bg-secondary-blue text-white'
                      : 'text-gray-300 hover:text-white hover:bg-blue-700'
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="pt-16"> {/* Add padding for fixed header */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Navigation - Desktop */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="fixed top-24 left-4 w-64 max-h-[calc(100vh-8rem)] overflow-y-auto z-40">
                <SafeComponent componentName="LeftNav">
                  <LeftNav
                    sections={sections}
                    activeSection={currentSection}
                    onSectionClick={handleSectionClick}
                  />
                </SafeComponent>
              </div>
            </div>

            {/* CV Content */}
            <div className="lg:col-span-6 lg:col-start-4">
              <SafeComponent componentName="CVContent">
                <CVContent cvData={cvData} />
              </SafeComponent>
            </div>

            {/* Chatbot - Full Right Sidebar */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="fixed top-24 right-0 bottom-0 w-1/4 h-[calc(100vh-6rem)] z-40 flex flex-col">
                <SafeComponent componentName="Chatbot">
                  <Chatbot cvData={cvData as CVData} />
                </SafeComponent>
              </div>
            </div>
          </div>
        </div>
        {/* Floating Chat Button for <lg screens */}
        <button
          className="fixed z-50 bottom-6 right-6 bg-primary-blue text-white rounded-full shadow-lg p-4 flex items-center justify-center lg:hidden hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary-blue"
          aria-label="Open chat assistant"
          onClick={() => setIsChatbotModalOpen(true)}
        >
          <MessageCircle size={28} />
        </button>

        {/* Chatbot Modal for <lg screens */}
        {isChatbotModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-auto flex flex-col h-[80vh] relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-2 rounded focus:outline-none"
                aria-label="Close chat assistant"
                onClick={() => setIsChatbotModalOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <SafeComponent componentName="ChatbotModal">
                <Chatbot cvData={cvData as CVData} />
              </SafeComponent>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <SafeComponent componentName="Footer">
        <footer className="bg-gray-100 text-gray-600 py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm">
              Interactive CV built with AI assistance (OpenAI, React, TypeScript)
            </p>
          </div>
        </footer>
      </SafeComponent>
    </div>
  );
};

export default App; 