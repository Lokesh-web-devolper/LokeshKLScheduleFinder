import React from 'react';
import {
  CalendarCheck,
  BookOpen,
  Users,
  GraduationCap,
  Layers,
  Sparkles
} from 'lucide-react';

export default function Statistics({ statistics, sheetCount, totalRawRows }) {
  const statItems = [
    {
      id: 'schedules',
      label: 'Schedule Records',
      value: statistics.totalSchedules.toLocaleString(),
      subtext: `${totalRawRows.toLocaleString()} student entries grouped`,
      icon: CalendarCheck,
      colorClass: 'stat-blue'
    },
    {
      id: 'subjects',
      label: 'Unique Subjects',
      value: statistics.totalSubjects.toLocaleString(),
      subtext: 'Across all departments',
      icon: BookOpen,
      colorClass: 'stat-indigo'
    },
    {
      id: 'sections',
      label: 'Total Sections',
      value: statistics.totalSections.toLocaleString(),
      subtext: 'Active class groups',
      icon: Users,
      colorClass: 'stat-emerald'
    },
    {
      id: 'years',
      label: 'Academic Years',
      value: statistics.totalYears.toLocaleString(),
      subtext: 'II, III & IV B.Tech',
      icon: GraduationCap,
      colorClass: 'stat-purple'
    }
  ];

  return (
    <section className="stats-section" aria-label="Dashboard Overview Statistics">
      <div className="stats-header">
        <div className="stats-title-wrap">
          <Sparkles size={18} className="stats-header-icon" />
          <h2 className="stats-heading">Live Dashboard Statistics</h2>
        </div>
        {sheetCount > 0 && (
          <div className="stats-sheets-pill">
            <Layers size={14} />
            <span>{sheetCount} Worksheets Analyzed</span>
          </div>
        )}
      </div>

      <div className="stats-grid">
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className={`stat-card ${item.colorClass}`}>
              <div className="stat-icon-wrapper">
                <Icon size={24} className="stat-card-icon" />
              </div>
              <div className="stat-info">
                <div className="stat-value">{item.value}</div>
                <div className="stat-label">{item.label}</div>
                <div className="stat-subtext">{item.subtext}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
