# Marks Portal

A clean, minimal web application for university students to view their assignment and quiz marks. Built with Vite + React on the frontend and Google Apps Script as the backend API.

---

## Features

- 🔐 Google OAuth login — university emails only (`@cfd.nu.edu.pk`)
- 📊 Displays assignment (A1, A2, A3) and quiz (Q1, Q2) marks
- 🔒 Double validation: frontend domain check + backend email lookup
- 📱 Fully responsive layout
- ⚡ Fast — no heavy dependencies, pure CSS
- 🚀 Deployable to GitHub Pages for free

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | Vite + React 18, Pure CSS         |
| Auth      | Google Identity Services (GIS)    |
| Backend   | Google Apps Script (Web App)      |
| Data      | Google Sheets                     |
| Hosting   | GitHub Pages                      |

---

## Project Structure

```
marks-portal/
├── backend/
│   └── Code.gs              ← Google Apps Script code
│
├── src/
│   ├── pages/
│   │   ├── Login.jsx        ← Login screen
│   │   ├── Login.css
│   │   ├── Dashboard.jsx    ← Marks dashboard
│   │   └── Dashboard.css
│   │
│   ├── components/
│   │   ├── Header.jsx       ← Top bar with student info
│   │   ├── Header.css
│   │   ├── MarksTable.jsx   ← Marks card grid
│   │   └── MarksTable.css
│   │
│   ├── services/
│   │   └── api.js           ← fetch wrapper + domain validator
│   │
│   ├── App.jsx              ← Root component / router
│   ├── main.jsx             ← React entry point
│   └── index.css            ← Global CSS variables & reset
│
├── index.html
├── vite.config.js
├── package.json
├── .env.example
└── README.md
```

---

## Setup Guide

### Step 1 — Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet.
2. Rename the first sheet tab to **`Marks`** (exact spelling).
3. Add the following headers in Row 1:

   | A     | B    | C       | D  | E  | F  | G  | H  |
   |-------|------|---------|----|----|----|----|-----|
   | Email | Name | Roll No | A1 | A2 | A3 | Q1 | Q2 |

4. Fill in student data starting from Row 2. Example:

   | student@cfd.nu.edu.pk | Ali Raza | 21-CFD-001 | 8 | 9 | 7 | 10 | 8 |

5. Keep the spreadsheet open — you'll link it to Apps Script next.

---

### Step 2 — Google Apps Script (Backend API)

1. In your Google Sheet, click **Extensions → Apps Script**.
2. Delete any existing code in the editor.
3. Copy the entire contents of `backend/Code.gs` and paste it in.
4. Click **Save** (💾).
5. Click **Deploy → New deployment**.
6. Set the following:
   - **Type**: Web app
   - **Description**: Marks Portal API
   - **Execute as**: Me
   - **Who has access**: Anyone
7. Click **Deploy** and **Authorize** when prompted.
8. Copy the **Web app URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```
9. Paste this URL into `src/services/api.js` as the value of `APPS_SCRIPT_URL`.

> ⚠️ Every time you edit `Code.gs`, you must create a **new deployment** (not update the existing one) for changes to take effect.

---

### Step 3 — Google OAuth Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or use an existing one).
3. Navigate to **APIs & Services → Credentials**.
4. Click **Create Credentials → OAuth 2.0 Client ID**.
5. Choose **Web application**.
6. Under **Authorised JavaScript origins**, add:
   - `http://localhost:5173` (for local dev)
   - `https://YOUR_GITHUB_USERNAME.github.io` (for production)
7. Click **Create** and copy the **Client ID**.
8. Paste it into `src/pages/Login.jsx` as the value of `GOOGLE_CLIENT_ID`.

---

### Step 4 — Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/marks-portal.git
cd marks-portal

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

### Step 5 — Deploy to GitHub Pages

1. In `vite.config.js`, set `base` to your GitHub repo name:
   ```js
   base: '/marks-portal/',
   ```

2. Install the deploy helper:
   ```bash
   npm install --save-dev gh-pages
   ```

3. Add to `package.json` scripts:
   ```json
   "deploy": "npm run build && gh-pages -d dist"
   ```

4. Run:
   ```bash
   npm run deploy
   ```

5. Go to your repo **Settings → Pages** and make sure the source is set to the `gh-pages` branch.

Your app will be live at `https://YOUR_USERNAME.github.io/marks-portal/`.

---

## Data Flow

```
Student                Frontend               Apps Script          Google Sheet
   │                      │                        │                    │
   │── Sign in Google ──▶ │                        │                    │
   │                      │── Decode JWT           │                    │
   │                      │── Check domain         │                    │
   │                      │── GET ?email=... ─────▶│                    │
   │                      │                        │── Lookup email ───▶│
   │                      │                        │◀── Student row ────│
   │                      │◀── JSON response ──────│                    │
   │◀── Dashboard shown ──│                        │                    │
```

---

## API Response Format

**Success:**
```json
{
  "name": "Ali Raza",
  "rollNo": "21-CFD-001",
  "assignments": { "A1": 8, "A2": 9, "A3": 7 },
  "quizzes": { "Q1": 10, "Q2": 8 }
}
```

**Error:**
```json
{ "error": "Access Denied: Your email is not registered." }
```

---

## Screenshots

> _Add screenshots here after deployment._

| Login Page | Dashboard |
|------------|-----------|
| ![Login](screenshots/login.png) | ![Dashboard](screenshots/dashboard.png) |

---

## Customisation

| What to change          | Where                                      |
|-------------------------|--------------------------------------------|
| Allowed email domain    | `src/services/api.js` → `ALLOWED_DOMAIN`   |
| Max marks per item      | `src/pages/Dashboard.jsx` → `ASSIGNMENT_MAX` / `QUIZ_MAX` |
| Sheet name              | `backend/Code.gs` → `SHEET_NAME`           |
| Add more columns        | Update `COL` map in `Code.gs` + `MarksTable` usage in Dashboard |
| Colour theme            | `src/index.css` → CSS variables            |

---

## Security Notes

- The frontend performs a domain check as a first pass, but this is **not a security boundary** — it's UX only.
- The Apps Script backend performs the authoritative email lookup. No student can see another student's data because the API only returns the row matching the authenticated email.
- Never expose your full sheet data via a public endpoint.
- The Google OAuth JWT is verified by Google's servers; the frontend only decodes the payload for display purposes.

---

## Future Improvements

- [ ] Add semester/course selector for multi-course support
- [ ] Add a grade scale indicator (e.g., letter grade)
- [ ] Admin panel for faculty to update marks directly
- [ ] Email notifications when marks are updated
- [ ] Progressive Web App (PWA) support for mobile
- [ ] Export marks as PDF

---

## License

MIT — free to use, modify, and distribute for educational purposes.
