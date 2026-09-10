/**
 * ═══════════════════════════════════════════════════════════
 * SSC Countdown — Core Business Logic & Application Engine
 * Pure Vanilla JavaScript (Zero Dependencies)
 * ═══════════════════════════════════════════════════════════
 */

// ─── Constants ──────────────────────────────────────────────
const EXAM_MONTH = 2; // February (1-indexed)
const EXAM_DAY = 1;
const ACADEMIC_JOURNEY_YEARS = 10;
const BST_OFFSET_HOURS = 6;
const BST_OFFSET_MS = BST_OFFSET_HOURS * 60 * 60 * 1000;

// ─── Motivational Quotes Collection ─────────────────────────
const MOTIVATIONAL_QUOTES = [
  { text: "Small progress every day becomes big progress over time.", author: "Daily Focus" },
  { text: "Your future is built by what you do today, not tomorrow.", author: "Action Mindset" },
  { text: "Consistency beats motivation every single time.", author: "Study Rule" },
  { text: "The secret of getting ahead is simply getting started.", author: "Mark Twain" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "Believe you can and you are already halfway there.", author: "Theodore Roosevelt" },
  { text: "Focus on continuous progress, never on perfection.", author: "Study Mindset" },
  { text: "Every expert was once a beginner. Keep moving forward.", author: "Helen Hayes" },
  { text: "Hard work puts you where good luck can find you.", author: "Perseverance" },
  { text: "Your education is a dress rehearsal for a life that is yours to lead.", author: "Nora Ephron" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "Do not count the days—make every day count.", author: "Muhammad Ali" },
  { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "Action is the foundational key to all achievements.", author: "Pablo Picasso" },
  { text: "A little more persistence turns difficult tasks into great accomplishments.", author: "Resilience" },
  { text: "Study now so you can stand proud tomorrow.", author: "Student Wisdom" },
  { text: "The best way to predict your future is to build it yourself.", author: "Peter Drucker" },
  { text: "Great achievements never come from remaining in comfort zones.", author: "Growth" },
  { text: "Dream big, work diligently, and stay focused on your goals.", author: "Daily Inspiration" },
  { text: "Mistakes are proof that you are trying, learning, and improving.", author: "Learning Path" },
  { text: "It always seems impossible until it is done.", author: "Nelson Mandela" },
  { text: "The effort you put in today becomes the confidence you carry tomorrow.", author: "SSC Prep" },
  { text: "Push yourself forward, because your ambition belongs to you.", author: "Self Belief" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "Success does not come to you—you actively pursue it.", author: "Marva Collins" },
  { text: "One day all your quiet late nights and early mornings will pay off.", author: "Dedication" },
  { text: "Confidence is not born; it is forged through preparation.", author: "Excellence" },
  { text: "Master each lesson step-by-step; the summit will take care of itself.", author: "Journey" }
];

const QUOTE_STORAGE_KEY = 'ssc_quote_deck';

// ─── Timezone & Date Calculations ───────────────────────────

/**
 * Get current time in Bangladesh Standard Time (Asia/Dhaka, UTC+6).
 * @param {Date|string|number} [now] - Optional date override for testing
 * @returns {{ year: number, nowMs: number, date: Date }}
 */
function getBangladeshNow(now) {
  const d = now ? new Date(now) : new Date();
  const nowMs = d.getTime();

  let bdYear;
  try {
    const bdString = d.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });
    bdYear = new Date(bdString).getFullYear();
  } catch (e) {
    // Fallback if Intl timeZone unavailable
    const utcTime = d.getTime() + d.getTimezoneOffset() * 60000;
    const bdTime = new Date(utcTime + BST_OFFSET_MS);
    bdYear = bdTime.getFullYear();
  }

  return { year: bdYear, nowMs, date: d };
}

/**
 * Get the exact UTC timestamp for SSC Examination Start Date:
 * Always February 1 of the batch year at 00:00:00 BST.
 * @param {number} batchYear
 * @returns {number} UTC timestamp in ms
 */
