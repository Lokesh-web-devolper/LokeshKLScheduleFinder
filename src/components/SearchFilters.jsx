import React from 'react';
import {
  GraduationCap,
  BookOpen,
  Users,
  Search,
  RotateCcw,
  SlidersHorizontal,
  Building
} from 'lucide-react';

export default function SearchFilters({
  academicYears,
  selectedYear,
  onYearChange,
  availableSubjects,
  selectedSubject,
  onSubjectChange,
  availableSections,
  selectedSection,
  onSectionChange,
  searchQuery,
  onSearchQueryChange,
  onSearch,
  onReset,
  resultsCount,
  totalCount
}) {
  const isFiltered =
    (selectedYear && selectedYear !== 'ALL') ||
    (selectedSubject && selectedSubject !== 'ALL') ||
    (selectedSection && selectedSection !== 'ALL') ||
    Boolean(searchQuery.trim());

  return (
    <div className="search-filters-card">
      <div className="filters-header">
        <div className="filters-title-group">
          <SlidersHorizontal className="filters-icon" size={20} />
          <h2 className="filters-title">Filter & Search Schedules</h2>
        </div>
        <div className="filter-summary-badge">
          Showing <strong>{resultsCount}</strong> of <strong>{totalCount}</strong> schedules
        </div>
      </div>

      <div className="filters-grid">
        {/* 1. Academic Year Dropdown */}
        <div className="filter-control-group">
          <label htmlFor="academic-year-select" className="filter-label">
            <GraduationCap size={16} className="label-icon" />
            <span>Academic Year</span>
          </label>
          <div className="select-wrapper">
            <select
              id="academic-year-select"
              value={selectedYear}
              onChange={(e) => onYearChange(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Academic Years</option>
              {academicYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2. Subject Dropdown (Displays actual subject name + code) */}
        <div className="filter-control-group">
          <label htmlFor="subject-select" className="filter-label">
            <BookOpen size={16} className="label-icon" />
            <span>Subject / Course</span>
          </label>
          <div className="select-wrapper">
            <select
              id="subject-select"
              value={selectedSubject}
              onChange={(e) => onSubjectChange(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">
                All Subjects {availableSubjects.length > 0 ? `(${availableSubjects.length} available)` : ''}
              </option>
              {availableSubjects.map((sub) => (
                <option key={sub.courseCode} value={sub.courseCode}>
                  {sub.courseCode} — {sub.courseName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. Section Dropdown (Filtered dynamically by subject) */}
        <div className="filter-control-group">
          <label htmlFor="section-select" className="filter-label">
            <Users size={16} className="label-icon" />
            <span>Section</span>
          </label>
          <div className="select-wrapper">
            <select
              id="section-select"
              value={selectedSection}
              onChange={(e) => onSectionChange(e.target.value)}
              className="filter-select"
              disabled={availableSections.length === 0}
            >
              <option value="ALL">
                All Sections {availableSections.length > 0 ? `(${availableSections.length})` : ''}
              </option>
              {availableSections.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4. Keyword Search Input */}
        <div className="filter-control-group">
          <label htmlFor="keyword-search-input" className="filter-label">
            <Building size={16} className="label-icon" />
            <span>Search Text (Venue / Room / Code)</span>
          </label>
          <div className="input-search-wrapper">
            <Search size={16} className="input-search-icon" />
            <input
              id="keyword-search-input"
              type="text"
              placeholder="e.g. C519, R706B, CSE, F102..."
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="filter-input"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="filter-actions-bar">
        <div className="active-filter-chips">
          {selectedYear && selectedYear !== 'ALL' && (
            <span className="filter-chip">
              Year: <strong>{selectedYear}</strong>
            </span>
          )}
          {selectedSubject && selectedSubject !== 'ALL' && (
            <span className="filter-chip">
              Subject: <strong>{selectedSubject}</strong>
            </span>
          )}
          {selectedSection && selectedSection !== 'ALL' && (
            <span className="filter-chip">
              Section: <strong>{selectedSection}</strong>
            </span>
          )}
          {searchQuery && (
            <span className="filter-chip">
              Query: <strong>"{searchQuery}"</strong>
            </span>
          )}
        </div>

        <div className="filter-btn-group">
          <button
            type="button"
            onClick={onReset}
            disabled={!isFiltered}
            className={`btn-secondary ${!isFiltered ? 'btn-disabled' : ''}`}
            title="Reset all filters to default"
          >
            <RotateCcw size={16} />
            <span>Reset Filters</span>
          </button>

          <button
            type="button"
            onClick={onSearch}
            className="btn-primary"
            title="Apply filters"
          >
            <Search size={16} />
            <span>Find Schedule</span>
          </button>
        </div>
      </div>
    </div>
  );
}
