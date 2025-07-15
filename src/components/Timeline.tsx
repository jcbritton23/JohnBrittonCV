import React from 'react';
import { TimelineProps } from '../types';
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
  UserCheck 
} from 'lucide-react';

const Timeline: React.FC<TimelineProps> = ({ sections, onTimelineClick }) => {
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

  return (
    <div className="sticky top-4 print:hidden">
      <h3 className="text-lg font-semibold text-primary-blue mb-4">Timeline</h3>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>
        
        {/* Timeline items */}
        <div className="space-y-4">
          {sections.map((section) => {
            const Icon = getIcon(section.icon);
            
            return (
              <button
                key={section.id}
                onClick={() => onTimelineClick(section.id)}
                className="relative flex items-center space-x-4 w-full text-left hover:bg-surface rounded-lg p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
              >
                {/* Timeline dot */}
                <div className="relative z-10 flex-shrink-0 w-12 h-12 bg-primary-blue rounded-full flex items-center justify-center shadow-lg">
                  <Icon size={20} className="text-white" />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {section.title}
                  </p>
                  <p className="text-xs text-text-secondary">
                    Section {section.order}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Timeline; 