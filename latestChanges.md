# 🛠️ Re-Docs Latest Changes Log

This log tracks the evolution of the Re-Docs MERN stack application, covering high-performance infrastructure, premium features, and UI/UX refinements.

---

## 📅 April 13, 2026

### 🚀 UI & Analytics Infrastructure
- **Hero Evolution & Analytics**: Integrated live metrics (Notes, Tags, Topics, Users) directly into the Hero section as a minimalist inline row.
- **Cyber/Matrix Cipher Effect**: Implemented an "active encryption" visual for numeric metrics that triggers during backend cold starts or downtime.
- **Persistent Stats Snapshot**: Created a `Stats` model and `/api/global/initial-data` route to provide "last-known" application states for instant UI rendering.
- **Pro Comparison Engine**: Developed a side-by-side comparison feature to clearly illustrate Free vs. Pro account capabilities.
- **Backend Health Monitor**: Launched a real-time `BackendStatus` glassmorphic tracker with "Connecting", "Live", and "Offline" states.

### 🔒 Access Control & Security
- **Guest Preview Mode**: Implemented a 20-second "timed preview" for unauthenticated users on private/public notes with automatic redirection to `/login`.
- **UI Guard Rails**: Hidden sensitive features (Markdown upload, ZIP export, bulk actions) from non-owners and guests to prevent unauthorized data interaction.

### 🎨 Visual & Quality Cleanup
- **Code Block Intelligence**: Added automatic language detection and sticky labels for Markdown code blocks.
- **Style Optimization**: Resized the "Engineered With" tech marquee and refined the Hero's glassmorphic visual boxes for a static, cleaner aesthetic.
- **API Reliability**: Relocated the `/api/health` route after CORS middleware to fix cross-origin connectivity monitoring.

---

## 📅 April 7, 2026

### 🌐 Community Discovery
- **Live Data Bridge**: Integrated 1,600+ public notes directly into the home page marquee.
- **"Random Discovery" Algorithm**: Developed a high-performance randomized fetching strategy using MongoDB Aggregation to ensure diverse content visibility.
- **Marquee Refinement**: Normalized animation velocity and fixed data mapping for user/category relationships.

---

## 📅 April 1, 2026

### 💎 Pro Membership System
- **Tiered Rate Limiting**: Implemented differentiated upload capacity for Normal (50/hr) vs. Pro (2,000/hr) accounts.
- **High-Speed Syncing**: Pro users now receive 5x concurrent upload capacity and reduced batch delays.
- **Category ZIP Export**: Integrated the `archiver` library to allow Pro users to download entire categories as compressed archives.

### 📧 Automated Approval Flow
- **Signed Grant Links**: Created a secure, signed JWT approval loop via email (`ADMIN_EMAIL`) for instant membership upgrades.
- **Permanent SMTP Support**: Migrated to App Password-based email transport for 100% notification reliability.

### 📦 Bulk Management
- **Post-Upload Reporting**: Implemented a comprehensive logging system for bulk Markdown uploads.
- **Downloadable Session Logs**: Users can now export `.txt` reports of their bulk sync sessions to troubleshoot individual file failures.

---

## 📅 March 27, 2026

### ⚡ Database Performance Audit
- **High-Performance Indexing**: Optimized `Note`, `User`, and `Category` models with strategic compound indexes for sub-millisecond query execution.
- **ESR Pattern (Equality, Sort, Range)**: Refactored controller logic to utilize index-friendly query patterns.
- **Scale Protection**: Increased JSON payload limits to `10mb` and set IP-based burst rate limiting to 1,000 requests per 5 minutes.

### 🌑 Theme Resilience
- **Flash-Free Dark Mode**: Injected background colors directly into the root HTML and forced native `color-scheme: dark` to prevent white-flash on page load.
- **Stale-While-Revalidate Auth**: Priority-loading for cached users in `localStorage` with a 5-second failure timeout to prevent infinite spinners.

---
_Log maintained by Antigravity AI._
