"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Ticket,
  Clock,
  Loader2,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/StatsCard";
import TicketTable from "@/components/TicketTable";
import CategoryChart from "@/components/charts/CategoryChart";
import StatusChart from "@/components/charts/StatusChart";
import TicketTrendChart from "@/components/charts/TicketTrendChart";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { getTickets } from "@/lib/api";

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">{title}</h3>
      {children}
    </div>
  );
}

export default function DashboardPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTickets = useCallback(async () => {
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
    loadTickets();
  }, [loadTickets]);

  // Compute stats from real data
  const total = tickets.length;
  const pending = tickets.filter((t) => t.status === "Pending").length;
  const inProgress = tickets.filter((t) => t.status === "In Progress").length;
  const resolved = tickets.filter((t) => t.status === "Resolved").length;

  // Recent 5 tickets (already sorted newest-first from the API)
  const recentTickets = tickets.slice(0, 5);

  return (
    <DashboardLayout>
      {/* ── Loading ── */}
      {loading && <LoadingSpinner message="Loading dashboard data…" />}

      {/* ── Error ── */}
      {!loading && error && (
        <ErrorMessage
          title="Failed to load dashboard"
          message={error}
          onRetry={loadTickets}
        />
      )}

      {/* ── Content ── */}
      {!loading && !error && (
        <div className="space-y-8">

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatsCard
              title="Total Tickets"
              value={total}
              icon={Ticket}
              color="indigo"
              trend="All submitted tickets"
            />
            <StatsCard
              title="Pending"
              value={pending}
              icon={Clock}
              color="amber"
              trend="Awaiting review"
            />
            <StatsCard
              title="In Progress"
              value={inProgress}
              icon={Loader2}
              color="blue"
              trend="Being handled"
            />
            <StatsCard
              title="Resolved"
              value={resolved}
              icon={CheckCircle2}
              color="emerald"
              trend="Successfully closed"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ChartCard title="Tickets by Category">
              <CategoryChart tickets={tickets} />
            </ChartCard>
            <ChartCard title="Tickets by Status">
              <StatusChart tickets={tickets} />
            </ChartCard>
            <ChartCard title="Ticket Creation Trend">
              <TicketTrendChart tickets={tickets} />
            </ChartCard>
          </div>

          {/* Recent Tickets */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-semibold text-slate-700">
                  Recent Tickets
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Latest {Math.min(5, total)} of {total} total tickets
                </p>
              </div>
              <Link
                href="/tickets"
                className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                View All
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="px-6 py-4">
              {recentTickets.length === 0 ? (
                <div className="py-10 text-center">
                  <TrendingUp size={28} className="mx-auto text-slate-200 mb-2" />
                  <p className="text-sm text-slate-400">No tickets submitted yet.</p>
                  <Link
                    href="/tickets/new"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    Submit your first ticket
                    <ArrowRight size={13} />
                  </Link>
                </div>
              ) : (
                <TicketTable tickets={recentTickets} showAll={false} />
              )}
            </div>
          </div>

        </div>
      )}
    </DashboardLayout>
  );
}
