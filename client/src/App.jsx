import { useEffect, useState } from "react";
import axios from "axios";

import {
  Activity,
  AlertTriangle,
  Bug,
  CheckCircle,
  Loader2,
  Server,
  Upload,
FileText,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function App() {
  const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const [logText, setLogText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [severityFilter, setSeverityFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);
  const [backendStatus, setBackendStatus] = useState("Checking");
  


  const checkBackendStatus = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/`);

    if (res.data.success) {
      setBackendStatus("Connected");
    } else {
      setBackendStatus("Offline");
    }
  } catch (error) {
    setBackendStatus("Offline");
  }
};

const loadSampleLog = (type) => {
  const samples = {
    mongodb: `MongoServerError: bad auth Authentication failed.
at Connection.onMessage
at MongoClient.connect`,

    server: `Error: listen EADDRINUSE: address already in use :::5000
at Server.setupListenHandle
at listenInCluster`,

    react: `TypeError: Cannot read properties of undefined (reading 'map')
at Dashboard.jsx:45
at renderWithHooks`,

    api: `AxiosError: Request failed with status code 404
GET http://localhost:5000/api/users
at settle
at XMLHttpRequest.onloadend`,
  };

  setLogText(samples[type]);
  setSelectedFile(null);
  setAnalysis(null);
};


  const fetchLogHistory = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/logs`);

    if (res.data.success) {
      setHistory(res.data.logs);
    }
  } catch (error) {
    console.error("Failed to fetch history:", error);
  }
};



useEffect(() => {
  checkBackendStatus();
  fetchLogHistory();
}, []);


const filteredHistory = history.filter((item) => {
  const matchesSeverity =
    severityFilter === "All" || item.severity === severityFilter;

  const query = searchQuery.toLowerCase();

  const matchesSearch =
    item.summary?.toLowerCase().includes(query) ||
    item.rootCause?.toLowerCase().includes(query) ||
    item.errorType?.toLowerCase().includes(query) ||
    item.severity?.toLowerCase().includes(query) ||
    item.logText?.toLowerCase().includes(query);

  return matchesSeverity && matchesSearch;
});


const totalLogs = history.length;

const criticalLogs = history.filter(
  (item) => item.severity === "Critical"
).length;

const highLogs = history.filter(
  (item) => item.severity === "High"
).length;

const errorTypeCount = history.reduce((acc, item) => {
  acc[item.errorType] = (acc[item.errorType] || 0) + 1;
  return acc;
}, {});

const mostCommonErrorType =
  Object.keys(errorTypeCount).length > 0
    ? Object.keys(errorTypeCount).reduce((a, b) =>
        errorTypeCount[a] > errorTypeCount[b] ? a : b
      )
    : "None";
  const severityChartData = ["Critical", "High", "Medium", "Low"]
  .map((level) => ({
    name: level,
    value: history.filter((item) => item.severity === level).length,
  }))
  .filter((item) => item.value > 0);

const errorTypeChartData = Object.entries(errorTypeCount).map(
  ([name, value]) => ({
    name,
    value,
  })
);

const severityColors = {
  Critical: "#ef4444",
  High: "#f97316",
  Medium: "#eab308",
  Low: "#22c55e",
};

    

