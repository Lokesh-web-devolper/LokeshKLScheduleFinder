import React, { useState, useRef, useEffect } from 'react';
import { User, ChevronDown, Check, UserCheck } from 'lucide-react';
import { STUDENTS_DATA } from '../data/students';

export default function StudentDropdown({ selectedStudent, onSelectStudent }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (student) => {
    onSelectStudent(student);
    setIsOpen(false);
  };

  return (
    <div className="student-selector-dropdown-wrapper" ref={dropdownRef}>
      <button
        type="button"
        className={`student-nav-dropdown-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        title="Select student to view personal III B.Tech exam timetable"
      >
        <div className="student-nav-avatar">
          <User size={16} />
        </div>
        <div className="student-nav-label-group">
          <span className="student-nav-prefix">Select Student:</span>
          <strong className="student-nav-current-name">{selectedStudent.name}</strong>
        </div>
        <ChevronDown
          size={16}
          className={`nav-chevron-icon ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="student-nav-dropdown-menu" role="menu">
          <div className="dropdown-menu-header">
            <span className="dropdown-menu-title">Select Student</span>
            <span className="dropdown-menu-subtitle">III B.Tech Semester Examination</span>
          </div>

          <div className="dropdown-students-list">
            {STUDENTS_DATA.map((student, index) => {
              const isSelected = student.id === selectedStudent.id;
              return (
                <button
                  key={student.id}
                  type="button"
                  className={`student-list-option ${isSelected ? 'selected-option' : ''}`}
                  onClick={() => handleSelect(student)}
                  role="menuitem"
                >
                  <div className="option-left">
                    <div className="option-avatar avatar-actual">
                      <UserCheck size={16} />
                    </div>
                    <div className="option-info">
                      <div className="option-name-row">
                        <strong className="option-name">{index + 1}. {student.name}</strong>
                      </div>
                      <span className="option-meta">
                        {student.year} • {student.subjects.length} Registered Subjects
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="option-check-icon">
                      <Check size={16} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="dropdown-menu-footer">
            <span>Sourced from <code>src/data/students.js</code></span>
          </div>
        </div>
      )}
    </div>
  );
}
