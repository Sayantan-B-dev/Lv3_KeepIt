# Roadmap & Future Enhancements

This document outlines the planned features and the technical approach for implementing them.

## 1. Complete Offline Efficiency (PWA Architecture)
**Goal:** Make the website feel like a native app that can be "installed" and works without an internet connection.

### Technical Approach:
- **Service Workers:** Integrate `vite-plugin-pwa` in the frontend build process. This will enable asset caching (JS, CSS, Images) so the shell loads instantly without a network.
- **Background Sync:** Use the Service Worker API to queue note edits or creations while offline and sync them automatically when the connection is restored.
- **Manifest File:** Configure a `manifest.webmanifest` to allow "Add to Home Screen" on mobile and desktop.

---

## 2. Local Storage & Offline Viewing
**Goal:** Allow users (especially logged-in ones) to download categories or notes for persistent offline access.

### Technical Approach:
- **IndexedDB (via Dexie.js):** Browser `localStorage` is too small (5MB). We will use `IndexedDB` to store thousands of markdown notes and their metadata locally.
- **"Download Category" Feature:** 
    - A dedicated button on Category pages that fetches all notes in that category and saves them into the local `IndexedDB`.
    - **Expiration Logic:** Add a `downloadedAt` timestamp to local records and a background task to clear expired content after the "limited time" (e.g., 7 days).
- **Local Files View:**
    - Create a new route `/local-vault`.
    - This page will query the `IndexedDB` directly, bypassing the backend entirely. It will show all content that has been "pinned" for offline use.

---

## 3. Mermaid.js Diagram Support
**Goal:** Support complex diagrams (flowcharts, sequence diagrams, gantt charts) inside the Markdown content.

### Technical Approach:
- **Integration:** Add `mermaid` and a custom renderer component (e.g., `MermaidRenderer.jsx`).
- **Markdown Parsing:** Update the existing Markdown viewer (likely `react-markdown`) to detect code blocks with the `mermaid` language tag and pass them to the renderer.
- **Performance:** Use dynamic imports for the Mermaid library to ensure it doesn't slow down the initial page load for notes that don't have diagrams.

---

## 4. Enhanced UI & Feedback
**Goal:** Polished, non-intrusive notifications.

### Technical Approach:
- **Custom Toast System:**
    - Shift from default `react-toastify` to a custom-styled version or `react-hot-toast`.
    - **Style:** Use your existing "Glassmorphism" theme (blur + semi-transparent borders) for all toast notifications to match the site's premium look.

---

## 5. Summary Tracking
- [ ] **PWA Shell:** Installable app with asset caching.
- [ ] **IndexedDB Engine:** Local vault for notes/categories.
- [ ] **Note Downloader:** "Save for Offline" functionality for logged-in users.
- [ ] **Mermaid.js:** Diagram rendering in markdown.
- [ ] **Local Vault Page:** Specialized offline-only view.
- [ ] **Premium Toasts:** Glassmorphic notification system.
- [ ] **FIX EMAIL BUG**