const handleFileUpload = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const isValidFile =
    file.name.endsWith(".log") ||
    file.name.endsWith(".txt") ||
    file.type === "text/plain";

  if (!isValidFile) {
    alert("Please upload only .log or .txt files");
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    alert("File size should be less than 2MB");
    return;
  }

  const reader = new FileReader();

  reader.onload = (event) => {
    const fileContent = event.target.result;

    console.log("File Content:", fileContent);

    if (!fileContent || fileContent.trim() === "") {
      alert("Uploaded file is empty. Please add some logs inside the file.");
      return;
    }

    setLogText(fileContent);
    setSelectedFile(file);
  };

  reader.onerror = () => {
    alert("Failed to read file");
  };

  reader.readAsText(file);
};



  const analyzeLog = async () => {
    if (!logText.trim()) {
      alert("Please paste some logs first");
      return;
    }

    try {
      setLoading(true);
      setAnalysis(null);

      const res = await axios.post(`${API_BASE_URL}/api/analyze-log`, {
  logText,
});

      if (res.data.success) {
  setAnalysis(res.data.analysis);
  fetchLogHistory();
}
    } catch (error) {
  console.error("Analyze error:", error.response?.data || error.message);

  alert(
    error.response?.data?.message ||
      error.response?.data?.error ||
      "Something went wrong while analyzing logs"
  );
} finally {
      setLoading(false);
    }
  };
  const deleteLog = async (id) => {
  try {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this log?"
    );

    if (!confirmDelete) return;

    const res = await axios.delete(`${API_BASE_URL}/api/logs/${id}`);

    if (res.data.success) {
      fetchLogHistory();
    }
  } catch (error) {
    console.error("Delete error:", error.response?.data || error.message);
    alert("Failed to delete log");
  }
};
const copyReport = async (log) => {
  const report = `
LogLens AI Report

Severity: ${log.severity}
Error Type: ${log.errorType}

Summary:
${log.summary}

Root Cause:
${log.rootCause}

Possible Fix:
${log.possibleFix}

Explanation:
${log.explanation}

Original Log:
${log.logText}
`;

  try {
    await navigator.clipboard.writeText(report);
    alert("Report copied to clipboard");
  } catch (error) {
    console.error("Copy failed:", error);
    alert("Failed to copy report");
  }
};
const downloadReport = (log) => {
  const report = `
LogLens AI Report

Severity: ${log.severity}
Error Type: ${log.errorType}

Summary:
${log.summary}

Root Cause:
${log.rootCause}

Possible Fix:
${log.possibleFix}

Explanation:
${log.explanation}

Original Log:
${log.logText}
`;

  const blob = new Blob([report], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `loglens-report-${log._id}.txt`;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

  const getSeverityColor = (severity) => {
    if (severity === "Critical") return "text-red-400 border-red-500/40";
    if (severity === "High") return "text-orange-400 border-orange-500/40";
    if (severity === "Medium") return "text-yellow-400 border-yellow-500/40";
    return "text-green-400 border-green-500/40";
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#020617] text-white">
  <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.25),transparent_35%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.22),transparent_35%),linear-gradient(to_bottom,#020617,#020617)]" />
     <nav className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
  <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
    <div className="flex items-center gap-3">
      <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-3 shadow-lg shadow-blue-500/10">
        <Activity className="text-blue-400" size={28} />
      </div>

      <div>
        <h1 className="text-2xl font-black tracking-tight">
          LogLens <span className="text-blue-400">AI</span>
        </h1>
        <p className="text-sm text-slate-400">
          Intelligent log monitoring & debugging
        </p>
      </div>
    </div>

    <div
      className={`rounded-full border px-4 py-2 text-sm font-medium ${
        backendStatus === "Connected"
          ? "border-green-500/30 bg-green-500/10 text-green-400"
          : backendStatus === "Checking"
          ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
          : "border-red-500/30 bg-red-500/10 text-red-400"
      }`}
    >
      Backend {backendStatus}
    </div>
  </div>
</nav>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="mb-12 pt-8 text-center">
  <div className="mx-auto mb-5 w-fit rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
    AI-powered production debugging dashboard
  </div>

  <h2 className="mx-auto mb-5 max-w-4xl text-5xl font-black tracking-tight md:text-6xl">
    Debug production logs with{" "}
    <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
      AI precision
    </span>
  </h2>

  <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-400">
    Upload logs, detect severity, identify root causes, generate fixes, and
    manage incident history from one intelligent dashboard.
  </p>
</section>
        <section className="mb-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  <StatsCard title="Total Logs" value={totalLogs} />
  <StatsCard title="Critical Issues" value={criticalLogs} />
  <StatsCard title="High Severity" value={highLogs} />
  <StatsCard title="Common Error Type" value={mostCommonErrorType} />
</section>


<section className="mb-10 grid gap-6 lg:grid-cols-2">
  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl">
    <h3 className="mb-4 text-xl font-semibold">Severity Distribution</h3>

    {severityChartData.length === 0 ? (
      <div className="flex h-64 items-center justify-center text-slate-500">
        No severity data available yet.
      </div>
    ) : (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={severityChartData}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              label
            >
              {severityChartData.map((entry, index) => (
  <Cell
    key={`cell-${index}`}
    fill={severityColors[entry.name] || "#3b82f6"}
  />
))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )}
  </div>

  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl">
    <h3 className="mb-4 text-xl font-semibold">Error Type Frequency</h3>

    {errorTypeChartData.length === 0 ? (
      <div className="flex h-64 items-center justify-center text-slate-500">
        No error type data available yet.
      </div>
    ) : (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={errorTypeChartData}>
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )}
  </div>
</section>

     


        

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-7 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2">
              <Server className="text-blue-400" />
              <h3 className="text-xl font-semibold">Paste Error Logs</h3>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
  <button
    onClick={() => loadSampleLog("mongodb")}
    className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/10"
  >
    MongoDB Error
  </button>

  <button
    onClick={() => loadSampleLog("server")}
    className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/10"
  >
    Server Error
  </button>

  <button
    onClick={() => loadSampleLog("react")}
    className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/10"
  >
    React Error
  </button>

  <button
    onClick={() => loadSampleLog("api")}
    className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/10"
  >
    API Error
  </button>
</div>


            <div className="mb-4 rounded-2xl border border-dashed border-blue-500/20 bg-slate-900/70 p-4">
  <label className="flex cursor-pointer items-center justify-center gap-3 rounded-lg bg-white/5 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10">
    <Upload className="text-blue-400" size={20} />
    Upload .log or .txt file
    <input
      type="file"
      accept=".log,.txt,text/plain"
      onChange={handleFileUpload}
      className="hidden"
    />
  </label>

  {selectedFile && (
    <div className="mt-3 flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-sm text-blue-300">
      <FileText size={16} />
      <span>{selectedFile.name}</span>
    </div>
  )}
</div>

            <textarea
              value={logText}
              onChange={(e) => setLogText(e.target.value)}
              spellCheck="false"
              placeholder="Paste your server logs here..."
              className="h-80 w-full resize-none rounded-2xl border border-white/10 bg-slate-900/80 p-5 font-mono text-sm leading-6 text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />

            <button
              onClick={analyzeLog}
              disabled={loading}
             className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 px-6 py-4 font-bold shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Analyzing Logs...
                </>
              ) : (
                <>
                  <Bug size={20} />
                  Analyze Logs
                </>
              )}
            </button>
            <button
  onClick={() => {
    setLogText("");
    setAnalysis(null);
    setSelectedFile(null);
  }}
  className="mt-3 w-full rounded-2xl border border-white/10 px-6 py-4 font-bold text-slate-300 transition hover:-translate-y-0.5 hover:bg-white/10"
