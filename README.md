# Re-Docs — README

> Quick start (clone and run)

```bash
# Clone repository (replace with your repository URL or Google Drive/GCS path)
git clone https://github.com/your-username/your-repo.git
cd your-repo

# Backend
cd backend
cp .env.example .env    # populate env values
npm install
npm run dev

# Frontend (in a new terminal)
cd frontend
cp .env.example .env    # populate env values
npm install
npm run dev
```

---
# Deployed version

>https://re-docs-pi.vercel.app/

Note: this is deployed on free tair so the backend needs a little bit of time to wake up after being idle for a while. 

> **Session persistence warning:** The free-tier service will restart or hibernate the backend frequently. If your
> `DATABASE_URL` targets an ephemeral/local Mongo instance or any data store that is wiped on restart, all
> login sessions stored via `connect-mongo` will vanish and users will have to sign in again. Always use a
> hosted/persistent database (Atlas, mLab, etc.) or switch to a stateless token scheme to avoid this.

---

# Overview

A full-stack MERN (MongoDB, Express, React, Node) knowledge and note management platform. Key features:

* .md supported text format
* Session-based authentication (local + Google OAuth).
* User-owned CategoryTypes → Categories → Notes hierarchy with public/private visibility.
* Notes with Markdown support, tags, likes, and export (MD / ZIP).
* Social features: follow/unfollow, public profiles.
* File uploads using Multer + Cloudinary.
* Security: Joi validation, request sanitization, rate-limiting, helmet.

This README contains the complete project tree, environment guidance, deployment notes, and multiple Mermaid.js diagrams describing the request and data flows.

---
# Prerequisites

* Node.js (LTS recommended, v18+)
* npm (or yarn)
* MongoDB instance (Atlas recommended for production)
* Cloudinary account (for image uploads) or other storage
* (Optional) Google OAuth client credentials for social login

---

# Environment variables (recommended structure)

Create `.env` files for both `backend` and `frontend` according to the templates below.

## Backend `.env` (example)

```env
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=cloudinary_dummy_secret_key_123
CLOUDINARY_CLOUD_NAME=demo-cloud
CLOUDINARY_URL=cloudinary://123456789012345:cloudinary_dummy_secret_key_123@demo-cloud

DATABASE_URL=mongodb+srv://demoUser:demoPassword@cluster0.mongodb.net/demoDB?retryWrites=true&w=majority
# ⚠️ When deploying (Render free tier, Heroku, etc.) this must point to a **persistent** database.
# Ephemeral or in‑container MongoDB instances are cleared on restart and will invalidate all sessions,
# forcing users to re‑login every time the server process is recycled.

FRONTEND_URL=http://localhost:5173

NODE_ENV=development
OPENAI_API_KEY=sk-demo_openai_key_1234567890
SESSION_SECRET=your_long_secret_here  # must be fixed across restarts; changing it invalidates existing sessions

EMAIL_USER=demo_user@example.com
EMAIL_FROM=demo_user@example.com

GOOGLE_CLIENT_ID=12345678901234567890123456789012
GOOGLE_CLIENT_SECRET=google_dummy_client_secret_1234567890
GOOGLE_REFRESH_TOKEN=google_dummy_refresh_token_1234567890
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
```

## Frontend `.env` (example)

```env
VITE_API_BASE_URL=http://localhost:5000/
```

---

# Run locally — step-by-step

1. Start the database (local Mongo or Atlas connection available).
2. Backend: `cd backend` → `npm install` → copy `.env` → `npm run dev`.
3. Frontend: `cd frontend` → `npm install` → copy `.env` → `npm run dev`.
4. Open the frontend URL (Vite default `http://localhost:5173`) and register a user.

If using Docker or containers, consider writing a `docker-compose.yml` that brings up `backend`, `frontend` (or a static build), and `mongo` services.

---

# Scripts (NPM)

**Frontend** (in `frontend/package.json`)

* `npm run dev` — Start Vite dev server
* `npm run build` — Build production assets
* `npm run preview` — Preview built assets
* `npm run lint` — ESLint

**Backend** (in `backend/package.json`)

* `npm run dev` — Start server with nodemon
* `npm start` — Start server (production)

---

# Complete directory tree