function getExamDate(batchYear) {
  // Feb 1 00:00:00 BST (UTC+6) = Jan 31 18:00:00 UTC
  return Date.UTC(batchYear, EXAM_MONTH - 1, EXAM_DAY, 0, 0, 0) - BST_OFFSET_MS;
}

/**
 * Calculate academic progress percentage from Class 1 start to SSC exam date.
 * Total duration: 10 years + 1 month (Jan 1 of [batchYear - 10] to Feb 1 of batchYear).
 * @param {number} batchYear
 * @param {Date|string|number} [currentDate]
 * @returns {number} Progress clamped to [0, 100] with 1 decimal place
 */
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

/**
 * Calculate student academic status based on SSC batch year.
 * @param {number} batchYear - Batch year (e.g. 2028)
 * @param {Date|string|number} [currentDate] - Optional override
 * @returns {Object} Structured student status
 */
function calculateStudentStatus(batchYear, currentDate) {
  if (!batchYear || typeof batchYear !== 'number' || !Number.isInteger(batchYear)) {
    return { error: 'Invalid batch year', batch: batchYear };
  }
  if (batchYear < 2000 || batchYear > 2100) {
    return { error: 'Batch year out of range', batch: batchYear };
  }

  const bd = getBangladeshNow(currentDate);
  const currentYear = bd.year;
  const nowMs = bd.nowMs;

  const examTimestampUTC = getExamDate(batchYear);
  const examDateISO = `${batchYear}-02-01`;
  const examLabel = `February 1, ${batchYear}`;
  const examPassed = nowMs >= examTimestampUTC;

  const yearDiff = batchYear - currentYear;

  let currentClass = null;
  let status = '';
  let statusMessage = '';

  if (yearDiff < 0 || (yearDiff === 0 && examPassed)) {
    status = 'finished';
    statusMessage = 'SSC Examination Completed';
  } else if (yearDiff === 0 && !examPassed) {
    status = 'candidate';
    statusMessage = 'SSC Candidate — Exam approaching!';
    currentClass = 10;
  } else {
    const calculatedClass = 10 - yearDiff + 1;
    if (calculatedClass >= 1 && calculatedClass <= 10) {
      currentClass = calculatedClass;
      status = 'studying';
      statusMessage = `Currently in Class ${currentClass}`;
    } else {
      status = 'future';
      statusMessage = 'Academic journey has not started yet';
    }
  }

  // Live countdown remaining breakdown
  let timeRemaining = null;
  if (!examPassed) {
    const diffMs = examTimestampUTC - nowMs;
    const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    timeRemaining = { days, hours, minutes, seconds, totalSeconds };
  }

  const progress = calculateAcademicProgress(batchYear, currentDate);

  return {
    batch: batchYear,
    currentClass,
    status,
    statusMessage,
    examDate: examDateISO,
    examLabel,
    examTimestampUTC,
    timeRemaining,
    progress,
    currentYear
  };
}

/**
 * Generate available batch choices for dropdown & pills.
 * @param {Date|string|number} [currentDate]
 * @returns {Array<Object>}
 */
function getAvailableBatches(currentDate) {
  const bd = getBangladeshNow(currentDate);
  const currentYear = bd.year;
  const startYear = currentYear - 1;
  const endYear = currentYear + 10;

  const batches = [];
  for (let y = startYear; y <= endYear; y++) {
    const info = calculateStudentStatus(y, currentDate);
    batches.push({
      year: y,
      label: `SSC ${y}`,
      status: info.status,
      currentClass: info.currentClass,
      isCurrentBatch: y === currentYear,
      statusMessage: info.statusMessage
    });
  }
  return batches;
}

/**
 * Format remaining countdown numbers.
 * @param {number} batchYear
 * @returns {{ days: number, hours: number, minutes: number, seconds: number, totalSeconds: number } | null}
 */
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

// ─── Motivational Quote System ──────────────────────────────

