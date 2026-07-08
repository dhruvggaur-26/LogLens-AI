# LogLens AI

LogLens AI is an AI-powered production log debugging platform that helps developers analyze server, API, database, and frontend errors using Gemini AI.

It allows users to paste logs or upload `.log` / `.txt` files and instantly get severity classification, root cause analysis, possible fixes, explanations, and downloadable debugging reports.

---

## Features

- AI-powered log analysis using Gemini API
- Paste raw server/application logs
- Upload `.log` and `.txt` files
- Severity detection: Low, Medium, High, Critical
- Root cause analysis and suggested fixes
- MongoDB-based analysis history
- Search and filter previous logs
- Severity-based filtering
- Dashboard stats cards
- Analytics charts for severity and error types
- View detailed analysis in modal
- Copy AI-generated report
- Download report as `.txt`
- Delete log history
- Dynamic backend status indicator
- Modern SaaS-style responsive UI

---

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- Lucide React
- Recharts

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Gemini API
- Multer
- Dotenv
- CORS

---

## Project Structure

```txt
LogLens-AI/
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── models/
│   │   └── LogAnalysis.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md