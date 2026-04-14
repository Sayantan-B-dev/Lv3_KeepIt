# Re-Docs: The Ultimate Second Brain

> A full-stack MERN note management platform with rich editing, social discovery, and premium features.

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/your-username/re-docs.git
cd re-docs

# Backend Setup
cd backend
cp .env.example .env    # populate env values
npm install
npm run dev

# Frontend Setup (in a new terminal)
cd frontend
cp .env.example .env    # populate env values
npm install
npm run dev
```

## 🌐 Live Demo

**Frontend**: https://re-docs-pi.vercel.app/

> ⚠️ **Note**: Backend deployed on free tier (Render). May take 30-60 seconds to wake up after idle periods.

---

## 📋 Overview

Re-Docs is a modern, feature-rich knowledge management platform built with MERN stack. It combines professional note-taking with social discovery and premium collaboration features.

### ✨ Core Features

**Content Creation & Organization**
- 📝 **Live Markdown Preview**: Real-time split-view editing with instant visualization
- 📊 **Mermaid.js Support**: Render flowcharts, sequence diagrams, and class diagrams directly in notes
- 🧮 **KaTeX Math Rendering**: Beautiful LaTeX equations and formulas
- 🏷️ **Smart Tagging**: Unlimited tags with full-text search
- 📂 **Multi-level Organization**: CategoryTypes → Categories → Notes hierarchy
- 💾 **Rich Exports**: Download as Markdown (.md) or bulk export as ZIP archives

**Authentication & Security**
- 🔐 **Session-based Auth**: Secure cookie-based sessions with MongoDB persistence
- 🔑 **Google OAuth**: One-click sign-in via Google
- 🛡️ **Advanced Security**: Joi validation, input sanitization, rate-limiting, helmet headers
- 🚫 **Access Control**: Public/private categories and notes with granular permissions
- ⏱️ **Guest Preview Mode**: 20-second preview for unauthenticated users before redirect

**Social & Discovery**
- 👥 **Follow System**: Follow creators and stay updated with their notes
- 🌍 **Live Notes Feed**: Discover public notes from the community
- 💬 **Collaborative Sharing**: Share categories and collaborate with followers
- 🔍 **User Discovery**: Browse all users and their public profiles

**Premium Features (Pro Membership)**
- 💎 **Lifetime Pro Access**: One-time payment via Razorpay
- 🚀 **Higher Rate Limits**: 2,000 uploads/hour (vs 50 for free users)
- 📦 **Category ZIP Export**: Batch download entire categories
- ⚡ **Priority Support**: Dedicated support for Pro members
- 🎯 **Advanced Analytics**: Usage statistics and insights (coming soon)

**Media & Integration**
- 🖼️ **Cover Image Support**: Customize profiles, categories, and notes with images
- ☁️ **Cloudinary Integration**: Seamless image uploads and optimization
- 📧 **Email Notifications**: Smart notifications via Nodemailer + Google OAuth2
- 📨 **Admin Approval Flow**: Signed JWT-based email approval links for memberships

**Performance & Reliability**
- 🔌 **Backend Health Monitor**: Real-time connectivity status with glassmorphic UI
- 🔄 **Cipher Effect**: Animated "encrypting" text during backend cold starts
- 📊 **Live Metrics**: Dashboard showing total notes, tags, categories, users
- 💾 **Persistent Stats**: Last-known application state for instant UI rendering

This README contains the complete project tree, environment guidance, deployment notes, and multiple Mermaid.js diagrams describing the request and data flows.

---
## 📋 Prerequisites

- **Node.js**: v18+ (LTS recommended)
- **npm** or **yarn**
- **MongoDB**: Atlas (production) or local instance
- **Cloudinary**: Account for image storage and optimization
- **Google OAuth**: Client credentials for social login
- **Razorpay**: Account for payment processing (Pro membership)
- **Email Service**: Gmail App Password or Google OAuth2 refresh token

---

## 🔐 Environment Variables

Create `.env` files in both `backend/` and `frontend/` directories. Use the `.env.example` files as templates.

### Backend `.env`

```env
# --- Application URLs ---
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000  # For email approval links

# --- Security & Database ---
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
SESSION_SECRET=your_very_long_random_session_secret_string
NODE_ENV=development

# --- Email Configuration (Nodemailer) ---
EMAIL_USER=your_email@gmail.com
EMAIL_FROM=your_email@gmail.com
ADMIN_EMAIL=admin_email@gmail.com

# Option 1: Google App Password (Recommended)
EMAIL_APP_PASS=your_16_character_google_app_password

# Option 2: Google OAuth2 (Alternative)
# GOOGLE_REFRESH_TOKEN=your_oauth_refresh_token

# --- Google OAuth (Social Login) ---
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# --- Cloudinary (Image Storage) ---
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_URL=cloudinary://key:secret@cloud_name

# --- Payment Processing (Razorpay) ---
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx    # Test key for development
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx   # Test secret for development

