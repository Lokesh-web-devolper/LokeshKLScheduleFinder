import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  Users,
  Building2,
  Tag,
  Copy,
  Check,
  CalendarPlus,
  Hourglass
} from 'lucide-react';
import { downloadIcsCalendar } from '../utils/scheduleUtils';

export default function ScheduleCard({ schedule }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `KL University Schedule
Subject: ${schedule.courseName} (${schedule.courseCode})
Academic Year: ${schedule.academicYear} | Section: ${schedule.section}
Date: ${schedule.formattedDate}
Time: ${schedule.time} (${schedule.duration})
Room / Venue: ${schedule.venue}
Department: ${schedule.dept || 'KL University'}
Course Nature: ${schedule.courseNature || 'Regular'}`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const getYearBadgeClass = (year) => {
    if (year?.includes('II')) return 'badge-year-2';
    if (year?.includes('III')) return 'badge-year-3';
    if (year?.includes('IV')) return 'badge-year-4';
    return 'badge-year-default';
  };

  return (
    <div className="schedule-card">
      {/* Top Banner / Badges */}
      <div className="card-top-bar">
        <div className="card-badges">
          <span className={`academic-badge ${getYearBadgeClass(schedule.academicYear)}`}>
            {schedule.academicYear}
          </span>
          <span className="section-badge">
            Section: <strong>{schedule.section}</strong>
          </span>
          {schedule.courseNature && (
            <span className="nature-badge" title="Course Nature">
              <Tag size={12} />
              <span>{schedule.courseNature}</span>
            </span>
          )}
          {schedule.ltps && (
            <span className="ltps-badge" title="LTPS Type">
              {schedule.ltps}
            </span>
          )}
        </div>

        <div className="card-actions">
          <button
            type="button"
            onClick={handleCopy}
            className="action-icon-btn"
            title="Copy schedule details"
            aria-label="Copy schedule details"
          >
            {copied ? <Check size={16} className="text-green" /> : <Copy size={16} />}
          </button>
          <button
            type="button"
            onClick={() => downloadIcsCalendar(schedule)}
            className="action-icon-btn"
            title="Add to Calendar (.ics)"
            aria-label="Add to Calendar (.ics)"
          >
            <CalendarPlus size={16} />
          </button>
        </div>
      </div>

      {/* Course Title and Code */}
      <div className="course-info">
        <div className="course-code-tag">
          <BookOpen size={15} />
          <span>{schedule.courseCode}</span>
        </div>
        <h3 className="course-name">{schedule.courseName}</h3>
      </div>

      <div className="card-divider" />

      {/* Grid of Schedule Details */}
      <div className="details-grid">
        {/* Date */}
        <div className="detail-item date-highlight">
          <div className="detail-icon-box icon-date">
            <Calendar size={18} />
          </div>
          <div className="detail-text">
            <span className="detail-label">Examination Date</span>
            <strong className="detail-value text-primary">{schedule.formattedDate}</strong>
          </div>
        </div>

        {/* Time & Duration */}
        <div className="detail-item">
          <div className="detail-icon-box icon-time">
            <Clock size={18} />
          </div>
          <div className="detail-text">
            <span className="detail-label">Timing & Duration</span>
            <strong className="detail-value">{schedule.time}</strong>
            <span className="detail-subvalue">
              <Hourglass size={12} className="inline-icon" /> {schedule.duration}
            </span>
          </div>
        </div>

        {/* Room / Venue */}
        <div className="detail-item venue-highlight">
          <div className="detail-icon-box icon-venue">
            <MapPin size={18} />
          </div>
          <div className="detail-text">
            <span className="detail-label">Room / Lab Venue</span>
            <strong className="detail-value venue-text">{schedule.venue}</strong>
          </div>
        </div>

        {/* Department & Student Count */}
        <div className="detail-item">
          <div className="detail-icon-box icon-dept">
            <Building2 size={18} />
          </div>
          <div className="detail-text">
            <span className="detail-label">Offered By Dept</span>
            <span className="detail-value">{schedule.dept || 'Engineering Dept'}</span>
          </div>
        </div>
      </div>

      {/* Card Footer with Student Count & Sheet Source */}
      <div className="card-footer">
        <div className="student-count-pill" title="Students assigned to this schedule session">
          <Users size={14} className="count-icon" />
          <span>Enrolled Students: <strong>{schedule.studentCount}</strong></span>
        </div>
        <div className="sheet-source-tag">
          <span>Source: {schedule.sourceSheet}</span>
        </div>
      </div>
    </div>
  );
}
