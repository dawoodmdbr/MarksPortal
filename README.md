# Marks Portal

A clean, minimal web application for university students to view their assignment and quiz marks. Students log in with their university Google account and instantly see their marks pulled from a Google Sheet.

---

## 📸 Screenshots

---

### Login Page
<p align="center">
    <img width="1919" height="911" alt="image" src="https://github.com/user-attachments/assets/d2be77ab-b071-4025-aab5-70651a4134da" />
</p>

---

### Results
<p align="center">
    <img width="1919" height="915" alt="image" src="https://github.com/user-attachments/assets/0456009a-8881-4ed4-9716-4b62c27ff14d" />
</p>

---

## Features

- 🔐 Google OAuth login — university emails only (`@cfd.nu.edu.pk`)
- 📊 Marks auto-grouped by type — Assignments, Quizzes, Home Tests
- ➕ Fully dynamic — add columns to the sheet, they appear automatically
- 🔒 Double validation — frontend domain check + backend email lookup
- 📱 Fully responsive — works on mobile and desktop
- ⚡ Fast and lightweight — no heavy libraries, pure CSS
- 🚀 Free hosting on GitHub Pages

---

## Tech Stack

| Layer      | Technology                      |
|------------|---------------------------------|
| Frontend   | Vite + React 18                 |
| Styling    | Pure CSS (no frameworks)        |
| Auth       | Google Identity Services (GIS)  |
| Backend    | Google Apps Script (Web App)    |
| Database   | Google Sheets                   |
| Hosting    | GitHub Pages                    |

---

## Project Structure
```
marks-portal/
├── index.html
├── vite.config.js
├── package.json
├── backend/
│   └── Code.gs              ← Google Apps Script backend
└── src/
    ├── main.jsx
    ├── index.css            ← Global CSS variables
    ├── App.jsx              ← Root component
    ├── pages/
    │   ├── Login.jsx        ← Login screen with Google Sign-In
    │   ├── Login.css
    │   ├── Dashboard.jsx    ← Marks dashboard
    │   └── Dashboard.css
    ├── components/
    │   ├── Header.jsx       ← Top bar with student info + logout
    │   ├── Header.css
    │   ├── MarksTable.jsx   ← Dynamic marks card grid
    │   └── MarksTable.css
    └── services/
        └── api.js           ← API calls + email validation
```

---

## Google Sheet Setup

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet
2. Rename the first sheet tab to **`Marks`** (exact spelling, capital M)
3. Set up your headers in Row 1:

| Email | Name | Roll no | A1 | A2 | Q1 | Q2 | HT2 | HT3 |
|-------|------|---------|----|----|----|----|-----|-----|

4. Add a **`max`** row in Row 2 with the maximum marks for each column:

| max | | | 25 | 25 | 10 | 10 | 10 | 10 |
|----|--|--|----|----|----|----|-----|-----|

5. Add student data from Row 3 onwards:

| student@cfd.nu.edu.pk | Ali | 21F-0001 | 23 | 20 | 8 | 9 | 7 | 8 |
|----|--|--|----|----|----|----|-----|-----|

### Column Naming Rules

The backend auto-detects columns by their prefix:

| Prefix | Groups into | Example |
|--------|------------|---------|
| `A` + number | Assignments | `A1`, `A2`, `A3` |
| `Q` + number | Quizzes | `Q1`, `Q2`, `Q3` |
| `HT` + number | Home Tests | `HT2`, `HT3`, `HT4` |

> Just add a new column to the sheet — it appears on the dashboard automatically. No code changes needed.

---

## Apps Script Setup (Backend)

1. In your Google Sheet click **Extensions → Apps Script**
2. Delete all existing code
3. Copy the contents of `backend/Code.gs` and paste it in
4. Click **Save** (💾)
5. Click **Deploy → New deployment**
6. Click the ⚙️ gear → select **Web app**
7. Set:
   - Execute as: **Me**
   - Who has access: **Anyone**
8. Click **Deploy** → **Authorize access** → Allow
9. Copy the **Web app URL**
10. Paste it into `src/services/api.js`:
```js
const APPS_SCRIPT_URL = 'YOUR_URL_HERE'
```

> ⚠️ Every time you edit `Code.gs` you must create a **New deployment** — not update the existing one.

---

## Google OAuth Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project
3. Go to **APIs & Services → OAuth consent screen**
   - User type: **External** → Create
   - Fill in app name and email → Save
4. Go to **APIs & Services → Credentials**
5. Click **+ Create Credentials → OAuth 2.0 Client ID**
6. Application type: **Web application**
7. Under **Authorised JavaScript origins** add:
   - `http://localhost:5173` (local development)
   - `https://YOUR_USERNAME.github.io` (production)
8. Click **Create** → copy the **Client ID**
9. Paste it into `src/pages/Login.jsx`:
```js
const GOOGLE_CLIENT_ID = 'YOUR_CLIENT_ID_HERE'
```

---

## Running Locally

Make sure you have [Node.js](https://nodejs.org) installed, then:
```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/marks-portal.git
cd marks-portal

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Deploying to GitHub Pages
```bash
# First time setup
npm install --save-dev gh-pages

# Deploy
npm run deploy
```

Make sure `vite.config.js` has the correct base:
```js
base: '/marks-portal/',
```

Your app will be live at:
```
https://YOUR_USERNAME.github.io/marks-portal/
```

---

## Data Flow
```
Student          Frontend              Apps Script         Google Sheet
   │                │                      │                    │
   │─ Sign in ─────▶│                      │                    │
   │                │─ Decode JWT          │                    │
   │                │─ Check domain        │                    │
   │                │─ GET ?email=... ────▶│                    │
   │                │                      │─ Find email ──────▶│
   │                │                      │◀─ Student row ─────│
   │                │◀─ JSON response ─────│                    │
   │◀─ Dashboard ───│                      │                    │
```

---

## API Response Format

**Success:**
```json
{
  "name": "Ali Raza",
  "rollNo": "21-CFD-001",
  "assignments": { "A1": 23, "A2": 20 },
  "quizzes":     { "Q1": 8,  "Q2": 9  },
  "homeTests":   { "HT2": 7, "HT3": 8 },
  "maxMarks":    { "A1": 25, "A2": 25, "Q1": 10, "Q2": 10, "HT2": 10, "HT3": 10 }
}
```

**Error:**
```json
{ "error": "Access Denied: Your email is not registered." }
```

---

## Security

- Frontend domain check is for UX only — not a security boundary
- Backend validates every request independently
- Only the requesting student's row is returned — no student can see another's data
- Google handles all authentication — no passwords stored anywhere

---

## Customisation

| What | Where |
|------|-------|
| Allowed email domain | `src/services/api.js` → `ALLOWED_DOMAIN` |
| Sheet tab name | `backend/Code.gs` → `SHEET_NAME` |
| Add more mark columns | Just add to Google Sheet — fully automatic |
| Change colours | `src/index.css` → CSS variables |
| GitHub repo name | `vite.config.js` → `base` |

---

## Future Improvements

- [ ] Multiple courses / semesters
- [ ] Letter grade display
- [ ] Faculty admin panel to update marks
- [ ] Email notification when marks are updated
- [ ] Download marks as PDF
- [ ] Progressive Web App (PWA) support

---

## License

MIT — free to use and modify for educational purposes.
