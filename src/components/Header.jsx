import React from 'react';
import {
  GraduationCap,
  CalendarDays,
  Upload,
  Layers,
  CalendarSearch
} from 'lucide-react';
import StudentDropdown from './StudentDropdown';

export default function Header({
  sheetCount,
  onOpenUpload,
  currentView,
  selectedStudent,
  onSelectStudent,
  onNavigateToSchedule
}) {
  return (
    <header className="header-container">
      <div className="header-inner">
        {/* University Brand & Logo */}
        <div
          className="brand-group"
          onClick={onNavigateToSchedule}
          style={{ cursor: 'pointer' }}
          title="Return to KL University Schedule Finder"
        >
          <div className="brand-icon-wrapper">
            <GraduationCap className="brand-icon" size={28} />
          </div>
          <div className="brand-text">
            <div className="university-title">K L DEEMED TO BE UNIVERSITY</div>
            <div className="portal-name">KL Schedule Finder</div>
          </div>
        </div>

        {/* Academic Meta Badges */}
        <div className="meta-group">
          <div className="meta-pill academic-pill">
            <CalendarDays size={16} className="meta-icon" />
            <span className="meta-label">Academic Year:</span>
            <strong className="meta-value">2026–27</strong>
          </div>

          <div className="meta-pill semester-pill">
            <span className="semester-indicator"></span>
            <span className="meta-label">Term:</span>
            <strong className="meta-value">Odd Semester</strong>
          </div>

          {sheetCount > 0 && (
            <div className="meta-pill status-pill">
              <Layers size={15} className="meta-icon" />
              <span>{sheetCount} Sheets Loaded</span>
            </div>
          )}

          {currentView === 'student-timetable' && (
            <button
              type="button"
              onClick={onNavigateToSchedule}
              className="meta-pill general-search-btn"
              title="Return to General Schedule Search"
            >
              <CalendarSearch size={15} />
              <span>General Schedule</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenUpload}
            className="header-upload-btn"
            title="Upload or Update Excel Workbook"
          >
            <Upload size={16} />
            <span>Upload Excel</span>
          </button>

          {/* Student Selector Dropdown with 4 Students */}
          <StudentDropdown
            selectedStudent={selectedStudent}
            onSelectStudent={onSelectStudent}
          />
        </div>
      </div>
    </header>
  );
}
