# Project Optimization & Infrastructure Log - 2026-03-27

## 1. High-Performance MongoDB Indexing Strategy
To ensure the application remains lightning-fast as the note collection grows into the thousands, a complete audit and overhaul of the MongoDB indexing strategy was performed.

### Note Model Optimizations (`note.model.js`)
**Why:** Queries like "Find all my notes in Category X" or "Search public notes by Tag Y" were performing full collection scans or in-memory sorts, both of which are high-cost operations.

**New Indexes Added:**
```javascript
{ user: 1, createdAt: -1 }      // Recent Notes feed
{ user: 1, updatedAt: -1 }      // Recently edited content
{ user: 1, category: 1, title: 1 } // Category browsing + Alphabetical sort
{ isPrivate: 1, createdAt: -1 } // Global public feed
{ category: 1, isPrivate: 1, title: 1 } // Public category detail
{ tags: 1, isPrivate: 1, createdAt: -1 } // Tag Search page
{ user: 1, isPrivate: 1, createdAt: -1 } // Personal privacy views
```

### User Model & Social Relationships (`user.model.js`)
**Why:** Relationship cleanup and registration security were creating "expensive" queries during write operations.

**New Indexes Added:**
```javascript
{ registrationIp: 1, createdAt: -1 } // IP rate limiter
{ followers: 1 }                     // Relationship cleanup
{ following: 1 }                     // Relationship cleanup
{ username: 1 }                      // Auth & profile lookups
```

### Category Model & Organization (`category.model.js`)
**New Indexes Added:**
```javascript
{ user: 1, name: 1 }                          // Uniqueness/lookup check
{ isPrivate: 1, name: 1 }                     // Global category list
{ categoryType: 1, isPrivate: 1, name: 1 }    // Public type-based list
{ categoryType: 1, user: 1, name: 1 }         // Private type-based list
```

---

## 2. Index-Friendly Query Refactoring (Controllers)
Creating indexes is only half the battle; the application code must use patterns that the database can actually leverage.

**The "Equality, Sort, Range" (ESR) Pattern Implementation:**
- **What Changed:** Replaced all occurrences of `isPrivate: { $ne: true }` with `isPrivate: false`.
- **Involved Files:** `note.controller.js`, `global.controller.js`, `category.controller.js`.
- **Result:** Sub-millisecond execution for most common queries.

---

## 3. Bulk Upload & Infrastructure Expansion
The application has been prepared to handle bulk uploads of over 500 individual Markdown (.md) files in a single session.

### IP/Route Level Rate Limiting (`note.routes.js`)
- **Limiter:** `noteLimiter`
- **Previous Limit:** `max: 20` (per 5 mins)
- **New Limit:** `max: 1000` (per 5 mins)
- **Rationale:** Prevents legitimate bulk sync from triggering a security block.

### Application Logic Rate Limiting (`note.controller.js`)
- **Previous Block:** Mandatory 5-second wait per note.
- **Current Strategy:** Removed per-note cooldown.
- **New Barrier:** Hourly limit of **2,000 notes per user**.
- **Rationale:** Allows for high-burst activity while maintaining a long-term safety net.

### Payload & Memory Handling (`app.js`)
- **JSON & URL-Encoded Limit:** Increased to `10mb`.
- **Rationale:** Accommodates complex Markdown content and bulk metadata.

---

## 4. Frontend UX & Theme Resilience

### Flash-Free Dark Theme
**Files Modified:** `frontend/index.html`, `frontend/src/index.css`
- **Inline CSS Injection**: Added `background-color: #10110f;` directly to the `html` and `body` tags in the root HTML.
- **Native Dark Mode**: Forced `color-scheme: dark` in the root CSS to ensure browser scrollbars and native inputs match the dark theme immediately.

### Instant UI & Auth Resiliency
**Files Modified:** `frontend/src/context/AuthContext.jsx`
- **Stale-While-Revalidate**: The application now prioritizes the cached user in `localStorage` for the initial render. 
- **Dead Backend Handling**: Added a strict 5-second timeout to the authentication check to prevent "infinite loading" on server failure.

### Styled Component Guards
**Files Modified:** `frontend/src/pages/Profile.jsx`
- **Enhanced UI Guards**: Replaced plain text loading/error strings with centered, glassmorphic UI components.
- **Retry Mechanism**: Integrated a reload button into the error state for easier recovery from intermittent connection failures.

---

## 5. Maintenance: How to Adjust Performance Settings

### Changing Upload Limits
1.  **Burst Limit (IP-based)**: 
    Edit `backend/routes/note.routes.js`:
    ```javascript
    max: 1000 // Change this number
    ```
