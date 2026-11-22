"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Ticket,
  Clock,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/StatsCard";
import CategoryChart from "@/components/charts/CategoryChart";
import StatusChart from "@/components/charts/StatusChart";
import TicketTrendChart from "@/components/charts/TicketTrendChart";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import ErrorMessage from "@/components/ui/ErrorMessage";
import CategoryBadge from "@/components/CategoryBadge";
import StatusBadge from "@/components/StatusBadge";
import { getTickets } from "@/lib/api";

export default function AnalyticsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTickets();
      setTickets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Derived Analytics computed strictly from actual backend records
  const totalTickets = tickets.length;

  const categoryStats = useMemo(() => {
    if (!tickets.length) return [];
    const counts = {};
    const confTotals = {};

    tickets.forEach((t) => {
      const cat = (t.category || "other").toLowerCase();
      counts[cat] = (counts[cat] || 0) + 1;
      if (t.confidence != null) {
        confTotals[cat] = (confTotals[cat] || 0) + t.confidence;
      }
    });

    return Object.entries(counts)
      .map(([cat, count]) => {
        const percentage = ((count / totalTickets) * 100).toFixed(1);
        const avgConfidence =
          confTotals[cat] != null
            ? ((confTotals[cat] / count) * 100).toFixed(1) + "%"
            : "—";
        return {
          category: cat,
          count,
          percentage,
          avgConfidence,
        };
      })
      .sort((a, b) => b.count - a.count);
  }, [tickets, totalTickets]);

  const statusStats = useMemo(() => {
    if (!tickets.length) return [];
    const statuses = ["Pending", "In Progress", "Resolved"];
    return statuses.map((st) => {
      const count = tickets.filter((t) => t.status === st).length;
      const percentage = totalTickets > 0 ? ((count / totalTickets) * 100).toFixed(1) : "0.0";
      return { status: st, count, percentage };
    });
  }, [tickets, totalTickets]);

  const pendingCount = tickets.filter((t) => t.status === "Pending").length;
  const inProgressCount = tickets.filter((t) => t.status === "In Progress").length;
  const resolvedCount = tickets.filter((t) => t.status === "Resolved").length;

  const resolutionRate =
    totalTickets > 0 ? ((resolvedCount / totalTickets) * 100).toFixed(1) : "0.0";

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Analytics & Insights
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Data visualizations and departmental breakdown computed from actual ticket logs
            </p>
          </div>
          <button
            onClick={fetchTickets}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors self-start sm:self-auto"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh Analytics
          </button>
        </div>

        {/* Loading State */}
        {loading && <LoadingSpinner message="Calculating analytics metrics..." />}

        {/* Error State */}
        {!loading && error && (
          <ErrorMessage
            title="Failed to load analytics"
            message={error}
            onRetry={fetchTickets}
          />
        )}

        {/* Empty State */}
        {!loading && !error && totalTickets === 0 && (
          <EmptyState
            title="No ticket data available"
            description="Submit support tickets to generate category breakdowns, resolution rates, and trends."
          />
        )}

        {/* Analytics Dash */}
        {!loading && !error && totalTickets > 0 && (
          <div className="space-y-8">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatsCard
                title="Total Tickets"
                value={totalTickets}
                icon={Ticket}
                color="indigo"
                trend="All historical tickets"
              />
              <StatsCard
                title="Pending Triage"
                value={pendingCount}
                icon={Clock}
                color="amber"
                trend="Awaiting agent action"
              />
              <StatsCard
                title="Resolved Tickets"
                value={resolvedCount}
                icon={CheckCircle2}
                color="emerald"
                trend={`${resolutionRate}% resolution rate`}
              />
              <StatsCard
                title="Active Departments"
                value={categoryStats.length}
                icon={BarChart3}
                color="blue"
                trend="Categorized departments"
              />
            </div>

            {/* Visual Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <PieChart size={16} className="text-indigo-600" />
                  Category Distribution
                </h3>
                <CategoryChart tickets={tickets} />
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <BarChart3 size={16} className="text-indigo-600" />
                  Status Distribution
                </h3>
                <StatusChart tickets={tickets} />
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <TrendingUp size={16} className="text-indigo-600" />
                  Daily Intake Trend
                </h3>
                <TicketTrendChart tickets={tickets} />
              </div>
            </div>

            {/* Detailed Category Breakdown Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-sm font-semibold text-slate-800">
                  Category-Wise Volume & Confidence Breakdown
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Detailed distribution across all 5 support categories
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="py-3 px-6 text-left text-xs font-semibold text-slate-500 uppercase">
                        Category
                      </th>
                      <th className="py-3 px-6 text-right text-xs font-semibold text-slate-500 uppercase">
                        Ticket Volume
                      </th>
                      <th className="py-3 px-6 text-right text-xs font-semibold text-slate-500 uppercase">
                        Percentage Share
                      </th>
                      <th className="py-3 px-6 text-right text-xs font-semibold text-slate-500 uppercase">
                        Average AI Confidence
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {categoryStats.map((item) => (
                      <tr key={item.category} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-6">
                          <CategoryBadge category={item.category} />
                        </td>
                        <td className="py-3.5 px-6 text-right font-medium text-slate-800">
                          {item.count}
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          <span className="font-mono text-slate-600">
                            {item.percentage}%
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-right font-mono text-indigo-600 font-medium">
                          {item.avgConfidence}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Resolution Status Summary */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
              <h3 className="text-sm font-semibold text-slate-800">
                Resolution Status Summary
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {statusStats.map((st) => (
                  <div
                    key={st.status}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <StatusBadge status={st.status} />
                      <span className="text-xs font-mono text-slate-500">
                        {st.percentage}%
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{st.count}</p>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          st.status === "Resolved"
                            ? "bg-emerald-500"
                            : st.status === "In Progress"
                            ? "bg-blue-500"
                            : "bg-amber-500"
                        }`}
                        style={{ width: `${st.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
