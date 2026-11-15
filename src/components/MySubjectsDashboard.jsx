import React from 'react';
import {
  ArrowLeft,
  GraduationCap,
  BookOpen,
  Users,
  CalendarCheck2,
  Info,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import SubjectCard from './SubjectCard';
import { studentProfile, studentSubjects } from '../data/studentData';

export default function MySubjectsDashboard({ onBackToSchedule, onSearchSubjectInSchedule }) {
  return (
    <div className="my-subjects-dashboard">
      {/* Top Navigation & Breadcrumbs */}
      <div className="dashboard-nav-bar">
        <button
          type="button"
          onClick={onBackToSchedule}
          className="back-btn"
          title="Return to Exam Schedule Finder"
        >
          <ArrowLeft size={18} />
          <span>Back to Schedule Search</span>
        </button>

        <div className="dashboard-status-tag">
          <ShieldCheck size={15} className="text-emerald" />
          <span>Student Portal Verification Active</span>
        </div>
      </div>

      {/* Hero Welcome Banner */}
      <div className="student-welcome-hero">
        <div className="welcome-badge">
          <GraduationCap size={16} />
          <span>Student Academic Dashboard</span>
        </div>

        <h1 className="welcome-title">
          Welcome, {studentProfile.name}!
        </h1>

        <p className="welcome-subtitle">
          Here are your registered subjects and sections.
        </p>

        <div className="student-meta-strip">
          <span className="student-meta-item">
            <strong>Program:</strong> {studentProfile.degree}
          </span>
          <span className="meta-bullet">•</span>
          <span className="student-meta-item">
            <strong>Term:</strong> {studentProfile.academicYear} ({studentProfile.semester})
          </span>
        </div>
      </div>

      {/* Summary Statistics Cards */}
      <div className="student-stats-grid">
        <div className="student-stat-card stat-blue">
          <div className="stat-card-icon-box">
            <BookOpen size={24} />
          </div>
          <div className="stat-card-details">
            <div className="stat-card-number">{studentProfile.totalSubjects}</div>
            <div className="stat-card-label">Total Subjects</div>
            <div className="stat-card-desc">Active course registrations</div>
          </div>
        </div>

        <div className="student-stat-card stat-emerald">
          <div className="stat-card-icon-box">
            <Users size={24} />
          </div>
          <div className="stat-card-details">
            <div className="stat-card-number">{studentProfile.totalSections}</div>
            <div className="stat-card-label">Total Sections</div>
            <div className="stat-card-desc">Allocated laboratory & lecture sections</div>
          </div>
        </div>

        <div className="student-stat-card stat-purple">
          <div className="stat-card-icon-box">
            <CalendarCheck2 size={24} />
          </div>
          <div className="stat-card-details">
            <div className="stat-card-number">2026–27</div>
            <div className="stat-card-label">Academic Year</div>
            <div className="stat-card-desc">Odd Semester Examination Cycle</div>
          </div>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="registration-notice-banner">
        <Info size={20} className="notice-icon" />
        <div className="notice-content">
          <strong>Academic Registration Record:</strong> These cards display your official registered subjects and assigned sections for the current semester. To find confirmed examination dates, timings, and laboratory room numbers, return to the Exam Schedule Finder.
        </div>
      </div>

      {/* Grid of Subject Cards */}
      <div className="my-subjects-section">
        <div className="section-title-wrap">
          <div className="title-left">
            <Sparkles size={20} className="text-primary-royal" />
            <h2 className="section-heading">Registered Subjects & Assigned Sections</h2>
          </div>
          <span className="subject-counter-pill">
            {studentSubjects.length} Registered Courses
          </span>
        </div>

        <div className="personal-subjects-grid">
          {studentSubjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onCheckSchedule={onSearchSubjectInSchedule}
            />
          ))}
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="dashboard-bottom-bar">
        <button
          type="button"
          onClick={onBackToSchedule}
          className="btn-primary back-schedule-primary"
        >
          <ArrowLeft size={16} />
          <span>Back to Schedule Search</span>
        </button>
      </div>
    </div>
  );
}
