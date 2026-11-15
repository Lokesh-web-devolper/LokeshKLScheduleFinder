/**
 * Utility functions for filtering, options derivation, and calendar export
 */

/**
 * Filter schedules according to user criteria
 */
export function filterSchedules(schedules, { academicYear, subject, section, searchQuery }) {
  if (!Array.isArray(schedules)) return [];

  const query = (searchQuery || '').trim().toLowerCase();

  return schedules.filter((item) => {
    // 1. Academic Year filter
    if (academicYear && academicYear !== 'ALL') {
      if (item.academicYear !== academicYear) return false;
    }

    // 2. Subject filter (can match courseCode or courseName or combined)
    if (subject && subject !== 'ALL') {
      const matchCode = item.courseCode.toLowerCase() === subject.toLowerCase();
      const matchName = item.courseName.toLowerCase() === subject.toLowerCase();
      const combined = `${item.courseCode} - ${item.courseName}`.toLowerCase();
      if (!matchCode && !matchName && combined !== subject.toLowerCase()) {
        return false;
      }
    }

    // 3. Section filter
    if (section && section !== 'ALL') {
      if (item.section.toLowerCase() !== section.toLowerCase()) {
        return false;
      }
    }

    // 4. Global search query across multiple fields
    if (query) {
      const searchBlob = [
        item.courseCode,
        item.courseName,
        item.section,
        item.venue,
        item.dept,
        item.courseNature,
        item.academicYear,
        item.time,
        item.formattedDate
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (!searchBlob.includes(query)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Natural comparator for section strings (e.g. S-1, S-2, S-10)
 */
function naturalCompare(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

/**
 * Derives unique academic years from current schedules
 */
export function getAcademicYears(schedules) {
  const years = new Set();
  schedules.forEach((s) => {
    if (s.academicYear) years.add(s.academicYear);
  });
  const order = ['II B.Tech', 'III B.Tech', 'IV B.Tech'];
  return Array.from(years).sort((a, b) => {
    const idxA = order.indexOf(a);
    const idxB = order.indexOf(b);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return naturalCompare(a, b);
  });
}

/**
 * Derives unique subjects for a selected academic year
 */
export function getSubjectsForYear(schedules, academicYear) {
  const map = new Map();
  schedules.forEach((s) => {
    if (!academicYear || academicYear === 'ALL' || s.academicYear === academicYear) {
      const key = s.courseCode;
      if (!map.has(key)) {
        map.set(key, {
          courseCode: s.courseCode,
          courseName: s.courseName,
          label: `${s.courseCode} — ${s.courseName}`,
          academicYear: s.academicYear
        });
      }
    }
  });

  return Array.from(map.values()).sort((a, b) =>
    a.courseCode.localeCompare(b.courseCode)
  );
}

/**
 * Derives unique sections available for a specific subject (and year)
 */
export function getSectionsForSubject(schedules, academicYear, subjectCode) {
  const sectionSet = new Set();
  schedules.forEach((s) => {
    const matchesYear = !academicYear || academicYear === 'ALL' || s.academicYear === academicYear;
    const matchesSubject =
      !subjectCode ||
      subjectCode === 'ALL' ||
      s.courseCode.toLowerCase() === subjectCode.toLowerCase() ||
      s.courseName.toLowerCase() === subjectCode.toLowerCase();

    if (matchesYear && matchesSubject && s.section) {
      sectionSet.add(s.section);
    }
  });

  return Array.from(sectionSet).sort(naturalCompare);
}

/**
 * Computes live dashboard statistics
 */
export function calculateStatistics(schedules) {
  if (!schedules || schedules.length === 0) {
    return {
      totalSchedules: 0,
      totalSubjects: 0,
      totalSections: 0,
      totalYears: 0,
      totalStudentSlots: 0
    };
  }

  const subjects = new Set();
  const sections = new Set();
  const years = new Set();
  let totalStudentSlots = 0;

  schedules.forEach((s) => {
    if (s.courseCode) subjects.add(s.courseCode);
    if (s.section) sections.add(s.section);
    if (s.academicYear) years.add(s.academicYear);
    totalStudentSlots += s.studentCount || 1;
  });

  return {
    totalSchedules: schedules.length,
    totalSubjects: subjects.size,
    totalSections: sections.size,
    totalYears: years.size,
    totalStudentSlots
  };
}

/**
 * Generates an iCalendar (.ics) download for a schedule record
 */
export function downloadIcsCalendar(schedule) {
  if (!schedule) return;

  const title = `KL Exam: ${schedule.courseCode} - ${schedule.courseName}`;
  const location = schedule.venue || 'KL University Campus';
  const description = `Section: ${schedule.section}\\nDuration: ${schedule.duration}\\nDepartment: ${schedule.dept || 'KL University'}\\nAcademic Year: ${schedule.academicYear}\\nCourse Nature: ${schedule.courseNature || 'Regular'}`;

  // Parse date into YYYYMMDD
  let dtStart = '20261120T090000Z';
  let dtEnd = '20261120T110000Z';

  if (schedule.date && /^\d{4}-\d{2}-\d{2}$/.test(schedule.date)) {
    const dateFormatted = schedule.date.replace(/-/g, '');
    dtStart = `${dateFormatted}T093000`;
    dtEnd = `${dateFormatted}T113000`;
  }

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//KL University//Schedule Finder//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:kl-schedule-${Date.now()}-${schedule.id}@kluniversity.in`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${title}`,
    `LOCATION:${location}`,
    `DESCRIPTION:${description}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${schedule.courseCode}_${schedule.section}_schedule.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Normalizes section string for flexible comparison
 * Handles 'Section-68', 'Section-02', 'S2', 'SEC 68', 'S-68', etc.
 */
export function normalizeSection(sec) {
  if (!sec) return '';
  return String(sec)
    .trim()
    .toUpperCase()
    .replace(/^(SECTION|SEC)[-\s]*/i, '')
    .replace(/^S[-\s]*/i, '')
    .replace(/^0+/, '') // '02' -> '2', '05' -> '5'
    .replace(/[-\s]/g, '');
}

export function sectionsMatch(studentSection, excelSection) {
  if (!studentSection || !excelSection) return false;
  return normalizeSection(studentSection) === normalizeSection(excelSection);
}

/**
 * Matches student's registered subjects and sections against original Excel schedules
 * Uses sheet 'Y24 III BTECH' records
 * Sorts examination cards chronologically by date and time
 */
export function matchStudentExamSchedule(student, schedules) {
  if (!student || !Array.isArray(student.subjects) || !Array.isArray(schedules)) {
    return [];
  }

  // Filter schedules to III B.Tech / Y24 sheet
  const year3Schedules = schedules.filter(
    (s) => s.academicYear === 'III B.Tech' || (s.sourceSheet && s.sourceSheet.includes('Y24'))
  );

  const matchedList = student.subjects.map((sub) => {
    // Find matching record by courseCode AND section
    const match = year3Schedules.find((item) => {
      const codeMatch = item.courseCode.toUpperCase() === sub.courseCode.toUpperCase();
      const secMatch = sectionsMatch(sub.section, item.section);
      return codeMatch && secMatch;
    });

    if (match) {
      return {
        id: `match-${student.id}-${sub.courseCode}`,
        courseCode: sub.courseCode,
        subjectName: match.courseName || sub.courseName,
        section: sub.section,
        excelSection: match.section,
        examDate: match.formattedDate,
        rawDate: match.date || '',
        examTime: match.time,
        venue: match.venue || 'TBA',
        department: match.dept || 'Engineering Dept',
        ltps: match.ltps || '',
        duration: match.duration || '2 Hours',
        category: sub.category,
        iconType: sub.iconType,
        isFound: true,
        sourceSheet: match.sourceSheet
      };
    }

    return {
      id: `nomatch-${student.id}-${sub.courseCode}`,
      courseCode: sub.courseCode,
      subjectName: sub.courseName,
      section: sub.section,
      excelSection: null,
      examDate: 'Exam schedule not available',
      rawDate: '9999-99-99',
      examTime: 'Exam schedule not available for this subject/section.',
      venue: 'Exam schedule not available for this subject/section.',
      department: '—',
      ltps: '',
      duration: '—',
      category: sub.category,
      iconType: sub.iconType,
      isFound: false,
      sourceSheet: 'Y24 III BTECH'
    };
  });

  // Sort by date (ascending) and time
  return matchedList.sort((a, b) => {
    if (a.isFound && !b.isFound) return -1;
    if (!a.isFound && b.isFound) return 1;

    if (a.rawDate !== b.rawDate) {
      return a.rawDate.localeCompare(b.rawDate);
    }
    return a.examTime.localeCompare(b.examTime);
  });
}
