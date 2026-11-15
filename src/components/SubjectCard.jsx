import React from 'react';
import {
  Database,
  Landmark,
  Network,
  Brain,
  Cpu,
  BookOpen,
  Search,
  CheckCircle2,
  BookmarkCheck
} from 'lucide-react';

export default function SubjectCard({ subject, onCheckSchedule }) {
  // Select matching Lucide icon based on subject configuration
  const renderSubjectIcon = () => {
    switch (subject.iconType) {
      case 'database':
        return <Database size={24} className="subject-icon" />;
      case 'landmark':
        return <Landmark size={24} className="subject-icon" />;
      case 'network':
        return <Network size={24} className="subject-icon" />;
      case 'brain':
        return <Brain size={24} className="subject-icon" />;
      case 'cpu':
        return <Cpu size={24} className="subject-icon" />;
      default:
        return <BookOpen size={24} className="subject-icon" />;
    }
  };

  return (
    <div className={`personal-subject-card ${subject.accentColor}`}>
      {/* Top Header Bar */}
      <div className="personal-card-header">
        <div className="personal-icon-box">
          {renderSubjectIcon()}
        </div>
        <div className="personal-badges">
          <span className="registered-badge">
            <CheckCircle2 size={13} />
            <span>Registered</span>
          </span>
          <span className="personal-sec-badge">
            {subject.section}
          </span>
        </div>
      </div>

      {/* Course Code & Name */}
      <div className="personal-card-body">
        <div className="personal-code-tag">
          <BookmarkCheck size={14} className="code-icon" />
          <span>{subject.courseCode}</span>
        </div>

        <h3 className="personal-course-name">{subject.courseName}</h3>

        <div className="personal-category">
          <span>{subject.category}</span>
        </div>

        <p className="personal-description">{subject.description}</p>
      </div>

      <div className="personal-card-divider" />

      {/* Card Footer with Section & Quick Search Action */}
      <div className="personal-card-footer">
        <div className="section-info">
          <span className="section-label">Assigned Section</span>
          <strong className="section-value">{subject.section}</strong>
        </div>

        {onCheckSchedule && (
          <button
            type="button"
            onClick={() => onCheckSchedule(subject.courseCode)}
            className="check-schedule-btn"
            title={`Search exam schedule for ${subject.courseCode}`}
          >
            <Search size={14} />
            <span>Search Schedule</span>
          </button>
        )}
      </div>
    </div>
  );
}
