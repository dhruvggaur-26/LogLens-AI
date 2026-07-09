# LogLens AI

LogLens AI is an AI-powered production log debugging platform that helps developers analyze server, API, database, and frontend errors using Gemini AI.

Users can paste logs or upload `.log` / `.txt` files and instantly get severity classification, root cause analysis, possible fixes, explanations, analytics, and downloadable debugging reports.

---

## Live Links

- **Live Demo:** https://log-lens-ai-seven.vercel.app/
- **Frontend:** https://log-lens-ai-seven.vercel.app/
- **Backend API:** https://resumeiq-ai-backend.onrender.com
- **GitHub Repository:** https://github.com/dhruvggaur-26

---

## Preview

Add your project screenshots here.

```txt
Dashboard Screenshot
AI Analysis Screenshot
History & Analytics Screenshot
Features
AI-powered log analysis using Gemini API
Paste raw server, API, database, or frontend logs
Upload .log and .txt files
Sample error log buttons for quick demo
Severity detection: Low, Medium, High, Critical
Error type classification
Root cause analysis
AI-generated possible fixes
Simple explanation for junior developers
MongoDB-based analysis history
Search previous log reports
Filter reports by severity
Dashboard stats cards
Analytics charts for severity and error types
View complete analysis in a modal
Copy AI-generated report
Download report as .txt
Delete saved log reports
Dynamic backend connection status
Modern SaaS-style responsive UI
Tech Stack
Frontend
React.js
Vite
Tailwind CSS
Axios
Lucide React
Recharts
Backend
Node.js
Express.js
MongoDB Atlas
Mongoose
Gemini API
Dotenv
CORS
Deployment
Frontend: Vercel
Backend: Render
Database: MongoDB Atlas
Project Structure
LogLens-AI/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/
│   ├── models/
│   │   └── LogAnalysis.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
Environment Variables

Create a .env file inside the server folder.

PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
MONGO_URI=your_mongodb_connection_string_here

Important: Do not upload your .env file to GitHub.

Installation and Setup

Follow these steps to run LogLens AI locally.

1. Clone the Repository
git clone YOUR_GITHUB_REPO_LINK
cd LogLens-AI
2. Setup Backend

Go to the backend folder:

cd server

Install backend dependencies:

npm install

Create a .env file inside the server folder:

PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
MONGO_URI=your_mongodb_connection_string_here

Start the backend server:

npm run dev

If everything is working, you should see:

LogLens AI Backend running on port 5000
MongoDB connected successfully

Backend will run on:

http://localhost:5000
3. Setup Frontend

Open a new terminal.

Go to the frontend folder:

cd client

Install frontend dependencies:

npm install

Create a .env file inside the client folder if needed:

VITE_API_BASE_URL=http://localhost:5000

Start the frontend:

npm run dev

Frontend will run on:

http://localhost:5173
API Endpoints
Check Backend Status
GET /
Analyze Log
POST /api/analyze-log

Request body:

{
  "logText": "Error: listen EADDRINUSE: address already in use :::5000"
}
Fetch Log History
GET /api/logs
Delete Log
DELETE /api/logs/:id
Sample Log for Testing
Error: listen EADDRINUSE: address already in use :::5000
at Server.setupListenHandle
at listenInCluster

After clicking Analyze Logs, LogLens AI generates:

Severity
Error Type
Summary
Root Cause
Possible Fix
Explanation

The analysis is also saved in MongoDB history.

Sample AI Report
LogLens AI Report

Severity: High
Error Type: Server

Summary:
The application failed to start because it could not bind to port 5000.

Root Cause:
Another process is already using TCP port 5000.

Possible Fix:
Identify and stop the process using port 5000 or configure the application to use a different port.

Explanation:
The application is trying to listen on a port that is already occupied by another process.
Use Cases
Debugging backend server errors
Understanding MongoDB connection issues
Analyzing API failures
Debugging React/frontend runtime errors
Creating incident reports
Documenting production issues
Helping junior developers understand complex logs
Project Highlights
Integrated Gemini API with an Express.js backend for structured AI log analysis.
Designed a modern SaaS-style dashboard using React.js and Tailwind CSS.
Implemented MongoDB-based history with search, severity filters, analytics charts, delete functionality, and detailed report view.
Added developer-focused features like .log file upload, sample logs, copy report, download report, and dynamic backend status.
Resume Highlight

Built an AI-powered production log debugging platform using React.js, Node.js, Express.js, MongoDB, and Gemini API that analyzes raw logs, classifies severity, identifies root causes, suggests fixes, stores analysis history, and generates downloadable debugging reports.

Future Improvements
User authentication
Team-based workspaces
Real-time log streaming using WebSockets
Docker support
PDF report export
Role-based access control
Slack/Jira integration for incident reporting
Author

Dhruv Gaur


---

README update karne ke baad ye commands run kar dena:

```bash
git add README.md
git commit -m "Update README with live deployment links"
git push