# --- Development Only (Optional) ---
# DEV_ID=your_mongodb_user_id          # For dev mode auth bypass
# DEV_PASS=devpassword
# DEV_EMAIL=dev@example.com
```

**⚠️ Critical Notes:**
- **DATABASE_URL**: Must be a persistent database (Atlas, etc.). Free-tier services reset sessions on restart.
- **SESSION_SECRET**: Use a strong, random string. Changing it invalidates all existing sessions.
- **RAZORPAY_KEYS**: Use test keys (`rzp_test_*`) for development, production keys for production.

### Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx  # Same test key as backend
```

---

## 🏃 Running Locally

### Prerequisites
- MongoDB running locally or connect to MongoDB Atlas

### Step-by-Step

1. **Clone and setup**:
   ```bash
   git clone <repo-url>
   cd re-docs
   ```

2. **Backend setup**:
   ```bash
   cd backend
   cp .env.example .env      # Edit with your credentials
   npm install
   npm run dev               # Starts on http://localhost:5000
   ```

3. **Frontend setup** (new terminal):
   ```bash
   cd frontend
   cp .env.example .env      # Edit with VITE_API_BASE_URL
   npm install
   npm run dev               # Starts on http://localhost:5173
   ```

4. **Access the app**:
   - Open http://localhost:5173
   - Register a new account or use Google OAuth
   - Start creating notes!

### Using Docker (Optional)

```bash
docker-compose up -d
```

Make sure `docker-compose.yml` exists with services for MongoDB, backend, and frontend.

---

## 📦 NPM Scripts

### Frontend (`frontend/package.json`)
```json
{
  "scripts": {
    "dev": "vite",                    // Vite dev server (http://localhost:5173)
    "build": "vite build",            // Production build
    "preview": "vite preview",        // Preview production build
    "lint": "eslint ."                // ESLint check
  }
}
```

### Backend (`backend/package.json`)
```json
{
  "scripts": {
    "dev": "nodemon server.js",       // Dev server with auto-reload
    "start": "node server.js"         // Production server
  }
}
```

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

## 📤 Deployment Checklist

### Pre-Deployment
- [ ] Update all environment variables to production values
- [ ] Generate strong SESSION_SECRET
- [ ] Switch Razorpay keys from test to production (`rzp_live_*`)
- [ ] Update FRONTEND_URL and BACKEND_URL to production domains
- [ ] Update GOOGLE_CALLBACK_URL to production domain
- [ ] Configure Cloudinary credentials for production
- [ ] Set NODE_ENV=production

### Build & Deploy
- [ ] `cd frontend && npm run build` (creates `dist/` folder)
- [ ] Deploy frontend static build to Vercel, Netlify, or Render
- [ ] Deploy backend to Render, Railway, or Heroku
- [ ] Ensure HTTPS is enabled on both frontend and backend
- [ ] Set CORS origin to production frontend URL only
- [ ] Enable secure cookie flags (`secure: true`, `sameSite: 'Strict'`)

### Post-Deployment
- [ ] Test login/OAuth flow
- [ ] Test payment flow with test Razorpay account
- [ ] Verify email sending works
- [ ] Monitor backend logs for errors
- [ ] Set up error tracking (Sentry recommended)
- [ ] Configure database backups
- [ ] Monitor uptime and performance

---

## 🛠️ Technology Stack

**Backend**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: Passport.js (Local strategy + Google OAuth2)
- **Email**: Nodemailer (Gmail with OAuth2 or App Password)
- **Payment**: Razorpay API
- **File Storage**: Cloudinary
- **File Upload**: Multer
- **Validation**: Joi validation + input sanitization
- **Security**: Helmet, express-rate-limit, mongo-sanitize

**Frontend**
- **Library**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + PostCSS
- **Routing**: React Router v6
- **Markdown**: Remark + Rehype
- **Math**: KaTeX
- **Diagramming**: Mermaid.js
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **UI Components**: Shadcn UI + Lucide React icons
- **Notifications**: React Toastify

**Dev Tools**
- **Linting**: ESLint
- **Environment**: dotenv
- **Auto-reload**: nodemon
- **Version Control**: Git + GitHub

---

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and test locally
4. Use conventional commits: `feat: add new feature`, `fix: resolve bug`
5. Push to your fork and open a Pull Request against `main`

**Guidelines**:
- Keep commits atomic and well-described
- Test your changes before submitting PR
- Update README if adding new features
- Follow existing code style and conventions

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🎯 Roadmap

### In Progress
- [ ] Local vault (PWA offline support)
- [ ] IndexedDB for offline note storage
- [ ] Advanced search and filtering
- [ ] Collaborative editing
- [ ] Team workspaces

### Planned
- [ ] AI-powered summaries (GPT integration)
- [ ] Voice notes and transcription
- [ ] Mobile apps (iOS/Android)
- [ ] Advanced analytics dashboard
- [ ] Zapier/Make integrations

---

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the [CHANGELOG](latestChanges.md) for recent updates

---

## 🖼️ Screenshots

### Home Page
![Home page](frontend/public/assets/home(2).png)

### Note Editing with Live Markdown Preview
![Markdown editor](frontend/public/assets/md(2).png)

### User Profile
![Profile](frontend/public/assets/profile(2).png)

### Mobile Responsive View
![Mobile](frontend/public/assets/mobile.png)