>
  Clear Logs
</button>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-7 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2">
              <AlertTriangle className="text-orange-400" />
              <h3 className="text-xl font-semibold">AI Analysis Result</h3>
            </div>

            {!analysis && !loading && (
              <div className="flex h-80 items-center justify-center rounded-xl border border-dashed border-white/10 bg-slate-900 text-center text-slate-500">
                AI analysis will appear here after you submit logs.
              </div>
            )}

            {loading && (
              <div className="flex h-80 flex-col items-center justify-center rounded-xl bg-slate-900 text-slate-400">
                <Loader2 className="mb-4 animate-spin text-blue-400" size={40} />
                Analyzing production logs...
              </div>
            )}

            {analysis && (
              <div className="space-y-4">
                <div
                  className={`rounded-xl border bg-slate-900 p-4 ${getSeverityColor(
                    analysis.severity
                  )}`}
                >
                  <p className="text-sm text-slate-400">Severity</p>
                  <h4 className="text-2xl font-bold">{analysis.severity}</h4>
                </div>

                <ResultCard title="Summary" value={analysis.summary} />
                <ResultCard title="Error Type" value={analysis.errorType} />
                <ResultCard title="Root Cause" value={analysis.rootCause} />
                <ResultCard title="Possible Fix" value={analysis.possibleFix} />
                <ResultCard title="Explanation" value={analysis.explanation} />
              </div>
            )}
          </div>
        </section>
        


        <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.06] p-7 shadow-2xl shadow-black/30 backdrop-blur-xl">
  <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
  <div>
    <h3 className="text-xl font-semibold">Recent Analysis History</h3>
    <p className="text-sm text-slate-400">
      Previously analyzed logs saved in MongoDB
    </p>
  </div>

  <div className="flex flex-wrap items-center gap-2">
    {["All", "Critical", "High", "Medium", "Low"].map((level) => (
      <button
        key={level}
        onClick={() => setSeverityFilter(level)}
        className={`rounded-lg border px-3 py-2 text-sm transition ${
          severityFilter === level
            ? "border-blue-500/50 bg-blue-500/20 text-blue-300"
            : "border-white/10 text-slate-300 hover:bg-white/10"
        }`}
      >
        {level}
      </button>
    ))}

    <button
      onClick={fetchLogHistory}
      className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
    >
      Refresh
    </button>
  </div>
