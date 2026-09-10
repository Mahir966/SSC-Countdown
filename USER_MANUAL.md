# 📖 SSC Countdown — Comprehensive User Manual

Welcome to **SSC Countdown**, the dedicated academic companion and examination countdown portal designed specifically for secondary students across Bangladesh.

---

## 📑 Table of Contents
1. [Overview & Purpose](#1-overview--purpose)
2. [Interface Overview](#2-interface-overview)
3. [Step-by-Step Usage Guide](#3-step-by-step-usage-guide)
4. [Understanding the Academic Journey (Class 1 → SSC Exam)](#4-understanding-the-academic-journey-class-1--ssc-exam)
5. [Understanding the Live Countdown Timer](#5-understanding-the-live-countdown-timer)
6. [Themes & Personalization](#6-themes--personalization)
7. [Daily Motivational Quotes](#7-daily-motivational-quotes)
8. [Frequently Asked Questions (FAQ)](#8-frequently-asked-questions-faq)
9. [Privacy & Security Notice](#9-privacy--security-notice)
10. [Contact & Attribution](#10-contact--attribution)

---

## 1. Overview & Purpose

The **Secondary School Certificate (SSC)** examination is one of the most significant academic milestones for students in Bangladesh. **SSC Countdown** was created to give students complete clarity regarding their academic standing, remaining preparation time, and educational trajectory.

By simply choosing an SSC batch year (such as SSC 2027 or SSC 2028), the application automatically:
- Identifies the student's exact academic grade level (e.g., Class 9 or Class 10).
- Calculates the estimated board examination commencement date (**February 1** of the batch year).
- Provides a live, real-time countdown in **Bangladesh Standard Time (BST, UTC+6)**.
- Maps the student's complete 10-year academic path from **Class 1 to SSC Exam**.
- Displays dynamic progress percentages and milestone cards.

---

## 2. Interface Overview

The user interface is engineered with a **liquid glassmorphism design language** featuring multi-layered translucent cards, glowing accents, and fluid transitions.

```text
┌────────────────────────────────────────────────────────────────────────┐
│  🎓 SSC Countdown [● BST Live]                     🌓 [Toggle Theme]   │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│                      Track Your SSC Journey                            │
│           Select your SSC batch to view your countdown.                │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 📅 Select SSC Batch: [ SSC 2028 • Class 9                    ▼ ] │  │
│  │ Popular Batches: [SSC 2026] [SSC 2027] [SSC 2028] [SSC 2029]     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  [Batch 2028] [Class 9 Student]                                  │  │
│  │  ACADEMIC STATUS: Class 9                                        │  │
│  │  Estimated Exam Start: February 1, 2028                          │  │
│  │                                                                  │  │
│  │  ⏳ LIVE COUNTDOWN (Asia/Dhaka BST)                              │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐             │  │
│  │  │ 508 Days │ │ 12 Hours │ │ 50 Mins  │ │ 41 Secs  │             │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘             │  │
│  │                                                                  │  │
│  │  📈 ACADEMIC JOURNEY: 86.2%                                      │  │
│  │  Class 1 Start ═══════════════════════════●═════★ SSC Exam       │  │
│  │                                                                  │  │
│  │  [Phase 1: Primary (Cl 1-5)] ✓ ✓ ✓ ✓ ✓                           │  │
│  │  [Phase 2: Junior (Cl 6-8)]  ✓ ✓ ✓                               │  │
│  │  [Phase 3: Senior (Cl 9-10)] ● CURRENT   ○ Upcoming   ★ Goal     │  │
│  │                                                                  │  │
│  │  💬 Daily Motivation Quote                                       │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  © 2026 Mahir Ahmed. All rights reserved. • Asia/Dhaka Standard Time   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Step-by-Step Usage Guide

### Step 1: Open the Application
- Open the application in any modern browser (Chrome, Edge, Firefox, Safari, Brave).
- No login, registration, or setup is required.

### Step 2: Choose Your SSC Batch
You can choose your batch using either of two methods:
1. **Dropdown Menu:** Click the **Select SSC Batch** dropdown to see the full list of available years.
2. **Quick Select Pills:** Click directly on popular batch buttons (e.g., **SSC 2027**, **SSC 2028**, **SSC 2029**).

### Step 3: View Your Custom Dashboard
Once selected, the dashboard dynamically renders:
- Your **Academic Status** (e.g., *Class 9*, *Class 10*, or *SSC Finished*).
- Your **Estimated Exam Start Date** (e.g., *February 1, 2028*).
- The high-precision **Live Countdown** timer.
- Your complete **Academic Journey Ladder** from Class 1 to SSC.
- A handpicked **Motivational Quote**.

---

## 4. Understanding the Academic Journey (Class 1 → SSC Exam)

Unlike traditional trackers that only look at senior secondary, **SSC Countdown** honors the student's complete 10-year educational journey starting from **Class 1**.

### Mathematical Formula:
- **Journey Start Date:** January 1 of `(batchYear - 10)` at 00:00:00 BST.
- **Examination Date:** February 1 of `batchYear` at 00:00:00 BST.
- **Elapsed Duration:** Real-time elapsed time from Class 1 start to current moment.
- **Progress Percentage:** `Math.min(100, (elapsed / total) * 100)`.

### Three Educational Phases:
1. **Phase 1: Primary Education (Classes 1 – 5):**
   Foundational literacy, numeracy, and environmental studies.
2. **Phase 2: Junior Secondary (Classes 6 – 8):**
   Broad multidisciplinary secondary education.
3. **Phase 3: Secondary & Board Exam (Classes 9, 10 & SSC Exam):**
   Department-specific streams (Science, Business Studies, Humanities) culminating in the national board exams.

### Milestone Statuses:
- **✓ Completed:** Milestone has been successfully passed. Highlighted with soft green tones and checkmark icon.
- **● CURRENT:** The student's active academic year. Displayed with a bright pulsing beacon and glowing border.
- **○ Upcoming:** Future academic classes ahead. Displayed in neutral glass tones.
- **★ Final Goal / Finished:** The SSC examination milestone itself, crowned with a golden star.

---

## 5. Understanding the Live Countdown Timer

- **Timezone Synchronization:** The countdown is calculated strictly in **Bangladesh Standard Time (BST, UTC+6)**, ensuring identical values whether you are in Dhaka, Chittagong, Sylhet, or overseas.
- **Real-Time Precision:** Seconds tick continuously in real time using tabular numerals to prevent layout shifting.
- **Exam Rule:** In line with the application specification, every SSC batch exam begins on **February 1** of its batch year at 00:00:00 BST.
- **Never Negative:** If an exam has already concluded (such as SSC 2026), the timer transitions gracefully into the **SSC Finished Celebration Card**.

---

## 6. Themes & Personalization

- **Theme Toggle Button:** Located at the top-right of the header.
- **Dark Mode (Default):** Deep obsidian glass palette (`#080b13`) designed to minimize eye strain during late-night study sessions.
- **Light Mode:** Crisp, clean daylight glass palette (`#f8fafc`) with deep slate typography for high-glare environments.
- **Automatic Persistence:** Your theme choice is automatically saved in browser `localStorage` and restored on subsequent visits.
- **System Preference Detection:** Automatically adheres to your device's `prefers-color-scheme` setting if no manual preference has been set.

---

## 7. Daily Motivational Quotes

To keep students inspired during rigorous exam preparation:
- The app features a carefully curated collection of **28 motivational study quotes**.
- Built with a **Fisher-Yates shuffle deck** that guarantees you won't see repetitive quotes until the entire deck is explored.
- Click **Next Quote** at any time to immediately shuffle to another inspiring message.

---

## 8. Frequently Asked Questions (FAQ)

### Q1: Why is the examination date set to February 1?
**A:** February 1 is the standard project benchmark date for SSC examinations in Bangladesh. This provides a clear, reliable, and predictable milestone for all students.

### Q2: Why does the Academic Progress start from Class 1 instead of Class 6?
**A:** A student's preparation for board examinations begins on their very first day of primary school. Tracking the complete 10-year journey offers a more holistic, encouraging, and accurate view of their academic achievements.

### Q3: Does this app work on mobile devices?
**A:** Yes. The application is completely responsive and rigorously tested on screens from 320px (compact phones) up to 4K desktop monitors.

### Q4: Does the app require an internet connection after loading?
**A:** No. All calculations, animations, and quotes run entirely client-side. Once the page is loaded, it continues to run offline without an active internet connection.

---

## 9. Privacy & Security Notice

- **Zero Data Collection:** No student names, phone numbers, birth certificates, or schools are collected.
- **Zero Cookies / Trackers:** No tracking pixels or advertising cookies.
- **Safe for Schools & Libraries:** 100% compliant with student privacy best practices.

---

## 10. Contact & Attribution

Developed with care by **Mahir Ahmed**.

- 🌐 **Portfolio:** [https://mahir966.github.io/mahir.github.io/](https://mahir966.github.io/mahir.github.io/)
- 📜 **Copyright:** © 2026 Mahir Ahmed. All rights reserved.
