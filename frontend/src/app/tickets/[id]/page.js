"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Send,
} from "lucide-react";

import DashboardLayout from "@/components/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import CategoryBadge from "@/components/CategoryBadge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { getTicketById, updateTicketStatus } from "@/lib/api";

const STATUS_OPTIONS = ["Pending", "In Progress", "Resolved"];

export default function TicketDetailPage({ params }) {
  const { id } = params;
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Status update state
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateFeedback, setUpdateFeedback] = useState({ type: "", message: "" });

  const fetchTicket = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTicketById(id);
      setTicket(data);
      setSelectedStatus(data.status);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  const handleStatusChange = async (newStatus) => {
    if (!newStatus || newStatus === ticket?.status) return;

    setIsUpdating(true);
    setUpdateFeedback({ type: "", message: "" });

    try {
      const updated = await updateTicketStatus(id, newStatus);
      setTicket(updated);
      setSelectedStatus(updated.status);
      setUpdateFeedback({
        type: "success",
        message: `Ticket status successfully changed to "${newStatus}"`,
      });
    } catch (err) {
      setUpdateFeedback({
        type: "error",
        message: err.message || "Failed to update ticket status",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Link */}
        <div>
          <Link
            href="/tickets"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to All Tickets
          </Link>
        </div>

        {/* Loading State */}
        {loading && <LoadingSpinner message={`Loading ticket #${id}...`} />}

        {/* Error State */}
        {!loading && error && (
          <ErrorMessage
            title={`Could not load ticket #${id}`}
            message={error}
            onRetry={fetchTicket}
          />
        )}

        {/* Main Content */}
        {!loading && !error && ticket && (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
                      Ticket #{ticket.id}
                    </span>
                    <CategoryBadge category={ticket.category} />
                    <StatusBadge status={ticket.status} />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                    <Calendar size={13} />
                    <span>Created: {formatDate(ticket.created_at)}</span>
                  </div>
                </div>

                {/* Quick Refresh */}
                <button
                  onClick={fetchTicket}
                  disabled={loading}
                  className="self-start sm:self-auto p-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                  title="Reload details"
                >
                  <RefreshCw size={15} />
                </button>
              </div>

              {/* Status Update Control Section */}
              <div className="pt-5">
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Update Resolution Status
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {STATUS_OPTIONS.map((st) => {
                    const isCurrent = ticket.status === st;
                    return (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(st)}
                        disabled={isUpdating || isCurrent}
                        className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all ${
                          isCurrent
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm cursor-default"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        {isUpdating && selectedStatus === st ? (
                          <span className="inline-flex items-center gap-1.5">
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Updating...
                          </span>
                        ) : (
                          st
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback Toast Banner */}
                {updateFeedback.message && (
                  <div
                    className={`mt-3 p-3 text-xs rounded-lg flex items-center gap-2 ${
                      updateFeedback.type === "success"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {updateFeedback.type === "success" ? (
                      <CheckCircle size={15} className="text-emerald-600" />
                    ) : (
                      <AlertCircle size={15} className="text-red-600" />
                    )}
                    <span>{updateFeedback.message}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Complaint Text Section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-3">
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
                Customer Complaint Message
              </h3>
              <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
                {ticket.ticket_text}
              </div>
            </div>

            {/* AI Classification Insights Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-600" />
                <h3 className="text-sm font-semibold text-slate-800">
                  AI Model Classification Insights
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-lg">
                  <p className="text-xs text-slate-500 font-medium">Assigned Department</p>
                  <p className="text-base font-bold text-indigo-900 mt-1 capitalize">
                    {ticket.category}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                  <p className="text-xs text-slate-500 font-medium">Model Confidence</p>
                  <p className="text-base font-bold text-slate-900 mt-1">
                    {ticket.confidence != null
                      ? `${(ticket.confidence * 100).toFixed(1)}%`
                      : "—"}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                  <p className="text-xs text-slate-500 font-medium">Triage Confidence Status</p>
                  <p className="text-xs font-semibold text-emerald-700 mt-1.5 flex items-center gap-1">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    {ticket.confidence >= 0.7 ? "High Confidence" : "Standard Review"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
