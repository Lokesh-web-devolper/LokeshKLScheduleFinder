import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import Statistics from './components/Statistics';
import SearchFilters from './components/SearchFilters';
import ScheduleCard from './components/ScheduleCard';
import ExcelUpload from './components/ExcelUpload';
import Footer from './components/Footer';

import { parseExcelWorkbook } from './utils/excelParser';
import {
  filterSchedules,
  getAcademicYears,
  getSubjectsForYear,
  getSectionsForSubject,
  calculateStatistics
} from './utils/scheduleUtils';

import {
  RotateCcw,
  LayoutGrid,
  List,
  AlertCircle,
  FileSpreadsheet,
  Calendar,
  ChevronDown
} from 'lucide-react';

export default function App() {
  const [schedules, setSchedules] = useState([]);
  const [sheetData, setSheetData] = useState({
    sheets: [],
    totalRawRows: 0,
    totalGroupedSchedules: 0,
    fileName: 'schedule.xlsx'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [isDefaultLoaded, setIsDefaultLoaded] = useState(true);

  // Filter States
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [selectedSection, setSelectedSection] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Applied Filters State (committed on Search click or real-time query)
  const [appliedFilters, setAppliedFilters] = useState({
    academicYear: 'ALL',
    subject: 'ALL',
    section: 'ALL',
    searchQuery: ''
  });

  // View mode: 'grid' or 'table'
  const [viewMode, setViewMode] = useState('grid');
  // Visible items limit for high performance
  const [displayLimit, setDisplayLimit] = useState(24);

  // Load preloaded Excel data from public/data/schedule.xlsx on mount
  const loadDefaultWorkbook = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/data/schedule.xlsx');
      if (!response.ok) {
        throw new Error(
          `Could not load default schedule file (${response.status} ${response.statusText}). Please upload your workbook.`
        );
      }
      const arrayBuffer = await response.arrayBuffer();
      const parsed = parseExcelWorkbook(arrayBuffer);

      setSchedules(parsed.schedules);
      setSheetData({
        sheets: parsed.sheets,
        totalRawRows: parsed.totalRawRows,
        totalGroupedSchedules: parsed.totalGroupedSchedules,
        fileName: '2026-27 ODD SEM II,III,IV END SEM LABSKILL SCHEDULE'
      });
      setIsDefaultLoaded(true);
    } catch (err) {
      console.warn('Initial workbook fetch warning:', err);
      setError(err.message || 'Please upload the Excel workbook to view schedules.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDefaultWorkbook();
  }, []);

  // Handler when user uploads a custom Excel workbook
  const handleWorkbookLoaded = (newWorkbookData) => {
    setSchedules(newWorkbookData.schedules);
    setSheetData({
      sheets: newWorkbookData.sheets,
      totalRawRows: newWorkbookData.totalRawRows,
      totalGroupedSchedules: newWorkbookData.totalGroupedSchedules,
      fileName: newWorkbookData.fileName || 'Uploaded Workbook'
    });
    setIsDefaultLoaded(false);
    setError(null);

    // Reset filters
    setSelectedYear('ALL');
    setSelectedSubject('ALL');
    setSelectedSection('ALL');
    setSearchQuery('');
    setAppliedFilters({
      academicYear: 'ALL',
      subject: 'ALL',
      section: 'ALL',
      searchQuery: ''
    });
    setDisplayLimit(24);
  };

  // Handler when user clicks "Restore Default"
  const handleResetToDefault = () => {
    loadDefaultWorkbook();
    setSelectedYear('ALL');
    setSelectedSubject('ALL');
    setSelectedSection('ALL');
    setSearchQuery('');
    setAppliedFilters({
      academicYear: 'ALL',
      subject: 'ALL',
      section: 'ALL',
      searchQuery: ''
    });
    setUploadModalOpen(false);
  };

  // Dynamic filter dropdown dependencies
  const academicYears = useMemo(() => {
    return getAcademicYears(schedules);
  }, [schedules]);

  const availableSubjects = useMemo(() => {
    return getSubjectsForYear(schedules, selectedYear);
  }, [schedules, selectedYear]);

  const availableSections = useMemo(() => {
    return getSectionsForSubject(schedules, selectedYear, selectedSubject);
  }, [schedules, selectedYear, selectedSubject]);

  // Handle year change: auto-reset subject and section
  const handleYearChange = (year) => {
    setSelectedYear(year);
    setSelectedSubject('ALL');
    setSelectedSection('ALL');
  };

  // Handle subject change: auto-reset section
  const handleSubjectChange = (subj) => {
    setSelectedSubject(subj);
    setSelectedSection('ALL');
  };

  // Trigger search action
  const handleSearchSubmit = () => {
    setAppliedFilters({
      academicYear: selectedYear,
      subject: selectedSubject,
      section: selectedSection,
      searchQuery: searchQuery.trim()
    });
    setDisplayLimit(24);

    // Smooth scroll to results
    const resultsEl = document.getElementById('schedule-results-anchor');
    if (resultsEl) {
      resultsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSelectedYear('ALL');
    setSelectedSubject('ALL');
    setSelectedSection('ALL');
    setSearchQuery('');
    setAppliedFilters({
      academicYear: 'ALL',
      subject: 'ALL',
      section: 'ALL',
      searchQuery: ''
    });
    setDisplayLimit(24);
  };

  // Filtered schedule results based on committed filters or live search query
  const filteredSchedules = useMemo(() => {
    return filterSchedules(schedules, {
      academicYear: appliedFilters.academicYear,
      subject: appliedFilters.subject,
      section: appliedFilters.section,
      searchQuery: appliedFilters.searchQuery || searchQuery
    });
  }, [schedules, appliedFilters, searchQuery]);

  // Dynamic statistics calculated on current active workbook data
  const statistics = useMemo(() => {
    return calculateStatistics(schedules);
  }, [schedules]);

  // Paginated/Sliced schedules for smooth DOM rendering
  const visibleSchedules = useMemo(() => {
    return filteredSchedules.slice(0, displayLimit);
  }, [filteredSchedules, displayLimit]);

  const hasMore = displayLimit < filteredSchedules.length;

  return (
    <div className="app-layout">
      {/* 1. Header */}
      <Header
        sheetCount={sheetData.sheets.length}
        onOpenUpload={() => setUploadModalOpen(true)}
      />

      <main className="main-content">
        {/* 2. Hero Section */}
        <Hero
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
        />

        {/* 3. Dashboard Statistics */}
        <div className="content-container">
          <Statistics
            statistics={statistics}
            sheetCount={sheetData.sheets.length}
            totalRawRows={sheetData.totalRawRows}
          />

          {/* Error Banner if any */}
          {error && (
            <div className="error-banner">
              <AlertCircle size={22} className="error-icon" />
              <div className="error-content">
                <strong>Schedule Data Notice:</strong> {error}
                <div className="error-action">
                  <button
                    type="button"
                    onClick={() => setUploadModalOpen(true)}
                    className="error-upload-btn"
                  >
                    <FileSpreadsheet size={16} />
                    <span>Upload Excel File Now</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. Main Search Filters */}
          <div id="schedule-results-anchor" className="filters-section-anchor">
            <SearchFilters
              academicYears={academicYears}
              selectedYear={selectedYear}
              onYearChange={handleYearChange}
              availableSubjects={availableSubjects}
              selectedSubject={selectedSubject}
              onSubjectChange={handleSubjectChange}
              availableSections={availableSections}
              selectedSection={selectedSection}
              onSectionChange={setSelectedSection}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              onSearch={handleSearchSubmit}
              onReset={handleResetFilters}
              resultsCount={filteredSchedules.length}
              totalCount={schedules.length}
            />
          </div>

          {/* 5. Results Section */}
          <section className="results-section">
            <div className="results-header-bar">
              <div className="results-title-group">
                <h3 className="results-heading">
                  Examination & Laboratory Schedules
                </h3>
                <span className="results-count-badge">
                  {filteredSchedules.length}{' '}
                  {filteredSchedules.length === 1 ? 'match found' : 'matches found'}
                </span>
              </div>

              {/* View Toggle (Grid / Table) */}
              <div className="view-toggle-bar">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  title="Card Grid View"
                  aria-label="Card Grid View"
                >
                  <LayoutGrid size={17} />
                  <span>Grid</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                  title="Compact Table View"
                  aria-label="Compact Table View"
                >
                  <List size={17} />
                  <span>Table</span>
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="loading-card">
                <div className="loader-spinner"></div>
                <div className="loader-text">
                  Loading and preparing KL University Examination Schedule...
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredSchedules.length === 0 && (
              <div className="empty-results-box">
                <div className="empty-icon-wrap">
                  <Calendar size={48} className="empty-icon" />
                </div>
                <h4 className="empty-title">
                  No schedule found. Please check your subject and section.
                </h4>
                <p className="empty-desc">
                  Try adjusting your academic year, subject, or section filter, or clear
                  the search bar to see all available university schedules.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="empty-reset-btn"
                >
                  <RotateCcw size={16} />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}

            {/* Results Grid View */}
            {!loading && filteredSchedules.length > 0 && viewMode === 'grid' && (
              <>
                <div className="schedules-grid">
                  {visibleSchedules.map((schedule) => (
                    <ScheduleCard key={schedule.id} schedule={schedule} />
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="load-more-container">
                    <button
                      type="button"
                      onClick={() => setDisplayLimit((prev) => prev + 24)}
                      className="load-more-btn"
                    >
                      <span>
                        Show More Schedules ({filteredSchedules.length - displayLimit}{' '}
                        remaining)
                      </span>
                      <ChevronDown size={18} />
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Results Table View */}
            {!loading && filteredSchedules.length > 0 && viewMode === 'table' && (
              <div className="table-responsive-wrapper">
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Course Code</th>
                      <th>Course Name</th>
                      <th>Section</th>
                      <th>Date</th>
                      <th>Timing</th>
                      <th>Duration</th>
                      <th>Room / Venue</th>
                      <th>Department</th>
                      <th>Enrolled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleSchedules.map((s) => (
                      <tr key={s.id}>
                        <td>
                          <span className="table-year-badge">{s.academicYear}</span>
                        </td>
                        <td>
                          <strong className="code-text">{s.courseCode}</strong>
                        </td>
                        <td className="course-name-cell">{s.courseName}</td>
                        <td>
                          <span className="table-sec-badge">{s.section}</span>
                        </td>
                        <td className="date-cell">{s.formattedDate}</td>
                        <td className="time-cell">{s.time}</td>
                        <td>{s.duration}</td>
                        <td className="venue-cell">
                          <strong>{s.venue}</strong>
                        </td>
                        <td>{s.dept || '—'}</td>
                        <td className="count-cell">{s.studentCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {hasMore && (
                  <div className="load-more-container">
                    <button
                      type="button"
                      onClick={() => setDisplayLimit((prev) => prev + 24)}
                      className="load-more-btn"
                    >
                      <span>Show More ({filteredSchedules.length - displayLimit} remaining)</span>
                      <ChevronDown size={18} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* 6. Excel Upload Modal */}
      <ExcelUpload
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onWorkbookLoaded={handleWorkbookLoaded}
        onResetToDefault={handleResetToDefault}
        currentSheetData={sheetData}
        isDefaultLoaded={isDefaultLoaded}
      />

      {/* 7. Footer */}
      <Footer />
    </div>
  );
}
