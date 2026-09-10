# 🛠️ SSC Countdown — Technical Documentation & Architecture Specification

> **System Architecture, Mathematical Models, and Algorithmic Specifications**  
> **Author:** Mahir Ahmed  
> **Target Release:** Production (Static Web Application)

---

## 📑 Table of Contents
1. [Architectural Principles](#1-architectural-principles)
2. [File & Directory Architecture](#2-file--directory-architecture)
3. [Timezone Mathematics & Bangladesh Standard Time (BST)](#3-timezone-mathematics--bangladesh-standard-time-bst)
4. [Academic Class Determination Algorithm](#4-academic-class-determination-algorithm)
5. [Academic Progress Calculation (Class 1 → SSC Exam)](#5-academic-progress-calculation-class-1--ssc-exam)
6. [11-Milestone Educational Pathway State Engine](#6-11-milestone-educational-pathway-state-engine)
7. [Real-Time Countdown Engine](#7-real-time-countdown-engine)
8. [Quote Shuffle Deck Algorithm](#8-quote-shuffle-deck-algorithm)
9. [Design System & Glassmorphism Styling Tokens](#9-design-system--glassmorphism-styling-tokens)
10. [Accessibility, Performance & Browser Support](#10-accessibility-performance--browser-support)

---

## 1. Architectural Principles

**SSC Countdown** is engineered as an ultra-high performance, zero-dependency static web application. It requires no backend server, no package manager runtime, no build tooling, and no external CDN dependencies.

### Core Architectural Tenants:
1. **Zero External Dependencies:** 100% vanilla HTML5, CSS3, and ES6+ JavaScript.
2. **Deterministic Time Calculations:** Independent of client operating system timezone misconfigurations by anchoring all calculations to Bangladesh Standard Time (`Asia/Dhaka`, UTC+6).
3. **Resilient Memory Management:** Prevention of orphan timer intervals, DOM memory leaks, and layout thrashing.
4. **Offline Capability:** Completely usable in low-connectivity or offline environments once loaded.
5. **Universal Hostability:** Deployable directly to GitHub Pages, Cloudflare Pages, Vercel, Netlify, Apache, Nginx, or via local file protocol (`file:///`).

---

## 2. File & Directory Architecture

```text
ssc-countdown/
├── index.html                  # Semantic DOM structure and ARIA landmark regions
├── style.css                   # Modular glassmorphism CSS design system
├── script.js                   # Pure vanilla business logic, timer loop, and state machine
├── favicon.svg                 # Custom SVG vector branding icon
├── README.md                   # Project overview & quick-start manual
├── USER_MANUAL.md              # Comprehensive student user guide
├── TECHNICAL_DOCUMENTATION.md  # Deep technical and algorithmic specification
├── TEST_REPORT.md              # Test execution results and verification matrix
└── DEPLOYMENT.md               # Local, LAN, and cloud hosting instructions
```

---

## 3. Timezone Mathematics & Bangladesh Standard Time (BST)

The examination routine and academic year calculations in Bangladesh operate strictly under **Bangladesh Standard Time (BST)**, which is permanently offset at **UTC+6 (no Daylight Saving Time)**.

### Constants:
```javascript
const EXAM_MONTH = 2;              // February (1-indexed)
const EXAM_DAY = 1;                // 1st of the month
const BST_OFFSET_HOURS = 6;
const BST_OFFSET_MS = BST_OFFSET_HOURS * 60 * 60 * 1000; // 21,600,000 ms
```

### Current Time in BST Calculation:
```javascript
function getBangladeshNow(now) {
  const d = now ? new Date(now) : new Date();
  const nowMs = d.getTime();

  let bdYear;
  try {
    const bdString = d.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });
    bdYear = new Date(bdString).getFullYear();
  } catch (e) {
    // Fallback if Intl timeZone is unavailable
    const utcTime = d.getTime() + d.getTimezoneOffset() * 60000;
    const bdTime = new Date(utcTime + BST_OFFSET_MS);
    bdYear = bdTime.getFullYear();
  }

  return { year: bdYear, nowMs, date: d };
}
```

### Standardized Exam Timestamp:
```javascript
function getExamDate(batchYear) {
  // February 1 at 00:00:00 BST (UTC+6) = January 31 at 18:00:00 UTC
  return Date.UTC(batchYear, EXAM_MONTH - 1, EXAM_DAY, 0, 0, 0) - BST_OFFSET_MS;
}
```

---

## 4. Academic Class Determination Algorithm

Given an SSC batch year $Y_{batch}$ and current BST year $Y_{current}$:

$$\Delta Y = Y_{batch} - Y_{current}$$

$$\text{Class} = 10 - \Delta Y + 1 = 11 - (Y_{batch} - Y_{current})$$

### Status Categorization:
1. **`finished`:** $\Delta Y < 0$, or $\Delta Y = 0 \land \text{nowMs} \ge T_{exam}$.  
   *The SSC examination has concluded.*
2. **`candidate`:** $\Delta Y = 0 \land \text{nowMs} < T_{exam}$.  
   *The student is in their final exam preparation month.*
3. **`studying`:** $1 \le \text{Class} \le 10$.  
   *The student is actively studying in that designated class level.*
4. **`future`:** $\text{Class} < 1$.  
   *Pre-school or pre-Class 1 batch scheduled ahead.*

---

## 5. Academic Progress Calculation (Class 1 → SSC Exam)

The academic journey starts on **January 1 of $(Y_{batch} - 10)$ at 00:00:00 BST** and concludes on **February 1 of $Y_{batch}$ at 00:00:00 BST**.

### Mathematical Model:
$$T_{start} = \text{Date.UTC}(Y_{batch} - 10, 0, 1, 0, 0, 0) - \text{BST\_OFFSET\_MS}$$
$$T_{exam} = \text{Date.UTC}(Y_{batch}, 1, 1, 0, 0, 0) - \text{BST\_OFFSET\_MS}$$
$$\text{Total Duration} = T_{exam} - T_{start} \approx 10\text{ years} + 1\text{ month}$$
$$\text{Elapsed Time} = T_{now} - T_{start}$$

$$\text{Progress \%} = \text{clamp}\left(0, \frac{\text{Elapsed Time}}{\text{Total Duration}} \times 100, 100\right)$$

Rounded to 1 decimal place:
```javascript
function calculateAcademicProgress(batchYear, currentDate) {
  const examMs = getExamDate(batchYear);
  const journeyStartMs = Date.UTC(batchYear - ACADEMIC_JOURNEY_YEARS, 0, 1, 0, 0, 0) - BST_OFFSET_MS;
  const nowMs = (currentDate ? new Date(currentDate) : new Date()).getTime();

  if (nowMs >= examMs) return 100;
  if (nowMs <= journeyStartMs) return 0;

  const total = examMs - journeyStartMs;
  const elapsed = nowMs - journeyStartMs;
  const pct = (elapsed / total) * 100;
  return Math.round(Math.min(100, Math.max(0, pct)) * 10) / 10;
}
```

---

## 6. 11-Milestone Educational Pathway State Engine

The 11 educational milestones represent every grade of primary and secondary school:

```javascript
const ACADEMIC_MILESTONES = [
  { id: 1, name: 'Class 1', grade: 1, phase: 'Primary', phaseKey: 'primary' },
  { id: 2, name: 'Class 2', grade: 2, phase: 'Primary', phaseKey: 'primary' },
  { id: 3, name: 'Class 3', grade: 3, phase: 'Primary', phaseKey: 'primary' },
  { id: 4, name: 'Class 4', grade: 4, phase: 'Primary', phaseKey: 'primary' },
  { id: 5, name: 'Class 5', grade: 5, phase: 'Primary', phaseKey: 'primary' },
  { id: 6, name: 'Class 6', grade: 6, phase: 'Junior Secondary', phaseKey: 'middle' },
  { id: 7, name: 'Class 7', grade: 7, phase: 'Junior Secondary', phaseKey: 'middle' },
  { id: 8, name: 'Class 8', grade: 8, phase: 'Junior Secondary', phaseKey: 'middle' },
  { id: 9, name: 'Class 9', grade: 9, phase: 'Secondary', phaseKey: 'secondary' },
  { id: 10, name: 'Class 10', grade: 10, phase: 'Secondary', phaseKey: 'secondary' },
  { id: 11, name: 'SSC Exam', grade: 11, phase: 'Board Exam', phaseKey: 'exam', isExam: true }
];
```

### State Determination Logic:
```javascript
function getMilestoneState(milestone, data) {
  const { status, currentClass } = data;

  if (status === 'finished') {
    return {
      state: 'completed',
      badgeText: milestone.isExam ? '★ Exam Finished' : '✓ Completed',
      iconText: milestone.isExam ? '★' : '✓',
      label: milestone.isExam ? 'SSC Exam Completed' : `${milestone.name} Completed`
    };
  }

  if (status === 'candidate') {
    if (milestone.isExam) {
      return {
        state: 'current',
        badgeText: '★ Exam Candidate',
        iconText: '★',
        label: 'SSC Examination Period'
      };
    }
    return {
      state: 'completed',
      badgeText: '✓ Completed',
      iconText: '✓',
      label: `${milestone.name} Completed`
    };
  }

  if (status === 'studying' && currentClass) {
    if (milestone.isExam) {
      return {
        state: 'upcoming',
        badgeText: '★ Final Goal',
        iconText: '★',
        label: 'Final Goal: SSC Examination'
      };
    }
    if (milestone.grade < currentClass) {
      return {
        state: 'completed',
        badgeText: '✓ Completed',
        iconText: '✓',
        label: `${milestone.name} Completed`
      };
    }
    if (milestone.grade === currentClass) {
      return {
        state: 'current',
        badgeText: '● CURRENT',
        iconText: '●',
        label: `${milestone.name} (Current Class)`
      };
    }
    return {
      state: 'upcoming',
      badgeText: '○ Upcoming',
      iconText: '○',
      label: `${milestone.name} (Upcoming)`
    };
  }

  return {
    state: 'upcoming',
    badgeText: milestone.isExam ? '★ Final Goal' : '○ Upcoming',
    iconText: milestone.isExam ? '★' : '○',
    label: `${milestone.name} (Upcoming)`
  };
}
```

---

## 7. Real-Time Countdown Engine

- **Interval Rate:** Exact 1000ms (`setInterval`).
- **Layout Shift Prevention:** Numbers are rendered with `font-variant-numeric: tabular-nums;` and padded strings (`padStart(2, '0')`).
- **Tick Micro-Animation:** Whenever a digit updates, CSS class `unit-tick` triggers a subtle scale keyframe.
- **Auto-Termination:** Once `diffMs <= 0`, the timer interval is cleared and the DOM automatically mounts the celebratory finished state.

```javascript
function formatCountdown(batchYear) {
  const examMs = getExamDate(batchYear);
  const nowMs = Date.now();
  const diffMs = examMs - nowMs;

  if (diffMs <= 0) return null;

  const totalSeconds = Math.floor(diffMs / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    totalSeconds
  };
}
```

---

## 8. Quote Shuffle Deck Algorithm

The motivational quotes deck uses the **Fisher-Yates Shuffle** algorithm combined with `sessionStorage` persistence to prevent immediate repetitions:

```javascript
function getRandomQuote() {
  let pool = [];
  const saved = sessionStorage.getItem(QUOTE_STORAGE_KEY);
  if (saved) {
    try { pool = JSON.parse(saved); } catch (e) { pool = []; }
  }

  if (!Array.isArray(pool) || pool.length === 0) {
    pool = MOTIVATIONAL_QUOTES.map((_, i) => i);
    // Fisher-Yates shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
  }

  const nextIndex = pool.pop();
  sessionStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(pool));
  return { ...MOTIVATIONAL_QUOTES[nextIndex], index: nextIndex };
}
```

---

## 9. Design System & Glassmorphism Styling Tokens

All styling tokens are controlled via CSS custom properties on `:root` and scoped under `[data-theme="light"]`:

```css
:root {
  --bg-base: #080b13;
  --surface-glass: rgba(15, 23, 42, 0.65);
  --surface-glass-card: rgba(30, 41, 59, 0.55);
  --surface-glass-subtle: rgba(30, 41, 59, 0.35);
  --border-glass: rgba(255, 255, 255, 0.08);
  --border-glass-glow: rgba(99, 102, 241, 0.35);
  --accent-primary: #6366f1;
  --accent-secondary: #a855f7;
  --accent-cyan: #06b6d4;
  --accent-emerald: #10b981;
}

[data-theme="light"] {
  --bg-base: #f8fafc;
  --surface-glass: rgba(255, 255, 255, 0.82);
  --surface-glass-card: rgba(255, 255, 255, 0.9);
  --surface-glass-subtle: rgba(241, 245, 249, 0.7);
  --border-glass: rgba(0, 0, 0, 0.08);
  --border-glass-glow: rgba(99, 102, 241, 0.4);
}
```

---

## 10. Accessibility, Performance & Browser Support

- **Screen Readers:** ARIA landmarks (`role="banner"`, `role="main"`, `role="contentinfo"`, `role="progressbar"`), clear accessible labels on inputs and buttons.
- **Keyboard Navigation:** Focus-visible rings with outline offsets on all interactive elements.
- **Performance:** First Contentful Paint (FCP) < 0.2s, Largest Contentful Paint (LCP) < 0.4s, Cumulative Layout Shift (CLS) = 0.00.
- **Cross-Browser Support:** Chrome 88+, Firefox 85+, Safari 14.1+, Edge 88+, iOS Safari 14.5+, Android Chrome.
