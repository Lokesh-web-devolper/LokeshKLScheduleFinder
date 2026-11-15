# KL University Schedule Finder

A modern, professional, and fully responsive web portal for **K L Deemed to be University** students to search and view their examination and laboratory schedules.

This is a **frontend-only** application built with React, Vite, and SheetJS (`xlsx`). All Excel processing, header detection, date parsing, student record grouping, and multi-criteria searching occur entirely inside the user's browser without requiring any backend server, Java/Spring Boot, Node.js API, or database.

---

## 🌟 Key Features

- **100% Client-Side In-Browser Processing:**
  - Parses `.xlsx` and `.xls` workbooks with zero network requests to third-party servers.
  - Student privacy protected: Individual student registration numbers and names are automatically anonymized and consolidated into aggregate enrollment counts.
- **Dynamic Header Detection:**
  - Scans and detects variable header rows across worksheets, adapting gracefully whether headers start in Row 1 or Row 2 (e.g. after title banners).
- **All 5 Worksheets Supported:**
  1. `Y25 II BTECH` (II B.Tech schedules)
  2. `Y24 III BTECH` (III B.Tech schedules)
  3. `Y23 IV BTECH REG PHY AND CHEM` (IV B.Tech Physics & Chemistry)
  4. `Y23 IV BTECH REG & ADDL COURSES` (IV B.Tech Regular & Additional Labs)
  5. `Y23 IV BTECH PSICP` (IV B.Tech PSICP Lab Schedules)
- **Student-Wise Examination Timetable Dashboard (NEW):**
  - Navigation bar dropdown titled **"Select Student"** with 4 original students:
    1. **Lokeswar Reddy** (5 registered subjects)
    2. **Balaji** (6 registered subjects)
    3. **Avinash** (5 registered subjects)
    4. **Akshay** (6 registered subjects)
  - Real-time matching against worksheet `Y24 III BTECH` using normalized CourseCode and Section.
  - Displays chronological examination timetable with date, timing, room number, department, and LTPS.
  - 1-click navigation between "All Exams (General Schedule)" and "My Exams (Student Timetable)".
- **Automatic Grouping of Student Records:**
  - Groups identical schedules (same subject, section, date, time, and room/venue) into a single consolidated schedule card with total enrolled student count.
- **Interactive Multi-Filter System:**
  - **Academic Year Dropdown:** Filter by II B.Tech, III B.Tech, IV B.Tech, or view All.
  - **Subject Dropdown:** Dynamically displays real course names and codes filtered by the selected academic year.
  - **Section Dropdown:** Dynamically populates only sections active for the chosen subject.
  - **Global Keyword Search:** Search by Course Code, Subject Name, Section, Room Number, Lab Venue, or Department.
- **Dual Display Modes:**
  - **Card Grid View:** Rich rounded cards with Lucide icons for Date, Clock, MapPin, and enrolled student counts.
  - **Table View:** Compact, structured data grid with column sorting.
- **Student Productivity Tools:**
  - **Copy Schedule:** 1-click clipboard copy of exam date, time, and venue.
  - **Add to Calendar (.ics):** Generates and downloads standard iCalendar files for Google Calendar, Apple Calendar, and Outlook.
- **Live Excel Upload & Reload:**
  - Upload updated `.xlsx` workbooks on the fly via drag-and-drop.
  - Instant memory reload and data refresh.
  - One-click button to restore default preloaded university schedule.

---

## 🛠️ Technology Stack

- **Framework:** React 19 (Functional Components & Hooks)
- **Bundler / Tooling:** Vite 8
- **Excel Engine:** SheetJS (`xlsx`)
- **Icons:** Lucide React (`lucide-react`)
- **Styling:** Custom Vanilla CSS3 (Mobile-first, responsive grid, zero external heavy CSS frameworks)
- **Deployment:** Static HTML/JS/CSS (Vercel, Netlify, GitHub Pages, or any static web host)

---

## 📁 Project Structure

