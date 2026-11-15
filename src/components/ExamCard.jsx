import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  Tag,
  BookOpen,
  Copy,
  Check,
  AlertCircle,
  CalendarCheck2,
  Database,
  Landmark,
  Network,
  Brain,
  Cpu,
  Shield,
  Bot,
  Code
} from 'lucide-react';

export default function ExamCard({ exam, index = 0 }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!exam.isFound) return;
    const textToCopy = `KL University Examination Timetable
Subject: ${exam.subjectName} (${exam.courseCode})
Section: ${exam.section}
Date: ${exam.examDate}
Timing: ${exam.examTime}
Venue: ${exam.venue}
Department: ${exam.department}${exam.ltps ? `\nLTPS: ${exam.ltps}` : ''}`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const renderSubjectIcon = () => {
    switch (exam.iconType) {
      case 'database':
        return <Database size={20} />;
      case 'landmark':
        return <Landmark size={20} />;
      case 'network':
        return <Network size={20} />;
      case 'brain':
        return <Brain size={20} />;
      case 'cpu':
        return <Cpu size={20} />;
      case 'shield':
        return <Shield size={20} />;
      case 'bot':
        return <Bot size={20} />;
      case 'code':
        return <Code size={20} />;
      default:
        return <BookOpen size={20} />;
    }
  };

  // Subtle accent themes for subject cards
  const colorThemes = [
    'accent-blue-card',
    'accent-emerald-card',
    'accent-indigo-card',
    'accent-purple-card',
    'accent-amber-card',
    'accent-teal-card'
  ];
  const accentClass = colorThemes[index % colorThemes.length];

  return (
    <div
      className={`exam-timetable-card ${accentClass} ${
        exam.isFound ? 'exam-confirmed' : 'exam-not-found'
      }`}
    >
      {/* Top Header Bar */}
      <div className="exam-card-top-bar">
        <div className="exam-card-badges">
          <div className="exam-subject-icon-box">
            {renderSubjectIcon()}
          </div>
          <span className="exam-code-badge">{exam.courseCode}</span>
          <span className="exam-section-badge">{exam.section}</span>
          {exam.ltps && (
            <span className="exam-ltps-badge" title="Course Type / LTPS">
              <Tag size={11} />
              <span>LTPS: {exam.ltps}</span>
            </span>
          )}
        </div>

        {exam.isFound && (
          <button
            type="button"
            onClick={handleCopy}
            className="exam-copy-btn"
            title="Copy examination details"
            aria-label="Copy examination details"
          >
            {copied ? <Check size={15} className="text-emerald" /> : <Copy size={15} />}
          </button>
        )}
      </div>

      {/* Subject Name Heading */}
      <div className="exam-title-group">
        <h3 className="exam-subject-heading">{exam.subjectName}</h3>
        {exam.category && <span className="exam-category-text">{exam.category}</span>}
      </div>

      <div className="exam-divider" />

      {/* Examination Details or Unavailable State */}
      {exam.isFound ? (
        <div className="exam-details-grid">
          {/* Exam Date */}
          <div className="exam-detail-row highlight-date">
            <div className="exam-icon-circle icon-date">
              <Calendar size={18} />
            </div>
            <div className="exam-detail-text">
              <span className="exam-label">Examination Date</span>
              <strong className="exam-val date-val">{exam.examDate}</strong>
            </div>
          </div>

          {/* Exam Timing */}
          <div className="exam-detail-row highlight-time">
            <div className="exam-icon-circle icon-time">
              <Clock size={18} />
            </div>
            <div className="exam-detail-text">
              <span className="exam-label">Examination Timing</span>
              <strong className="exam-val time-val">{exam.examTime}</strong>
              {exam.duration && (
                <span className="exam-duration">Duration: {exam.duration}</span>
              )}
            </div>
          </div>

          {/* Exam Venue / Room Number */}
          <div className="exam-detail-row highlight-venue">
            <div className="exam-icon-circle icon-venue">
              <MapPin size={18} />
            </div>
            <div className="exam-detail-text">
              <span className="exam-label">Examination Venue / Room</span>
              <strong className="exam-val venue-val">{exam.venue}</strong>
            </div>
          </div>

          {/* Department */}
          <div className="exam-detail-row">
            <div className="exam-icon-circle icon-dept">
              <Building2 size={18} />
            </div>
            <div className="exam-detail-text">
              <span className="exam-label">Offered By Department</span>
              <span className="exam-val">{exam.department}</span>
            </div>
          </div>
        </div>
      ) : (
        /* Schedule Not Available State */
        <div className="exam-unavailable-box">
          <div className="unavailable-icon-wrap">
            <AlertCircle size={22} className="text-amber" />
          </div>
          <div className="unavailable-content">
            <strong className="unavailable-title">
              Exam schedule not available for this subject/section.
            </strong>
            <p className="unavailable-desc">
              No matching examination record found in worksheet <em>Y24 III BTECH</em> for{' '}
              <strong>{exam.courseCode}</strong> in <strong>{exam.section}</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Card Footer */}
      <div className="exam-card-footer">
        <div className="exam-status-indicator">
          {exam.isFound ? (
            <span className="status-confirmed-pill">
              <CalendarCheck2 size={13} />
              <span>Timetable Confirmed</span>
            </span>
          ) : (
            <span className="status-pending-pill">
              <AlertCircle size={13} />
              <span>Exam Schedule Not Available</span>
            </span>
          )}
        </div>
        <div className="exam-source-tag">
          <span>Source: {exam.sourceSheet}</span>
        </div>
      </div>
    </div>
  );
}