/**
 * Get a randomized quote ensuring no immediate repeat until the full pool is used.
 * @returns {{ text: string, author: string, index: number }}
 */
function getRandomQuote() {
  try {
    let pool = [];
    const saved = sessionStorage.getItem(QUOTE_STORAGE_KEY);
    if (saved) {
      try {
        pool = JSON.parse(saved);
      } catch (e) {
        pool = [];
      }
    }

    if (!Array.isArray(pool) || pool.length === 0) {
      pool = MOTIVATIONAL_QUOTES.map((_, i) => i);
      // Fisher-Yates shuffle
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = pool[i];
        pool[i] = pool[j];
        pool[j] = temp;
      }
    }

    const nextIndex = pool.pop();
    sessionStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(pool));
    return {
      ...MOTIVATIONAL_QUOTES[nextIndex],
      index: nextIndex
    };
  } catch (e) {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    return {
      ...MOTIVATIONAL_QUOTES[randomIndex],
      index: randomIndex
    };
  }
}

// ─── Complete Academic Milestones (Class 1 to SSC Exam) ─────

const ACADEMIC_MILESTONES = [
  { id: 1, name: 'Class 1', shortName: 'Cl 1', grade: 1, phase: 'Primary', phaseKey: 'primary' },
  { id: 2, name: 'Class 2', shortName: 'Cl 2', grade: 2, phase: 'Primary', phaseKey: 'primary' },
  { id: 3, name: 'Class 3', shortName: 'Cl 3', grade: 3, phase: 'Primary', phaseKey: 'primary' },
  { id: 4, name: 'Class 4', shortName: 'Cl 4', grade: 4, phase: 'Primary', phaseKey: 'primary' },
  { id: 5, name: 'Class 5', shortName: 'Cl 5', grade: 5, phase: 'Primary', phaseKey: 'primary' },
  { id: 6, name: 'Class 6', shortName: 'Cl 6', grade: 6, phase: 'Junior Secondary', phaseKey: 'middle' },
  { id: 7, name: 'Class 7', shortName: 'Cl 7', grade: 7, phase: 'Junior Secondary', phaseKey: 'middle' },
  { id: 8, name: 'Class 8', shortName: 'Cl 8', grade: 8, phase: 'Junior Secondary', phaseKey: 'middle' },
  { id: 9, name: 'Class 9', shortName: 'Cl 9', grade: 9, phase: 'Secondary', phaseKey: 'secondary' },
  { id: 10, name: 'Class 10', shortName: 'Cl 10', grade: 10, phase: 'Secondary', phaseKey: 'secondary' },
  { id: 11, name: 'SSC Exam', shortName: 'SSC', grade: 11, phase: 'Board Exam', phaseKey: 'exam', isExam: true }
];

/**
 * Determine dynamic state of an academic milestone relative to the student status.
 * @param {Object} milestone
 * @param {Object} data - Student status from calculateStudentStatus
 * @returns {{ state: string, badgeText: string, iconText: string, label: string }}
 */
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

  // status === 'future' (Pre-school / before Class 1)
  return {
    state: 'upcoming',
    badgeText: milestone.isExam ? '★ Final Goal' : '○ Upcoming',
    iconText: milestone.isExam ? '★' : '○',
    label: `${milestone.name} (Upcoming)`
  };
}

// ─── UI Controller & Event Handlers ─────────────────────────