```text
exceldata/
├── public/
│   ├── data/
│   │   └── schedule.xlsx           # Preloaded official KL University workbook
│   ├── favicon.svg                 # University graduation cap SVG icon
│   └── icons.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Header.jsx              # University branding, student dropdown & upload CTA
│   │   ├── Hero.jsx                # Hero heading, search bar, and popular courses
│   │   ├── SearchFilters.jsx       # Academic year, subject, section & text filters
│   │   ├── ScheduleCard.jsx        # Rich schedule card with icons and actions
│   │   ├── Statistics.jsx          # Live workbook statistics (records, subjects, sections)
│   │   ├── ExcelUpload.jsx         # Modal for drag-and-drop Excel file uploads
│   │   ├── SubjectCard.jsx         # Personal subject card with custom subtle accent colors
│   │   ├── MySubjectsDashboard.jsx # Lokeswar Reddy's registered subjects dashboard
│   │   └── Footer.jsx              # Portal copyright and security notices
│   ├── data/
│   │   └── studentData.js          # Registered courses & profile for Lokeswar Reddy
│   ├── utils/
│   │   ├── excelParser.js          # Dynamic header detection, date normalization, grouping
│   │   └── scheduleUtils.js        # Filtering, dynamic options, statistics, .ics generator
│   ├── App.jsx                     # Root application coordinator
│   ├── App.css                     # Modern university dashboard CSS stylesheet
│   ├── index.css                   # Global styling, color variables, typography
│   └── main.jsx                    # React entry point
├── index.html                      # HTML document entry
├── package.json                    # Dependencies and scripts
├── vite.config.js                  # Vite configuration
└── README.md                       # Documentation
```

---

## 🚀 Quick Start Instructions (Local Development)

### Prerequisites

Ensure you have **Node.js** (v18 or higher) and **npm** installed. Verify with:
```bash
node -v
npm -v
```

### 1. Install Dependencies
In the root directory of the project, run:
```bash
npm install
```

### 2. Run Development Server
Start the local Vite development server:
```bash
npm run dev
```

Open your browser and navigate to:
```text
http://localhost:5173
```
The application will automatically load with the real KL University 2026–27 examination schedule already active!

---

## 🔄 How to Update or Replace the Excel Workbook

You have two convenient ways to update schedule data:

### Method A: Through the Web Interface (Instant In-Browser)
1. Open the website in your browser.
2. Click the **"Upload Excel"** button in the top navigation bar (or drag-and-drop a file).
3. Select your `.xlsx` or `.xls` file.
4. The application reads all worksheets dynamically using SheetJS and updates the search results, filters, and statistics immediately without reloading the page.

### Method B: Update Preloaded Workbook in Source Code
1. Place the new Excel workbook in the `public/data/` directory.
2. Rename it to `schedule.xlsx` (or update the filename in `src/App.jsx`).
3. Re-run or refresh `npm run dev`. The website will load the new workbook by default for all visitors.

---

## 📦 How to Build and Deploy for Production

To produce an optimized, production-ready static build:

```bash
npm run build
```

This compiles all React components, icons, and CSS into the `dist/` directory.

### Preview the Production Build Locally
```bash
npm run preview
```

### Deploying to Any Hosting Provider

Because this project is 100% static frontend, it can be deployed to any static host in seconds:

- **Vercel:** Run `npx vercel` or link your Git repository.
- **Netlify:** Drag and drop the `dist/` folder into Netlify Drop.
- **GitHub Pages:** Use `gh-pages` or GitHub Actions to publish the `dist/` directory.
- **Apache / Nginx / S3:** Copy the contents of the `dist/` folder to your web root (`/var/www/html`).

---

## 🔒 Privacy & Data Handling Guarantee

- All Excel workbook analysis, header detection, and student record filtering happen entirely within the user's browser memory via the HTML5 File API and Web Assembly / JS ArrayBuffer.
- No student registration numbers (`RegdNo`) or student names are displayed in schedule cards or results.
- Multiple student rows are grouped into a single schedule card with an aggregate student count.
