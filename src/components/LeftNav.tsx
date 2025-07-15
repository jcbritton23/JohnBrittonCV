import React, { useState } from 'react';
import { LeftNavProps } from '../types';
import { 
  GraduationCap, 
  Briefcase, 
  Heart, 
  TestTube, 
  BookOpen, 
  Presentation, 
  Award, 
  FileText, 
  Users, 
  Trophy, 
  Network, 
  UserCheck,
  Menu,
  X
} from 'lucide-react';

const LeftNav: React.FC<LeftNavProps> = ({ sections, activeSection, onSectionClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      'graduation-cap': GraduationCap,
      'briefcase': Briefcase,
      'heart': Heart,
      'flask': TestTube,
      'book-open': BookOpen,
      'presentation': Presentation,
      'award': Award,
      'certificate': FileText,
      'users': Users,
      'trophy': Trophy,
      'network': Network,
      'user-check': UserCheck,
    };
    
    return iconMap[iconName] || GraduationCap;
  };

  const handleSectionClick = (sectionId: string) => {
    onSectionClick(sectionId);
    setIsMobileMenuOpen(false); // Close mobile menu after selection
  };

  const renderNavItems = () => {
    return sections.map((section) => {
      const Icon = getIcon(section.icon);
      const isActive = activeSection === section.id;
      
      return (
        <button
          key={section.id}
          onClick={() => handleSectionClick(section.id)}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 hover:bg-surface focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 ${
            isActive 
              ? 'bg-primary-blue text-white shadow-lg' 
              : 'text-text-secondary hover:text-text-primary'
          }`}
          aria-current={isActive ? 'page' : undefined}
        >
          <Icon 
            size={20} 
            className={`flex-shrink-0 ${
              isActive ? 'text-white' : 'text-text-secondary'
            }`}
          />
          <span className="text-sm font-medium truncate">
            {section.title}
          </span>
        </button>
      );
    });
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 space-y-1" aria-label="CV sections">
        {renderNavItems()}
      </nav>

      {/* Mobile Navigation */}
      <div className="lg:hidden print:hidden">
        {/* Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="fixed top-20 left-4 z-50 p-2 bg-primary-blue text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
        )}

        {/* Mobile Menu Panel */}
        <div className={`fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-primary-blue">Navigation</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700"
                aria-label="Close navigation menu"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="space-y-2" aria-label="CV sections">
              {renderNavItems()}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftNav; 