import React from 'react';
import { Search, Sparkles, BookOpenCheck } from 'lucide-react';

export default function Hero({ searchQuery, setSearchQuery, onSearchSubmit }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearchSubmit();
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-badge">
          <Sparkles size={16} className="badge-sparkle" />
          <span>Official Examination & Lab Schedule Portal</span>
        </div>

        <h1 className="hero-heading">Find Your Exam & Lab Schedule</h1>

        <p className="hero-description">
          Search your subject, select your section and instantly find your
          examination date, timing and room number.
        </p>

        {/* Global Quick Search Bar */}
        <div className="hero-search-wrapper">
          <div className="hero-search-bar">
            <Search className="hero-search-icon" size={20} />
            <input
              type="text"
              placeholder="Quick search by subject, course code, section, room or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="hero-search-input"
              aria-label="Search schedule"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-query-btn"
                onClick={() => setSearchQuery('')}
                title="Clear query"
              >
                ×
              </button>
            )}
            <button
              type="button"
              className="hero-search-btn"
              onClick={onSearchSubmit}
            >
              Search
            </button>
          </div>

          <div className="quick-tags">
            <span className="quick-tag-label">Popular Courses:</span>
            {['25CS2102 (OS)', '24AD3107 (Data Science)', '23CY1001 (Chemistry)', '22PH4101 (Physics)'].map((tag) => (
              <button
                key={tag}
                type="button"
                className="quick-tag-btn"
                onClick={() => {
                  const code = tag.split(' ')[0];
                  setSearchQuery(code);
                }}
              >
                <BookOpenCheck size={13} />
                <span>{tag}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
