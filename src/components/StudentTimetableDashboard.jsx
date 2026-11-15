import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  CalendarDays,
  Search,
  BookOpen,
  CalendarCheck,
  Building,
  GraduationCap,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import ExamCard from './ExamCard';
import { matchStudentExamSchedule } from '../utils/scheduleUtils';

export default function StudentTimetableDashboard({
  student,
  schedules,
  onBackToSchedule
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Match student subjects with sheet 'Y24 III BTECH' in schedules
  const matchedExams = useMemo(() => {
    return matchStudentExamSchedule(student, schedules);
  }, [student, schedules]);

  // Filter exams by live keyword search (course code or subject name)
  const filteredExams = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return matchedExams;
    return matchedExams.filter((exam) => {
      const name = exam.subjectName.toLowerCase();
      const code = exam.courseCode.toLowerCase();
      const sec = exam.section.toLowerCase();
      const venue = exam.venue.toLowerCase();
      return name.includes(q) || code.includes(q) || sec.includes(q) || venue.includes(q);
    });
  }, [matchedExams, searchQuery]);

  // Summary counts
  const confirmedCount = useMemo(() => {
    return matchedExams.filter((e) => e.isFound).length;
  }, [matchedExams]);

  const missingCount = matchedExams.length - confirmedCount;

  return (
    <div className="student-timetable-dashboard">
      {/* Top Navigation & View Switcher */}
      <div className="timetable-top-nav">
        <button
          type="button"
          onClick={onBackToSchedule}
          className="timetable-back-btn"
          title="Return to General Schedule Search"
        >
          <ArrowLeft size={18} />
          <span>General Schedule Search</span>
        </button>

        <div className="nav-view-pills">
          <button
            type="button"
            onClick={onBackToSchedule}
            className="nav-tab-pill"
          >
            All Exams (General)
          </button>
          <span className="nav-tab-pill active">
            My Exams ({student.name})
          </span>
        </div>

        <div className="timetable-status-indicator">
          <FileSpreadsheet size={15} className="text-royal" />
          <span>Worksheet Source: <strong>Y24 III BTECH</strong></span>
        </div>
      </div>

      {/* Student Profile Hero Banner */}
      <div className="student-hero-banner">
        <div className="student-hero-content">
          <div className="hero-top-badges">
            <span className="hero-program-pill">
              <GraduationCap size={15} />
              <span>{student.programme} • {student.year}</span>
            </span>

            <span className="hero-verified-pill">
              <CheckCircle2 size={13} />
              <span>Official Student Registration</span>
            </span>
          </div>

          {/* Prominent Student Name */}
          <h1 className="student-hero-name">
            {student.name}
          </h1>

          <p className="student-hero-subtitle">
            Personalized III B.Tech Semester Examination Timetable
          </p>

          {/* Academic Profile Details Strip */}
          <div className="academic-meta-strip">
            <div className="meta-item">
              <span className="meta-key">Academic Year:</span>
              <strong className="meta-value">{student.academicYear}</strong>
            </div>
            <span className="meta-divider">|</span>
            <div className="meta-item">
              <span className="meta-key">Programme:</span>
              <strong className="meta-value">{student.programme}</strong>
            </div>
            <span className="meta-divider">|</span>
            <div className="meta-item">
              <span className="meta-key">Year:</span>
              <strong className="meta-value">{student.year}</strong>
            </div>
            <span className="meta-divider">|</span>
            <div className="meta-item">
              <span className="meta-key">Semester:</span>
              <strong className="meta-value">{student.semester}</strong>
            </div>
            <span className="meta-divider">|</span>
            <div className="meta-item">
              <span className="meta-key">Department:</span>
              <strong className="meta-value">{student.department}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Statistics Cards */}
      <div className="timetable-stats-row">
        <div className="t-stat-card card-blue">
          <div className="t-stat-icon">
            <BookOpen size={22} />
          </div>
          <div className="t-stat-data">
            <span className="t-stat-number">{student.subjects.length}</span>
            <span className="t-stat-label">Total Registered Subjects</span>
            <span className="t-stat-hint">Active semester courses</span>
          </div>
        </div>

        <div className="t-stat-card card-emerald">
          <div className="t-stat-icon">
            <CalendarCheck size={22} />
          </div>
          <div className="t-stat-data">
            <span className="t-stat-number">{confirmedCount}</span>
            <span className="t-stat-label">Matching Exam Records</span>
            <span className="t-stat-hint">Confirmed dates & rooms</span>
          </div>
        </div>

        <div className="t-stat-card card-amber">
          <div className="t-stat-icon">
            <CalendarDays size={22} />
          </div>
          <div className="t-stat-data">
            <span className="t-stat-number">{confirmedCount}</span>
            <span className="t-stat-label">Upcoming Examinations</span>
            <span className="t-stat-hint">Scheduled exam slots</span>
          </div>
        </div>

        <div className="t-stat-card card-purple">
          <div className="t-stat-icon">
            <Building size={22} />
          </div>
          <div className="t-stat-data">
            <span className="t-stat-number">
              {missingCount === 0 ? 'All Synced' : `${missingCount} Pending`}
            </span>
            <span className="t-stat-label">Section Sync Status</span>
            <span className="t-stat-hint">Y24 III BTECH verification</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="timetable-search-bar-wrap">
        <div className="timetable-search-input-box">
          <Search size={18} className="search-icon-inside" />
          <input
            type="text"
            placeholder="Search by subject name or course code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="timetable-search-input"
            aria-label="Filter timetable subjects"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className="search-status-text">
          Showing <strong>{filteredExams.length}</strong> of <strong>{matchedExams.length}</strong> subjects
        </div>
      </div>

      {/* Complete Subject-Wise Exam Timetable Cards */}
      <div className="timetable-cards-section">
        <div className="section-header-row">
          <div className="section-title-box">
            <Sparkles size={18} className="section-sparkle" />
            <h2 className="section-title-text">
              Complete Subject-Wise Examination Timetable
            </h2>
          </div>
          <span className="sorted-notice">
            Sorted Chronologically by Date & Time
          </span>
        </div>

        {filteredExams.length > 0 ? (
          <div className="exam-cards-grid">
            {filteredExams.map((exam, idx) => (
              <ExamCard key={exam.id} exam={exam} index={idx} />
            ))}
          </div>
        ) : (
          <div className="no-matches-box">
            <AlertCircle size={36} className="text-amber" />
            <h4>No subjects match "{searchQuery}"</h4>
            <p>Try clearing your search query to view all registered subjects for {student.name}.</p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="empty-reset-btn"
            >
              <RotateCcw size={15} />
              <span>Reset Search</span>
            </button>
          </div>
        )}
      </div>

      {/* Return to Schedule Bottom Bar */}
      <div className="timetable-bottom-action-bar">
        <button
          type="button"
          onClick={onBackToSchedule}
          className="btn-primary"
        >
          <ArrowLeft size={16} />
          <span>Return to General Schedule Search</span>
        </button>
      </div>
    </div>
  );
}