2.  **Hourly User Cap**:
    Edit `backend/controllers/note.controller.js`:
    ```javascript
    if (notesLastHour >= 2000) // Change this number
    ```

### Scaling the Database
To index a new field (e.g., searching by Bio):
Edit `backend/models/user.model.js`:
```javascript
userSchema.index({ bio: 1 });
```

---

# Pro Membership & Premium Infrastructure Log - 2026-04-01

## 1. Multi-Tiered "Pro Account" System
Implemented a scalable, two-tier user system (Normal vs. Pro) to provide tiered performance and advanced features.

### Tiered Rate Limiting (`note.controller.js`)
- **Normal Users**: 50 notes per hour.
- **Pro Users**: 2,000 notes per hour.
- **Rationale**: Ensures platform stability for millions of concurrent users while rewarding premium contributors with high-burst capacity.

### High-Speed Upload Queue (`useMarkdownUploadQueue.js`)
The bulk upload engine now identifies user status and adjusts performance dynamically:
- **Normal Users**: 1 concurrent upload | 5s delay between batches.
- **Pro Users**: 5 concurrent uploads | 3s delay between batches.

---

## 2. Advanced Premium Features

### Full Category ZIP Export
**Files Modified:** `note.controller.js`, `note.routes.js`, `CategoryHeader.jsx`
- **Backend**: Integrated the `archiver` library to stream high-compression ZIP archives directly from the database to the user.
- **Frontend**: Added a "ZIP Archive" action button to the category header.
- **Restriction**: Restricted to Pro accounts with a dedicated upgrade prompt for normal users.

### Managed Bulk Tagging
- **BulkTagModal.jsx**: Updated the bulk tagging interface to enforce Pro restrictions, ensuring heavy metadata operations are reserved for premium tiers.

---

## 3. Automated Pro Request & Admin Approval Flow
Replaced manual database updates with a robust, automated request and secure approval system.

### The Request Flow (`Upgrade.jsx`)
- Created a dedicated **Pro Access Request** page where users can submit their intent for an upgrade.
- Implemented a "Transmit Request" logic that beams user data directly to the administrator.

### Secure Email Approval Loop (`auth.controller.js`)
- **Admin Notification**: Sends a high-aesthetic email to `ADMIN_EMAIL` containing the user's reason and a secure **"GRANT ACCESS"** link.
- **Security**: Approval links are protected by a **24-hour signed JWT token** to prevent unauthorized access.
- **Confirmation**: Upon approval, the user automatically receives a "Welcome to Pro" email, and their privileges are granted instantly.

---

## 4. Visual Branding & Pro UI
Enhanced the application's aesthetic to clearly distinguish premium accounts and features.

### Global "PRO" Badge
**Files Modified:** `Author.jsx`, `ProfileHeader.jsx`, `SideNavbar.jsx`
- Designed a premium gold/amber gradient badge with a subtle inner glow.
- Integrated the badge across all profile picture components, ensuring it is visible in Sidebar, Profile views, and Note authors.

### Premium Upgrade Modal
**File Modified:** `ProUpgradeModal.jsx`
- Developed a high-conversion "Unlock Pro" modal featuring glassmorphic effects, animated icons (lucide-react), and clear value propositions.

---

## 5. Infrastructure Resilience

### Gmail App Password Support (`sendEmail.js`)
- **Why**: Standard OAuth2 "Testing" tokens expire every 7 days, causing email failures.
- **Fix**: Added support for `EMAIL_APP_PASS` in the transport layer, allowing for a permanent, secure connection to Gmail SMTP.

### Remote Approval URL Mapping
- **Fix**: Updated the backend approval link generation to use a `BACKEND_URL` fallback. This allows administrators to grant access from their mobile devices even if the dev server is running on `localhost`.

---

## 6. Post-Upload Reporting System (Bulk Uploads)
Implemented a comprehensive logging and reporting system for the bulk Markdown upload process.

### Real-time Result Tracking (`useMarkdownUploadQueue.js`)
- **What Changed**: The upload engine now collects the outcome of every individual file attempt within a session.
- **Data Collected**: Filename, status (success/error), error message, and timestamp.

### Upload Summary UI (`UploadQueueDisplay.jsx`)
- **New Feature**: Added a results summary dashboard that appears automatically when a queue completes.
- **Insights**: Displays total count of successful vs. failed uploads at a glance.

### Detailed Log Generation (`generateUploadLog.js`)
- **New Utility**: Created a professional log generator that compiles session data into a human-readable format.
- **Downloadable Reports**: Users can now download a `.txt` log file of their bulk session, allowing them to troubleshoot specific failures (e.g., "Duplicate Title") offline.

