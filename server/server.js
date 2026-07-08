const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const LogAnalysis = require("./models/LogAnalysis");

dotenv.config();
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
  });

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "LogLens AI Backend is running",
  });
});

app.post("/api/analyze-log", async (req, res) => {
  try {
    const { logText } = req.body;

    if (!logText || logText.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Log text is required",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are LogLens AI, an expert production log debugging assistant.

Analyze the following server/application logs and return the response strictly in JSON format.

Logs:
${logText}

Return JSON with this structure only:
{
  "summary": "short summary of the issue",
  "severity": "Low | Medium | High | Critical",
  "rootCause": "main reason behind the error",
  "possibleFix": "clear solution steps",
  "errorType": "Database | Authentication | API | Server | Frontend | Network | Unknown",
  "explanation": "simple explanation for a junior developer"
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsedResult;

    try {
      parsedResult = JSON.parse(text);
    } catch (error) {
      parsedResult = {
        summary: "AI analyzed the log but returned unstructured output.",
        severity: "Medium",
        rootCause: "Could not parse AI response properly.",
        possibleFix: text,
        errorType: "Unknown",
        explanation: "The AI response was not valid JSON, but the raw explanation is shown in possibleFix.",
      };
    }

    const safeAnalysis = {
  summary: parsedResult.summary || "Log analyzed successfully.",
  severity: ["Low", "Medium", "High", "Critical"].includes(parsedResult.severity)
    ? parsedResult.severity
    : "Medium",
  rootCause:
    parsedResult.rootCause ||
    "AI could not determine the exact root cause from the logs.",
  possibleFix:
    parsedResult.possibleFix ||
    "Check the error message, configuration, and running services.",
  errorType: parsedResult.errorType || "Unknown",
  explanation:
    parsedResult.explanation ||
    "The log was analyzed, but AI did not return a detailed explanation.",
};

const savedAnalysis = await LogAnalysis.create({
  logText,
  ...safeAnalysis,
});

res.json({
  success: true,
  analysis: savedAnalysis,
});
  } catch (error) {
    console.error("Analyze Log Error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong while analyzing logs",
      error: error.message,
    });
  }
});


app.get("/api/logs", async (req, res) => {
  try {
    const logs = await LogAnalysis.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch log history",
      error: error.message,
    });
  }
});

app.delete("/api/logs/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedLog = await LogAnalysis.findByIdAndDelete(id);

    if (!deletedLog) {
      return res.status(404).json({
        success: false,
        message: "Log not found",
      });
    }

    res.json({
      success: true,
      message: "Log deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete log",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`LogLens AI Backend running on port ${PORT}`);
});