```
.gitignore
backend
├── .env
├── app.js
├── config
│   ├── passport.config.js
│   ├── passport.js
├── controllers
│   ├── auth.controller.js
│   ├── category.controller.js
│   ├── categoryType.controller.js
│   ├── global.controller.js
│   ├── note.controller.js
│   ├── profile.controller.js
├── devJunks
│   ├── .sh
│   ├── quicktag.js
├── middlewares
│   ├── errorHandler.middleware.js
│   ├── isAuthenticated.middleware.js
│   ├── sanitizeInput.middleware.js
│   ├── validate.middleware.js
├── models
│   ├── category.model.js
│   ├── categoryType.model.js
│   ├── note.model.js
│   ├── user.model.js
├── Readme.md
├── routes
│   ├── auth.routes.js
│   ├── category.routes.js
│   ├── categoryType.routes.js
│   ├── global.routes.js
│   ├── note.routes.js
│   ├── profile.routes.js
├── scripts
│   ├── linkCategoriesToCategoryTypes.js
│   ├── linkCategoriesToTypes.js
│   ├── seedCategoryTypes.js
│   ├── seedData.js
├── server.js
├── utils
│   ├── bannedWords.util.js
│   ├── cloudinary.util.js
│   ├── generateOTP.js
│   ├── multer.util.js
│   ├── sendEmail.js
├── validators
│   ├── auth.validator.js
├── package.json

frontend
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── postcss.config.mjs
├── public
│   ├── assets
│   │   ├── logo.png
│   │   ├── user-svgrepo-com.svg
│   ├── vite.svg
├── src
│   ├── api
│   │   ├── axios.js
│   │   ├── axiosInstance.js
│   ├── app
│   │   ├── App.jsx
│   │   ├── main.jsx
│   ├── assets
│   │   ├── images
│   │   │   ├── 1.jpg
│   │   │   ├── edit.png
│   │   ├── styles
│   │   │   ├── styles.css
│   │   ├── svg
│   │   │   ├── TrashIcon.jsx
│   ├── components
│   │   ├── advanced
│   │   │   ├── LiquidEther.jsx
│   │   │   ├── RotatingText.jsx
│   │   ├── common
│   │   │   ├── Author.jsx
│   │   │   ├── LinkifyText.jsx
│   │   │   ├── RotatingKeepIt.jsx
│   │   │   ├── ScrollToTop.jsx
│   │   │   ├── TagInput.jsx
│   │   │   ├── VariableProximity.jsx
│   │   ├── layout
│   │   │   ├── Footer.jsx
│   │   │   ├── index.js
│   │   │   ├── SideNavbar.jsx
│   │   │   ├── Waiting.jsx
│   │   ├── ui
│   │   │   ├── buttons
│   │   │   │   ├── ButtonType3.jsx
│   │   │   │   ├── DottedButton.jsx
│   │   │   │   ├── DottedButton2.jsx
│   │   │   │   ├── index.js
│   │   │   ├── ConfirmPopUp.jsx
│   │   │   ├── index.js
│   │   │   ├── ListContainer.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── SimpleModal.jsx
│   ├── context
│   │   ├── AuthContext.jsx
│   ├── features
│   │   ├── category
│   │   │   ├── CategoryHeader.jsx
│   │   │   ├── CategoryNotesList.jsx
│   │   │   ├── DownloadProgress.jsx
│   │   │   ├── MarkdownUploadBox.jsx
│   │   │   ├── UploadQueueDisplay.jsx
│   │   ├── home
│   │   │   ├── AppStats.jsx
│   │   │   ├── ColdStartBanner.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── index.js
│   │   │   ├── Loading.jsx
│   │   │   ├── UserBox.jsx
│   │   ├── notes
│   │   │   ├── AccessDenied.jsx
│   │   │   ├── index.js
│   │   │   ├── MathContent.jsx
│   │   │   ├── NoteContent.jsx
│   │   │   ├── NoteFooter.jsx
│   │   │   ├── NoteHeader.jsx
│   │   │   ├── NoteNavigation.jsx
│   │   ├── profile
│   │   │   ├── CategoryList.jsx
│   │   │   ├── CategoryStatsModal.jsx
│   │   │   ├── DeleteAccountModal.jsx
│   │   │   ├── DeleteAccountSection.jsx
│   │   │   ├── index.js
│   │   │   ├── NoteModal.jsx
│   │   │   ├── ProfileForm.jsx
│   │   │   ├── ProfileHeader.jsx
│   │   │   ├── PublicCategoryList.jsx
│   │   │   ├── PublicProfileHeader.jsx
│   │   │   ├── UserListModal.jsx
│   │   ├── hooks
│   │   │   ├── useDebouncedSearch.js
│   │   │   ├── useDragAndDrop.js
│   │   │   ├── useMarkdownUploadQueue.js
│   ├── index.css
│   ├── lib
│   │   ├── utils.js
│   ├── pages
│   │   ├── About.jsx
│   │   ├── AllCategories.jsx
│   │   ├── AllNotes.jsx
│   │   ├── AllTags.jsx
│   │   ├── AllUsers.jsx
│   │   ├── Category.jsx
│   │   ├── CategoryType.jsx
│   │   ├── CreateNote.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Logout.jsx
│   │   ├── MyCategories.jsx
│   │   ├── MyCategoryTypes.jsx
│   │   ├── MyNotes.jsx
│   │   ├── MyTags.jsx
│   │   ├── Note.jsx
│   │   ├── Profile.jsx
│   │   ├── Register.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── TagNotes.jsx
│   ├── utils
│   │   ├── exportCategoryAsZip.js
│   │   ├── exportNoteAsMd.js
│   │   ├── handleProfileImage.js
│   │   ├── imageUtils.js
│   │   ├── noteCache.js
├── tailwind.config.mjs
├── vite.config.mjs
project-tree.txt

```

