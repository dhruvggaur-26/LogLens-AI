const mongoose = require("mongoose");

const logAnalysisSchema = new mongoose.Schema(
  {
    logText: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      required: true,
    },
    rootCause: {
      type: String,
      required: true,
    },
    possibleFix: {
      type: String,
      required: true,
    },
    errorType: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LogAnalysis", logAnalysisSchema);