</div>


<div className="mb-5">
  <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search logs by keyword, error type, severity..."
    className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-5 py-4 text-sm text-slate-200 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
  />
</div>

  {filteredHistory.length === 0 ? (
    <div className="rounded-xl border border-dashed border-white/10 bg-slate-900 p-8 text-center text-slate-500">
      No logs found for the selected filter.
    </div>
  ) : (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredHistory.map((item) => (
        <div
  key={item._id}
  className="group rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-lg transition hover:-translate-y-1 hover:border-blue-500/30 hover:bg-slate-900"
>
          <div className="mb-3 flex items-center justify-between">
            <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
              {item.errorType}
            </span>

            <span className="text-xs text-slate-500">
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h4 className="mb-2 line-clamp-2 font-semibold text-slate-200">
            {item.summary}
          </h4>

          <p className="mb-3 line-clamp-3 text-sm text-slate-400">
            {item.rootCause}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Severity</span>
            <span className="text-sm font-semibold text-orange-400">
              {item.severity}
            </span>
          </div>

          <button
  onClick={() => setSelectedLog(item)}
  className="mt-4 w-full rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-sm text-blue-300 transition hover:bg-blue-500/20"
>
  View Details
</button>



          <button
  onClick={() => deleteLog(item._id)}
  className="mt-4 w-full rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300 transition hover:bg-red-500/20"
>
  Delete Log
</button>
        </div>
      ))}
    </div>
  )}
</section>


      {selectedLog && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
    <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-950/95 p-7 shadow-2xl shadow-black/50 backdrop-blur-xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white">Log Analysis Details</h3>
          <p className="text-sm text-slate-400">
            {new Date(selectedLog.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
  <button
    onClick={() => copyReport(selectedLog)}
    className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-sm text-blue-300 hover:bg-blue-500/20"
  >
    Copy Report
  </button>

  <button
    onClick={() => downloadReport(selectedLog)}
    className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-300 hover:bg-green-500/20"
  >
    Download Report
  </button>

  <button
    onClick={() => setSelectedLog(null)}
    className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/10"
  >
    Close
  </button>
</div>
      </div>

      <div className="mb-5 rounded-xl border border-orange-500/30 bg-orange-500/10 p-4">
        <p className="text-sm text-slate-400">Severity</p>
        <h4 className="text-2xl font-bold text-orange-400">
          {selectedLog.severity}
        </h4>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DetailBox title="Error Type" value={selectedLog.errorType} />
        <DetailBox title="Summary" value={selectedLog.summary} />
        <DetailBox title="Root Cause" value={selectedLog.rootCause} />
        <DetailBox title="Possible Fix" value={selectedLog.possibleFix} />
      </div>

      <div className="mt-4">
        <DetailBox title="Explanation" value={selectedLog.explanation} />
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-slate-900 p-4">
        <h4 className="mb-2 font-semibold text-slate-200">Original Log</h4>
        <pre className="max-h-60 overflow-auto whitespace-pre-wrap text-sm leading-6 text-slate-400">
          {selectedLog.logText}
        </pre>
      </div>
    </div>
  </div>
)}

      </main>
    </div>
  );
}

function ResultCard({ title, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-lg transition hover:border-blue-500/20">
      <div className="mb-3 flex items-center gap-2">
        <CheckCircle className="text-green-400" size={18} />
        <h4 className="font-bold text-slate-100">{title}</h4>
      </div>
      <p className="whitespace-pre-line text-sm leading-7 text-slate-400">
        {value}
      </p>
    </div>
  );
}


function StatsCard({ title, value }) {
  return (
    <div className="group rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-blue-500/30 hover:bg-white/[0.08]">
      <p className="text-sm font-medium text-slate-400">{title}</p>
      <h3 className="mt-3 text-4xl font-black tracking-tight text-white">
        {value}
      </h3>
      <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-70 transition group-hover:w-24" />
    </div>
  );
}

function DetailBox({ title, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900 p-4">
      <h4 className="mb-2 font-semibold text-slate-200">{title}</h4>
      <p className="whitespace-pre-line text-sm leading-6 text-slate-400">
        {value}
      </p>
    </div>
  );
}





export default App;