---

# Architecture & flows (Mermaid.js)

Below are several Mermaid diagrams you can embed into `docs/` or use in GitHub's mermaid-enabled markdown viewer. They describe the high-level data model and request flows.

## Entity relationship (ER) diagram

```mermaid
erDiagram
    USER ||--o{ CATEGORYTYPE : "owns"
    USER ||--o{ CATEGORY : "owns"
    USER ||--o{ NOTE : "owns"
    CATEGORYTYPE ||--o{ CATEGORY : "contains"
    CATEGORY ||--o{ NOTE : "contains"
    NOTE }o--|| USER : "liked_by"
    NOTE {
        string title
        string content
        boolean isPrivate
        date createdAt
        date updatedAt
    }
    CATEGORY {
        string name
        boolean isPrivate
    }
    CATEGORYTYPE {
        string name
    }
    USER {
        string username
        string email
    }
```

## High-level request → controller → model flow

```mermaid
flowchart LR
  A["Client - Browser"] -->|XHR/Fetch| B["Frontend Axios Instance"]
  B -->|POST /api/auth/login| C["Express Route - auth.routes"]
  C --> D["auth.controller.login"]
  D --> E["User Model / Passport Local Strategy"]
  E --> F[(MongoDB)]
  F -->|session created| G["connect-mongo persisted session"]
  G --> H["Client receives cookie"]

  subgraph Backend
    C
    D
    E
    F
  end

```

## Note create flow (sequence)

```mermaid
sequenceDiagram
  participant U as User (browser)
  participant F as Frontend (Axios)
  participant R as Express Router
  participant C as Note Controller
  participant M as Note Model
  participant DB as MongoDB

  U->>F: POST /api/notes {note payload, token/cookie}
  F->>R: Send request
  R->>C: validateBody -> isLoggedIn
  C->>M: create Note doc, attach user
  M->>DB: insert note
  DB-->>M: inserted note object
  M-->>C: note saved
  C-->>F: 201 Created + note
  F-->>U: UI updates
```

## Frontend component/page navigation flow

```mermaid
flowchart TD
  Home[Home Page] --> CategoryList
  CategoryList --> CategoryPage
  CategoryPage --> NoteView
  NoteView --> EditNoteModal
  ProfilePage --> PublicProfile
  Header -->|Auth| LoginModal
  Header -->|User menu| ProfilePage
```

---

# Deployment checklist

1. Build frontend: `cd frontend && npm run build`.
2. Host static build in CDN / static host (Netlify, Vercel, or serve via backend Express static middleware).
3. Configure backend environment variables for production.
4. Ensure `SESSION_SECRET` and OAuth secrets are strong.
5. Set secure cookie flags and enable HTTPS.
6. Enable CORS with production origins only.
7. Configure Cloudinary or S3 for file uploads in production.
8. Add monitoring/logging (Sentry, LogDNA) and backups for MongoDB.

---

# Technologies

**Backend:** Node.js, Express, Mongoose, MongoDB, Passport (local + Google), Joi, Multer, Cloudinary, Nodemailer

**Frontend:** React 19, Vite, Tailwind CSS, React Router, React Markdown, KaTeX, Framer Motion

**Dev & Tools:** ESLint, depcheck, Prettier (optional), nodemon, GitHub Actions (recommended)

---

# Contributing

* Fork the repo, create a feature branch, run lint/tests locally, open a PR against `main`.
* Use conventional commits or clear PR descriptions.

---

# License

Choose an open-source license, e.g. MIT. Add a `LICENSE` file.

---

# Images / placeholders

Replace the following images in the repo or the README with your images. These are just placeholders and paths you can use.

## Home page
![Home page](frontend/public/assets/home.png)

## Feature: Markdown
![Feature: Markdown](frontend/public/assets/md.png)

## Profile screenshot
![Profile screenshot](frontend/public/assets/profile.png)

## Mobile view
![Mobile view](frontend/public/assets/mobile.png)



