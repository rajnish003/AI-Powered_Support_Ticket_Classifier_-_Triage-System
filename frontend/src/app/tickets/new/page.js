"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RotateCcw,
  Lightbulb,
} from "lucide-react";

import DashboardLayout from "@/components/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import CategoryBadge from "@/components/CategoryBadge";
import { createTicket } from "@/lib/api";

const SAMPLE_PROMPTS = [
  "My credit card was charged twice for one subscription order",
  "I cannot log into my account, password reset email never arrives",
  "The portal shows an internal 500 server error when uploading files",
  "Suspicious login activity detected from an unknown device in my account",
  "Can you provide more information about your enterprise pricing plans?",
];

export default function NewTicketPage() {
  const [complaintText, setComplaintText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [apiError, setApiError] = useState("");
  const [predictionResult, setPredictionResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");
    setApiError("");

    const trimmed = complaintText.trim();
    if (!trimmed) {
      setValidationError("Please enter customer complaint text.");
      return;
    }
    if (trimmed.length < 5) {
      setValidationError("Complaint text must be at least 5 characters long.");
      return;
    }
    if (trimmed.length > 5000) {
      setValidationError("Complaint text exceeds 5000 characters limit.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createTicket(trimmed);
      setPredictionResult(response);
    } catch (err) {
      setApiError(err.message || "Failed to process ticket. Please check backend connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setComplaintText("");
    setPredictionResult(null);
    setValidationError("");
    setApiError("");
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Create Support Ticket
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Submit a customer support complaint for real-time AI category classification and automated database triage
          </p>
        </div>

        {/* API Error Notification */}
        {apiError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-800">Submission Failed</p>
              <p className="text-xs text-red-600 mt-0.5">{apiError}</p>
            </div>
          </div>
        )}

        {/* Form or Result View */}
        {!predictionResult ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="complaint"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Customer Complaint Description
                  </label>
                  <span
                    className={`text-xs ${
                      complaintText.length > 4800
                        ? "text-amber-600 font-semibold"
                        : "text-slate-400"
                    }`}
                  >
                    {complaintText.length} / 5000 characters
                  </span>
                </div>

                <textarea
                  id="complaint"
                  rows={6}
                  value={complaintText}
                  onChange={(e) => {
                    setComplaintText(e.target.value);
                    if (validationError) setValidationError("");
                  }}
                  placeholder="Describe the customer's issue in detail (e.g. payment issue, account access, technical bug, security concern)..."
                  className={`w-full p-4 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all text-slate-800 placeholder-slate-400 ${
                    validationError
                      ? "border-red-300 focus:ring-red-400"
                      : "border-slate-200 focus:ring-indigo-500"
                  }`}
                  disabled={isSubmitting}
                />

                {validationError && (
                  <p className="text-xs font-medium text-red-600 mt-1.5 flex items-center gap-1">
                    <AlertCircle size={13} />
                    {validationError}
                  </p>
                )}
              </div>

              {/* Quick Sample Prompts */}
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2 flex items-center gap-1.5">
                  <Lightbulb size={13} className="text-amber-500" />
                  Quick sample inputs for testing:
                </p>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_PROMPTS.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setComplaintText(sample);
                        setValidationError("");
                      }}
                      className="text-xs text-left px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 rounded-lg transition-colors border border-slate-200/60"
                      disabled={isSubmitting}
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Classifying & Submitting...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Classify & Submit Ticket
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Prediction Result Success Card */
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header Banner */}
            <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-800">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <span className="text-sm font-semibold">
                  Ticket Created & Classified Successfully!
                </span>
              </div>
              <span className="text-xs font-mono font-medium text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                Ticket #{predictionResult.id}
              </span>
            </div>

            <div className="p-6 space-y-6">
              {/* Complaint Text */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Submitted Complaint
                </p>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-800 leading-relaxed">
                  {predictionResult.ticket_text || predictionResult.ticket}
                </div>
              </div>

              {/* AI Classification Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-lg">
                  <p className="text-xs font-medium text-slate-500 mb-1">
                    Predicted Category
                  </p>
                  <div className="mt-1">
                    <CategoryBadge category={predictionResult.category} />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                  <p className="text-xs font-medium text-slate-500 mb-1">
                    AI Confidence
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    {predictionResult.confidence != null
                      ? `${(predictionResult.confidence * 100).toFixed(1)}%`
                      : "—"}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                  <p className="text-xs font-medium text-slate-500 mb-1">
                    Initial Status
                  </p>
                  <div className="mt-1">
                    <StatusBadge status={predictionResult.status || "Pending"} />
                  </div>
                </div>
              </div>

              {/* Probabilities Breakdown (if available) */}
              {predictionResult.probabilities &&
                Object.keys(predictionResult.probabilities).length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                      Category Confidence Distribution
                    </p>
                    <div className="space-y-2">
                      {Object.entries(predictionResult.probabilities).map(
                        ([cat, prob]) => {
                          const percentage = (Number(prob) * 100).toFixed(1);
                          const isTop =
                            cat.toLowerCase() ===
                            predictionResult.category?.toLowerCase();
                          return (
                            <div key={cat} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span
                                  className={`capitalize font-medium ${
                                    isTop ? "text-indigo-700" : "text-slate-600"
                                  }`}
                                >
                                  {cat} {isTop && "(Selected)"}
                                </span>
                                <span className="font-mono text-slate-500">
                                  {percentage}%
                                </span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    isTop ? "bg-indigo-600" : "bg-slate-300"
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-100">
                <Link
                  href={`/tickets/${predictionResult.id}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
                >
                  <ExternalLink size={15} />
                  View Ticket #{predictionResult.id} Details
                </Link>

                <button
                  onClick={handleReset}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors"
                >
                  <RotateCcw size={15} />
                  Submit Another Ticket
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
