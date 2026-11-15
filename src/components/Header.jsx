import React from 'react';
import { GraduationCap, CalendarDays, Upload, Layers } from 'lucide-react';

export default function Header({ sheetCount, onOpenUpload }) {
  return (
    <header className="header-container">
      <div className="header-inner">
        {/* University Brand & Logo */}
        <div className="brand-group">
          <div className="brand-icon-wrapper">
            <GraduationCap className="brand-icon" size={28} />
          </div>
          <div className="brand-text">
            <div className="university-title">LOKESWAR REDDY</div>
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

          <button
            type="button"
            onClick={onOpenUpload}
            className="header-upload-btn"
            title="Upload or Update Excel Workbook"
          >
            <Upload size={16} />
            <span>Upload Excel</span>
          </button>
        </div>
      </div>
    </header>
  );
}