(function initApp() {
  if (typeof document === 'undefined') return;

  // DOM Elements
  const htmlRoot = document.documentElement;
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIconContainer = document.getElementById('theme-icon-container');
  const batchSelect = document.getElementById('batch-select');
  const quickPillsContainer = document.getElementById('quick-select-pills');
  const dashboardContainer = document.getElementById('dashboard-container');
  const emptyStateContainer = document.getElementById('empty-state-container');
  const errorBanner = document.getElementById('error-banner');

  let currentSelectedBatch = null;
  let countdownTimerId = null;
  let prevDigits = { days: '', hours: '', minutes: '', seconds: '' };

  // 1. Theme Management
  function getPreferredTheme() {
    try {
      const saved = localStorage.getItem('ssc-theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {}
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  }

  function setTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('ssc-theme', theme);
    } catch (e) {}
    updateThemeIcon(theme);
  }

  function updateThemeIcon(theme) {
    if (!themeIconContainer) return;
    const isDark = theme === 'dark';
    themeToggleBtn.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
    themeToggleBtn.setAttribute('title', `Switch to ${isDark ? 'light' : 'dark'} mode`);

    themeIconContainer.innerHTML = isDark
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
  }

  // Theme Toggle Listener
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = htmlRoot.getAttribute('data-theme') || 'dark';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // 2. Populate Batch Selector & Quick Pills
  const availableBatches = getAvailableBatches();

  function renderBatchOptions() {
    if (!batchSelect) return;
    batchSelect.innerHTML = '<option value="">— Choose your SSC Batch Year —</option>';
    availableBatches.forEach(b => {
      const opt = document.createElement('option');
      opt.value = b.year;
      let suffix = '';
      if (b.currentClass) suffix = ` • Class ${b.currentClass}`;
      else if (b.status === 'finished') suffix = ' • SSC Finished';
      else if (b.status === 'candidate') suffix = ' • SSC Candidate';
      else if (b.status === 'future') suffix = ' • Future Batch';
      opt.textContent = `${b.label}${suffix}`;
      batchSelect.appendChild(opt);
    });
  }

  function renderQuickPills() {
    if (!quickPillsContainer) return;
    quickPillsContainer.innerHTML = '';
    const popularYears = [2026, 2027, 2028, 2029];
    const popularBatches = availableBatches.filter(b => popularYears.includes(b.year));

    popularBatches.forEach(b => {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = `quick-pill ${currentSelectedBatch === b.year ? 'active' : ''}`;
      pill.setAttribute('aria-pressed', currentSelectedBatch === b.year ? 'true' : 'false');
      pill.setAttribute('data-year', b.year);

      let metaSpan = '';
      if (b.currentClass) metaSpan = `<span class="pill-meta">Cl. ${b.currentClass}</span>`;
      else if (b.status === 'finished') metaSpan = `<span class="pill-meta done">Finished</span>`;

      pill.innerHTML = `<span>${b.label}</span>${metaSpan}`;
      pill.addEventListener('click', () => selectBatch(b.year));
      quickPillsContainer.appendChild(pill);
    });
  }

  function updateActivePill() {
    if (!quickPillsContainer) return;
    const pills = quickPillsContainer.querySelectorAll('.quick-pill');
    pills.forEach(pill => {
      const y = Number(pill.getAttribute('data-year'));
      const isMatch = y === currentSelectedBatch;
      pill.classList.toggle('active', isMatch);
      pill.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
    });
  }

  // 3. Batch Selection & Dashboard Rendering
  function selectBatch(year) {
    const numericYear = year ? Number(year) : null;
    currentSelectedBatch = numericYear;

    if (batchSelect) {
      batchSelect.value = numericYear ? String(numericYear) : '';
    }
    updateActivePill();

    if (!numericYear) {
      clearDashboard();
      return;
    }

    renderDashboard(numericYear);
  }

  function clearDashboard() {
    if (countdownTimerId) {
      clearInterval(countdownTimerId);
      countdownTimerId = null;
    }
    if (dashboardContainer) {
      dashboardContainer.style.display = 'none';
      dashboardContainer.innerHTML = '';
    }
    if (emptyStateContainer) {
      emptyStateContainer.style.display = 'flex';
      renderEmptyStateQuote();
    }
    if (errorBanner) {
      errorBanner.style.display = 'none';
    }
  }

  function getProgressMessage(status, progress, currentClass) {
    if (status === 'finished') return 'Academic milestone achieved! Congratulations on completing your complete 10-year Class 1 → SSC examination journey.';
    if (status === 'candidate') return 'Final lap! You are in the examination period of your 10-year secondary academic journey.';
    if (status === 'future') return 'Your 10-year academic journey from Class 1 to SSC will begin soon. Stay prepared!';
    if (currentClass) {
      if (currentClass === 10) return 'Class 10 — The final stretch! Consolidating 10 years of learning for the board examination.';
      if (currentClass === 9) return 'Class 9 — Entering senior secondary. Laying the crucial core foundation for the SSC examination.';
      if (currentClass >= 6) return `Class ${currentClass} — Junior secondary milestones are advancing steadily toward SSC.`;
      return `Class ${currentClass} — Building core educational fundamentals on your pathway to SSC.`;
    }
    if (progress >= 90) return 'Final lap! You are in the home stretch of your complete academic pathway.';
    if (progress >= 70) return 'Great momentum! High school milestones are steadily advancing.';
    if (progress >= 50) return 'Over halfway through your Class 1 → SSC educational journey!';
    return 'Continuing your foundational academic journey toward the SSC examination.';
  }

  function renderJourneyLadderHtml(data) {
    const phases = [
      {
        id: 'primary',
        title: 'Primary Education',
        classes: 'Classes 1 – 5',
        milestones: ACADEMIC_MILESTONES.filter(m => m.phaseKey === 'primary')
      },
      {
        id: 'middle',
        title: 'Junior Secondary',
        classes: 'Classes 6 – 8',
        milestones: ACADEMIC_MILESTONES.filter(m => m.phaseKey === 'middle')
      },
      {
        id: 'secondary',
        title: 'Secondary & Board Exam',
        classes: 'Classes 9, 10 & SSC',
        milestones: ACADEMIC_MILESTONES.filter(m => m.phaseKey === 'secondary' || m.phaseKey === 'exam')
      }
    ];

    return `
      <div class="journey-phases-container">
        ${phases.map(p => `
          <div class="journey-phase-group">
            <div class="phase-group-header">
              <span class="phase-badge">${p.title}</span>
              <span class="phase-sub">${p.classes}</span>
            </div>
            <div class="milestones-grid phase-${p.id}">
              ${p.milestones.map(m => {
                const mState = getMilestoneState(m, data);
                const isCurrent = mState.state === 'current';
                const isExam = !!m.isExam;

                return `
                  <div class="milestone-card ${mState.state} ${isExam ? 'milestone-exam' : ''}" 
                       data-grade="${m.grade}"
                       title="${mState.label}">
                    <div class="milestone-status-indicator" aria-hidden="true">
                      <span class="indicator-glyph">${mState.iconText}</span>
                      ${isCurrent ? '<span class="current-pulse-ring"></span>' : ''}
                    </div>
                    <div class="milestone-content">
                      <div class="milestone-title-row">
                        <span class="milestone-name">${m.name}</span>
                        ${isExam ? '<span class="exam-star" aria-hidden="true">★</span>' : ''}
                      </div>
                      <span class="milestone-state-badge ${mState.state}">${mState.badgeText}</span>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderDashboard(batchYear) {
    const data = calculateStudentStatus(batchYear);
    if (data.error) {
      if (errorBanner) {
        errorBanner.textContent = data.error;
        errorBanner.style.display = 'flex';
      }
      return;
    }

    if (errorBanner) errorBanner.style.display = 'none';
    if (emptyStateContainer) emptyStateContainer.style.display = 'none';

    if (countdownTimerId) {
      clearInterval(countdownTimerId);
      countdownTimerId = null;
    }

    const isFinished = data.status === 'finished';
    const isFuture = data.status === 'future';

    const classDisplay = data.currentClass
      ? `Class ${data.currentClass}`
      : isFinished
        ? 'SSC Finished'
        : isFuture
          ? 'Pre-Secondary'
          : 'SSC Candidate';

    let statusTagLabel = '';
    if (data.status === 'studying') statusTagLabel = `Class ${data.currentClass} Student`;
    else if (data.status === 'candidate') statusTagLabel = 'SSC Candidate Year';
    else if (data.status === 'finished') statusTagLabel = 'Examination Completed';
    else statusTagLabel = 'Future Academic Batch';

    const quote = getRandomQuote();

    dashboardContainer.innerHTML = `
      <!-- Top Banner -->
      <div class="dashboard-hero">
        <div class="dashboard-batch-meta">
          <span class="batch-pill">Batch ${data.batch}</span>
          <div class="status-tag ${data.status}">
            <span class="status-dot" aria-hidden="true"></span>
            <span>${statusTagLabel}</span>
          </div>
        </div>
        <div class="dashboard-main-heading">
          <div class="class-status-badge">
            <span class="class-label-micro">Academic Status</span>
            <h2 class="class-title-primary">${classDisplay}</h2>
          </div>
        </div>
        <p class="status-explanation">${data.statusMessage}</p>
      </div>

      <!-- Info Metrics Grid -->
      <div class="info-cards-grid">
        <div class="info-metric-card">
          <div class="metric-icon-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>
          <div class="metric-content">
            <span class="metric-label">Estimated Exam Start</span>
            <span class="metric-value">${data.examLabel}</span>
          </div>
        </div>

        <div class="info-metric-card">
          <div class="metric-icon-wrap">
            ${data.currentClass
              ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`
              : isFinished
                ? `<svg width="18" height="18" class="success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
                : `<svg width="18" height="18" class="info" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`
            }
          </div>
          <div class="metric-content">
            <span class="metric-label">${data.currentClass ? 'Current Academic Level' : 'Batch Horizon'}</span>
            <span class="metric-value">${data.currentClass ? `Class ${data.currentClass}` : (isFinished ? 'Milestone Reached' : 'Scheduled Ahead')}</span>
          </div>
        </div>
      </div>

      <!-- Centerpiece Section: Countdown or Completed State -->
      <div id="countdown-mount">
        ${isFinished ? `
          <div class="finished-celebration-card glass-card">
            <div class="celebration-icon-wrap" aria-hidden="true">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <h3 class="celebration-title">SSC Examination Completed</h3>
            <p class="celebration-desc">
              The SSC ${data.batch} examination began on <strong>${data.examLabel}</strong>.
              Congratulations to all candidates and graduates!
            </p>
          </div>
        ` : `
          <section class="countdown-section" aria-label="Time remaining until SSC examination">
            <div class="countdown-header">
              <div class="countdown-header-left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="countdown-header-icon" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                <span class="countdown-title">Live Countdown</span>
              </div>
              <div class="countdown-tz-chip" title="Calculated in Bangladesh Standard Time (UTC+6)">
                <span class="tz-dot" aria-hidden="true"></span>
                <span>BST (Asia/Dhaka)</span>
              </div>
            </div>

            <div class="countdown-grid" role="timer" aria-live="off">
              <div class="countdown-unit glass-card" id="unit-days">
                <div class="countdown-glow" aria-hidden="true"></div>
                <div class="countdown-number-wrapper">
                  <div class="countdown-number" id="num-days">--</div>
                </div>
                <div class="countdown-label">Days</div>
              </div>

              <div class="countdown-unit glass-card" id="unit-hours">
                <div class="countdown-glow" aria-hidden="true"></div>
                <div class="countdown-number-wrapper">
                  <div class="countdown-number" id="num-hours">--</div>
                </div>
                <div class="countdown-label">Hours</div>
              </div>

              <div class="countdown-unit glass-card" id="unit-minutes">
                <div class="countdown-glow" aria-hidden="true"></div>
                <div class="countdown-number-wrapper">
                  <div class="countdown-number" id="num-minutes">--</div>
                </div>
                <div class="countdown-label">Minutes</div>
              </div>

              <div class="countdown-unit glass-card" id="unit-seconds">
                <div class="countdown-glow" aria-hidden="true"></div>
                <div class="countdown-number-wrapper">
                  <div class="countdown-number" id="num-seconds">--</div>
                </div>
                <div class="countdown-label">Seconds</div>
              </div>
            </div>
          </section>
        `}
      </div>

      <!-- Academic Progress Section -->
      <section class="progress-section" aria-label="Academic progress from Class 1 toward SSC">
        <div class="progress-header">
          <div class="progress-title-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="progress-icon" aria-hidden="true"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
            <div class="progress-title-group">
              <span class="progress-title">Academic Journey</span>
              <span class="progress-subtitle">Complete 10-Year Educational Pathway (Class 1 → SSC Exam)</span>
            </div>
          </div>
          <div class="progress-value-badge">
            <span id="progress-value-text">${data.progress}%</span>
          </div>
        </div>

        <div class="progress-track-wrapper">
          <div class="progress-track-endpoints">
            <div class="endpoint start">
              <span class="endpoint-dot" aria-hidden="true"></span>
              <span class="endpoint-label">Class 1 Start</span>
            </div>
            <div class="endpoint-middle-status">
              <span class="status-summary-pill">
                ${data.status === 'finished' 
                  ? 'All 10 Academic Levels & SSC Exam Completed' 
                  : (data.currentClass ? `Currently in Class ${data.currentClass}` : data.statusMessage)}
              </span>
            </div>
            <div class="endpoint end">
              <span class="endpoint-star" aria-hidden="true">★</span>
              <span class="endpoint-label">SSC Examination</span>
            </div>
          </div>

          <div class="progress-bar-track" role="progressbar" aria-valuenow="${data.progress}" aria-valuemin="0" aria-valuemax="100" aria-label="Academic progress from Class 1 to SSC: ${data.progress}%">
            <div class="progress-bar-fill" id="progress-bar-fill" style="width: ${Math.max(data.progress, 1.5)}%;">
              <div class="progress-shimmer" aria-hidden="true"></div>
              <div class="progress-pin" aria-hidden="true"></div>
            </div>
          </div>
        </div>

        <!-- 11-Milestone Educational Pathway Ladder -->
        <div class="academic-journey-ladder" aria-label="Academic milestones from Class 1 to SSC Examination">
          ${renderJourneyLadderHtml(data)}
        </div>

        <div class="progress-message-card">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="message-icon" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
          <span class="progress-message" id="progress-message-text">${getProgressMessage(data.status, data.progress, data.currentClass)}</span>
        </div>
      </section>

      <!-- Motivational Quote Card -->
      <div id="dashboard-quote-mount">
        ${renderQuoteCardHtml(quote)}
      </div>
    `;

    dashboardContainer.style.display = 'flex';
    setupQuoteButtonListener(dashboardContainer);

    // If active countdown, launch real-time 1-second interval
    if (!isFinished) {
      prevDigits = { days: '', hours: '', minutes: '', seconds: '' };
      updateCountdownTicks(batchYear);
      countdownTimerId = setInterval(() => {
        updateCountdownTicks(batchYear);
      }, 1000);
    }
  }

  function updateCountdownTicks(batchYear) {
    const time = formatCountdown(batchYear);
    const mount = document.getElementById('countdown-mount');

    if (!time) {
      if (countdownTimerId) clearInterval(countdownTimerId);
      if (mount) {
        mount.innerHTML = `
          <div class="finished-celebration-card glass-card">
            <div class="celebration-icon-wrap" aria-hidden="true">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <h3 class="celebration-title">SSC Examination Completed</h3>
            <p class="celebration-desc">The examination countdown has concluded.</p>
          </div>
        `;
      }
      return;
    }

    const daysStr = String(time.days).padStart(time.days >= 100 ? 3 : 2, '0');
    const hoursStr = String(time.hours).padStart(2, '0');
    const minsStr = String(time.minutes).padStart(2, '0');
    const secsStr = String(time.seconds).padStart(2, '0');

    updateUnitDOM('days', daysStr);
    updateUnitDOM('hours', hoursStr);
    updateUnitDOM('minutes', minsStr);
    updateUnitDOM('seconds', secsStr);
  }

  function updateUnitDOM(unitKey, valueStr) {
    const numEl = document.getElementById(`num-${unitKey}`);
    const unitEl = document.getElementById(`unit-${unitKey}`);
    if (!numEl || !unitEl) return;

    if (numEl.textContent !== valueStr) {
      numEl.textContent = valueStr;
      if (prevDigits[unitKey] !== '' && prevDigits[unitKey] !== valueStr) {
        unitEl.classList.remove('unit-tick');
        // Trigger reflow for animation restart
        void unitEl.offsetWidth;
        unitEl.classList.add('unit-tick');
      }
      prevDigits[unitKey] = valueStr;
    }
  }

  function renderQuoteCardHtml(quote) {
    return `
      <section class="quote-card glass-card" aria-label="Daily study motivation">
        <div class="quote-card-header">
          <div class="quote-card-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="badge-icon" aria-hidden="true"><path d="M12 2l2.4 5 5.6.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.6-.8z"></path></svg>
            <span>Daily Motivation</span>
          </div>
          <button type="button" class="quote-refresh-btn" aria-label="Get another motivational quote" title="Show next inspirational quote">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
            <span class="refresh-label">Next Quote</span>
          </button>
        </div>
        <blockquote class="quote-body">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="quote-mark" aria-hidden="true"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
          <p class="quote-text">“${quote.text}”</p>
        </blockquote>
        <div class="quote-footer">
          <span class="quote-author">— ${quote.author || 'Study Inspiration'}</span>
        </div>
      </section>
    `;
  }

  function setupQuoteButtonListener(scope) {
    const btn = scope.querySelector('.quote-refresh-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      btn.classList.add('refreshing');
      const newQuote = getRandomQuote();
      const textEl = scope.querySelector('.quote-text');
      const authorEl = scope.querySelector('.quote-author');

      if (textEl) {
        textEl.style.opacity = '0';
        setTimeout(() => {
          textEl.textContent = `“${newQuote.text}”`;
          if (authorEl) authorEl.textContent = `— ${newQuote.author || 'Study Inspiration'}`;
          textEl.style.opacity = '1';
        }, 150);
      }
      setTimeout(() => btn.classList.remove('refreshing'), 400);
    });
  }

  function renderEmptyStateQuote() {
    const mount = document.getElementById('empty-quote-mount');
    if (!mount) return;
    const quote = getRandomQuote();
    mount.innerHTML = renderQuoteCardHtml(quote);
    setupQuoteButtonListener(mount);
  }

  // 4. Bind Dropdown Event Listener
  if (batchSelect) {
    batchSelect.addEventListener('change', (e) => {
      selectBatch(e.target.value);
    });
  }

  // 5. Initialize Application
  setTheme(getPreferredTheme());
  renderBatchOptions();
  renderQuickPills();
  renderEmptyStateQuote();

  // Expose core business logic on window for automated verification and test scripts
  if (typeof window !== 'undefined') {
    window.SSC = {
      calculateStudentStatus,
      getExamDate,
      calculateAcademicProgress,
      getRandomQuote,
      formatCountdown,
      getBangladeshNow,
      getAvailableBatches,
      ACADEMIC_MILESTONES,
      getMilestoneState,
      MOTIVATIONAL_QUOTES
    };
  }
})();

// Export for Node.js test environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateStudentStatus,
    getExamDate,
    calculateAcademicProgress,
    getRandomQuote,
    formatCountdown,
    getBangladeshNow,
    getAvailableBatches,
    ACADEMIC_MILESTONES,
    getMilestoneState,
    MOTIVATIONAL_QUOTES,
    EXAM_MONTH,
    EXAM_DAY,
    ACADEMIC_JOURNEY_YEARS
  };
}
