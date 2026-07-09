# LogLens AI

LogLens AI is an AI-powered production log debugging platform where users can paste server logs or upload `.log` / `.txt` files and get instant AI-generated analysis including severity, error type, root cause, possible fixes, and explanation.

It also provides MongoDB-based log history, analytics charts, search and filter options, copy/download reports, and a modern SaaS-style dashboard for debugging application errors faster.

## Features

* AI-powered log analysis using Google Gemini API
* Paste raw server, API, database, or frontend logs
* Upload `.log` and `.txt` files for analysis
* Sample log buttons for quick demo testing
* Severity classification: Low, Medium, High, Critical
* Error type detection such as Server, Database, API, Frontend, Authentication, and Network
* Root cause analysis for production errors
* AI-generated possible fixes and simple explanation
* MongoDB-based log analysis history
* Search logs by keyword, error type, severity, or log content
* Filter history by severity level
* Dashboard stats cards for total logs, critical issues, high severity logs, and common error type
* Analytics charts for severity distribution and error type frequency
* View complete AI analysis in a detailed modal
* Copy AI-generated debugging report
* Download report as `.txt` file
* Delete saved log reports from history
* Dynamic backend connection status indicator
* Modern responsive SaaS-style dark UI

## Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* Lucide React
* Recharts

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* Google Gemini API
* dotenv
* CORS

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

## Project Structure

```txt
LogLens-AI/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
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
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/dhruvggaur-26/LogLens-AI.git
cd LogLens-AI
```

### 2. Install backend dependencies

Open terminal inside the project folder:

```bash
cd server
npm install
npm run dev
```

The backend will run on:

```txt
http://localhost:5000
```

### 3. Install frontend dependencies

Open another terminal:

```bash
cd client
npm install
npm run dev
```

The frontend will run on:

```txt
http://localhost:5173
```

## Environment Variables

Create a `.env` file inside the `server` folder:

```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
MONGO_URI=your_mongodb_connection_string_here
```

For frontend deployment, create a `.env` file inside the `client` folder if needed:

```env
VITE_API_BASE_URL=http://localhost:5000
```

For production, use your deployed backend URL:https://loglens-ai-backend.onrender.com

```env
VITE_API_BASE_URL=https://loglens-ai-backend.onrender.com
```

## Usage

1. Open the frontend in the browser.
2. Paste an error log manually or upload a `.log` / `.txt` file.
3. Click on the **Analyze Logs** button.
4. LogLens AI will generate:
   * Severity
   * Error Type
   * Summary
   * Root Cause
   * Possible Fix
   * Explanation
5. View saved reports in the Recent Analysis History section.
6. Search or filter previous logs by severity.
7. Open detailed analysis in a modal.
8. Copy or download the AI-generated debugging report.
9. Delete old log reports if needed.

## Sample Log

```txt
Error: listen EADDRINUSE: address already in use :::5000
at Server.setupListenHandle
at listenInCluster
```

## Sample AI Output

```txt
Severity: High

Error Type: Server

Summary:
The application failed to start because port 5000 is already in use.

Root Cause:
Another process is currently using TCP port 5000, preventing the current application from binding to it.

Possible Fix:
Identify and stop the process using port 5000 or configure the application to run on a different port.

Explanation:
The application is trying to use a network port that is already occupied by another process.
```

## API Endpoints

### Check Backend Status

```txt
GET /
```

### Analyze Log

```txt
POST /api/analyze-log
```

Request body:

```json
{
  "logText": "Error: listen EADDRINUSE: address already in use :::5000"
}
```

### Fetch Log History

```txt
GET /api/logs
```

### Delete Log

```txt
DELETE /api/logs/:id
```

## Current Limitations

* The platform currently supports text-based logs only.
* PDF report export is not added yet.
* Authentication is not implemented.
* Real-time log streaming is not implemented.
* Team-based incident collaboration can be added in future versions.

## Future Improvements

* Add user authentication
* Add team-based incident workspaces
* Add real-time log streaming using WebSockets
* Add PDF report download
* Add Docker support
* Add Slack/Jira integration for incident reporting
* Add role-based access control
* Add advanced AI-based log grouping and duplicate error detection

## Author

Dhruv Gaur

## Live Demo

Frontend:https:https://log-lens-ai-seven.vercel.app/
Backend: https:https://loglens-ai-backend.onrender.com
