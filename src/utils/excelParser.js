import * as XLSX from 'xlsx';

/**
 * Normalizes string for header comparison
 */
function normalizeHeaderKey(str) {
  if (!str) return '';
  return String(str)
    .trim()
    .toUpperCase()
    .replace(/[\s_()\-–.]+/g, '');
}

/**
 * Standardizes Excel date into YYYY-MM-DD
 */
export function parseExcelDate(val) {
  if (val === null || val === undefined || val === '') return '';

  // If already a JavaScript Date object
  if (val instanceof Date) {
    const adjusted = new Date(val.getTime() + 12 * 3600 * 1000);
    const y = adjusted.getUTCFullYear();
    const m = String(adjusted.getUTCMonth() + 1).padStart(2, '0');
    const d = String(adjusted.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // If numeric Excel date serial number (e.g. 46347)
  if (typeof val === 'number') {
    const utcDays = Math.floor(val - 25569);
    const date = new Date(utcDays * 86400 * 1000);
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // If string date like '16.11.26', '16.11.2026', '26-11-2026', '2026-11-21'
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return '';

    // Handle DD.MM.YYYY, DD.MM.YY, DD-MM-YYYY, DD/MM/YYYY
    const parts = trimmed.split(/[.\-/]/);
    if (parts.length === 3) {
      let d, m, y;
      if (parts[0].length === 4) {
        // YYYY-MM-DD
        y = parts[0];
        m = parts[1];
        d = parts[2];
      } else {
        // DD-MM-YY or DD-MM-YYYY
        d = parts[0];
        m = parts[1];
        y = parts[2];
        if (y.length === 2) {
          y = '20' + y;
        }
      }
      return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    }
    return trimmed;
  }

  return String(val);
}

/**
 * Format ISO date string into readable user display
 */
export function formatDisplayDate(isoDate) {
  if (!isoDate) return 'Date TBA';
  if (/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
    const [y, m, d] = isoDate.split('-').map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return `${days[dt.getUTCDay()]}, ${d} ${months[dt.getUTCMonth()]} ${y}`;
  }
  return isoDate;
}

/**
 * Determines academic year label from sheet name
 */
export function detectAcademicYear(sheetName) {
  const s = (sheetName || '').toUpperCase();
  if (/Y23|\bIV\b|4TH\s*YEAR/i.test(s)) return 'IV B.Tech';
  if (/Y24|\bIII\b|3RD\s*YEAR/i.test(s)) return 'III B.Tech';
  if (/Y25|\bII\b|2ND\s*YEAR/i.test(s)) return 'II B.Tech';
  return 'General';
}

/**
 * Parses an ArrayBuffer of an Excel workbook using SheetJS
 * Dynamically detects headers and reads all worksheets.
 */
export function parseExcelWorkbook(arrayBuffer) {
  const workbook = XLSX.read(arrayBuffer, {
    type: 'array',
    cellDates: false, // keep raw values for deterministic serial handling
    raw: true
  });

  const allRawRecords = [];
  const processedSheets = [];
  let totalRowsRead = 0;

  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) return;

    const rawRows = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: ''
    });

    if (!rawRows || rawRows.length === 0) return;

    // Detect header row dynamically within first 15 rows
    let headerRowIdx = -1;
    for (let r = 0; r < Math.min(rawRows.length, 15); r++) {
      const row = rawRows[r];
      if (!Array.isArray(row)) continue;
      const normalizedRow = row.map(normalizeHeaderKey);

      const hasCourseKey = normalizedRow.some((h) =>
        h.includes('COURSECODE') ||
        h.includes('SUBCODE') ||
        h.includes('SUBJECT') ||
        h.includes('COURSENAME')
      );
      const hasDateOrTimeOrSec = normalizedRow.some((h) =>
        h.includes('DATE') ||
        h.includes('TIME') ||
        h.includes('SLOT') ||
        h.includes('SECTION') ||
        h.includes('SEC')
      );

      if (hasCourseKey && hasDateOrTimeOrSec) {
        headerRowIdx = r;
        break;
      }
    }

    // Fallback if not detected: use row 0
    if (headerRowIdx === -1) {
      headerRowIdx = 0;
    }

    const headers = rawRows[headerRowIdx].map(normalizeHeaderKey);
    const colMap = {
      courseCode: -1,
      courseName: -1,
      date: -1,
      time: -1,
      duration: -1,
      section: -1,
      venue: -1,
      roomNo: -1,
      dept: -1,
      courseNature: -1,
      count: -1,
      ltps: -1
    };

    headers.forEach((h, idx) => {
      if (!h) return;
      if (h.includes('COURSECODE') || h === 'SUBCODE' || h === 'CODE' || h === 'SUBJECTCODE') {
        colMap.courseCode = idx;
      } else if (h.includes('COURSENAME') || h === 'COURSEDESC' || h === 'SUBJECT' || h === 'SUBJECTNAME') {
        colMap.courseName = idx;
      } else if (h === 'DATE' || h.includes('EXAMDATE') || h.includes('TESTDATE')) {
        colMap.date = idx;
      } else if (h === 'TIME' || h === 'SLOT' || h.includes('TIMING') || h.includes('SESSION')) {
        colMap.time = idx;
      } else if (h.includes('DURATION')) {
        colMap.duration = idx;
      } else if (h === 'SECTION' || h === 'SEC') {
        colMap.section = idx;
      } else if (h.includes('LABVENUE') || h.includes('VENUE')) {
        colMap.venue = idx;
      } else if (h.includes('ROOMNO') || h.includes('ROOM')) {
        colMap.roomNo = idx;
      } else if (h.includes('OFFEREDBY') || h.includes('DEPT') || h.includes('DEPARTMENT')) {
        colMap.dept = idx;
      } else if (h.includes('COURSENATURE') || h.includes('NATURE') || h.includes('PS/ICP') || h === 'TYPE') {
        colMap.courseNature = idx;
      } else if (h === 'COUNT' || h.includes('STUDENTCOUNT') || h.includes('STRENGTH')) {
        colMap.count = idx;
      } else if (h === 'LTPS') {
        colMap.ltps = idx;
      }
    });

    const academicYear = detectAcademicYear(sheetName);
    let sheetRecordCount = 0;

    for (let r = headerRowIdx + 1; r < rawRows.length; r++) {
      const row = rawRows[r];
      if (!row || !Array.isArray(row)) continue;

      const rawCode = colMap.courseCode !== -1 ? String(row[colMap.courseCode] || '').trim() : '';
      const rawName = colMap.courseName !== -1 ? String(row[colMap.courseName] || '').trim() : '';

      // Skip empty separator rows
      if (!rawCode && !rawName) continue;

      const rawDate = colMap.date !== -1 ? row[colMap.date] : '';
      const parsedDate = parseExcelDate(rawDate);

      const rawTime = colMap.time !== -1 ? String(row[colMap.time] || '').trim() : '';
      const rawDuration = colMap.duration !== -1 ? String(row[colMap.duration] || '').trim() : '';
      const rawSection = colMap.section !== -1 ? String(row[colMap.section] || '').trim() : '';
      const rawVenue = colMap.venue !== -1 ? String(row[colMap.venue] || '').trim() : '';
      const rawRoomNo = colMap.roomNo !== -1 ? String(row[colMap.roomNo] || '').trim() : '';
      const venueCombined = [rawVenue, rawRoomNo].filter(Boolean).join(' / ') || 'TBA';

      const rawDept = colMap.dept !== -1 ? String(row[colMap.dept] || '').trim() : '';
      const rawNature = colMap.courseNature !== -1 ? String(row[colMap.courseNature] || '').trim() : '';
      const rawLtps = colMap.ltps !== -1 ? String(row[colMap.ltps] || '').trim() : '';

      let rawCount = null;
      if (colMap.count !== -1 && row[colMap.count] !== undefined && row[colMap.count] !== '') {
        const num = Number(row[colMap.count]);
        if (!isNaN(num) && num > 0) rawCount = num;
      }

      allRawRecords.push({
        sheetName: sheetName.trim(),
        academicYear,
        courseCode: rawCode || 'N/A',
        courseName: rawName || rawCode || 'Course',
        date: parsedDate,
        time: rawTime || 'Schedule TBA',
        duration: rawDuration || '2 Hours',
        section: rawSection || 'All Sections',
        venue: venueCombined,
        dept: rawDept,
        courseNature: rawNature,
        ltps: rawLtps,
        count: rawCount
      });

      sheetRecordCount++;
      totalRowsRead++;
    }

    processedSheets.push({
      name: sheetName.trim(),
      academicYear,
      recordCount: sheetRecordCount
    });
  });

  // Group identical schedule records so identical subject, section, date, time, venue display as one schedule
  const groupedMap = new Map();

  allRawRecords.forEach((item) => {
    // Unique key for grouping
    const key = [
      item.academicYear,
      item.courseCode.toUpperCase(),
      item.courseName.toUpperCase(),
      item.section.toUpperCase(),
      item.date,
      item.time.toUpperCase(),
      item.venue.toUpperCase()
    ].join('||');

    if (groupedMap.has(key)) {
      const existing = groupedMap.get(key);
      // Increment student count for grouped individual student rows
      existing.studentCount = (existing.studentCount || 1) + (item.count || 1);
      if (!existing.dept && item.dept) existing.dept = item.dept;
      if (!existing.courseNature && item.courseNature) existing.courseNature = item.courseNature;
      if (!existing.ltps && item.ltps) existing.ltps = item.ltps;
      if ((!existing.duration || existing.duration === '2 Hours') && item.duration) {
        existing.duration = item.duration;
      }
    } else {
      groupedMap.set(key, {
        id: `sched-${groupedMap.size + 1}`,
        academicYear: item.academicYear,
        courseCode: item.courseCode,
        courseName: item.courseName,
        section: item.section,
        date: item.date,
        formattedDate: formatDisplayDate(item.date),
        time: item.time,
        duration: item.duration,
        venue: item.venue,
        dept: item.dept,
        courseNature: item.courseNature,
        ltps: item.ltps,
        studentCount: item.count || 1,
        sourceSheet: item.sheetName
      });
    }
  });

  const schedules = Array.from(groupedMap.values());

  return {
    schedules,
    sheets: processedSheets,
    totalRawRows: totalRowsRead,
    totalGroupedSchedules: schedules.length
  };
}
