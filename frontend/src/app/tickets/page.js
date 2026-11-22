"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  ArrowUpDown,
  PlusCircle,
  RefreshCw,
  XCircle,
} from "lucide-react";

import DashboardLayout from "@/components/DashboardLayout";
import TicketTable from "@/components/TicketTable";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { getTickets } from "@/lib/api";

const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "billing", label: "Billing" },
  { value: "technical", label: "Technical" },
  { value: "account", label: "Account" },
  { value: "security", label: "Security" },
  { value: "other", label: "Other" },
];

const STATUSES = [
  { value: "all", label: "All Statuses" },
  { value: "Pending", label: "Pending" },
  { value: "In Progress", label: "In Progress" },
  { value: "Resolved", label: "Resolved" },
];

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" | "oldest"

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

  // Client-side filtering and sorting
  const filteredTickets = useMemo(() => {
    return tickets
      .filter((ticket) => {
        // Search by complaint text or ID
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesText = ticket.ticket_text?.toLowerCase().includes(q);
          const matchesId = String(ticket.id).includes(q);
          if (!matchesText && !matchesId) return false;
        }

        // Category filter
        if (
          selectedCategory !== "all" &&
          ticket.category?.toLowerCase() !== selectedCategory.toLowerCase()
        ) {
          return false;
        }

        // Status filter
        if (selectedStatus !== "all" && ticket.status !== selectedStatus) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      });
  }, [tickets, searchQuery, selectedCategory, selectedStatus, sortOrder]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== "all" ||
    selectedStatus !== "all" ||
    sortOrder !== "newest";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedStatus("all");
    setSortOrder("newest");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Title and Create Action */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Ticket Management
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Search, filter, and inspect customer support requests
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchTickets}
              disabled={loading}
              className="p-2 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              title="Refresh tickets"
              aria-label="Refresh tickets"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <Link
              href="/tickets/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
            >
              <PlusCircle size={16} />
              New Ticket
            </Link>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="lg:col-span-5 relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ticket ID or description..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
              />
            </div>

            {/* Category Filter */}
            <div className="lg:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-700"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="lg:col-span-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-700"
              >
                {STATUSES.map((st) => (
                  <option key={st.value} value={st.value}>
                    {st.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div className="lg:col-span-2">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-700"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Active Filter Indicators & Reset */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>
              Showing{" "}
              <strong className="text-slate-700">
                {filteredTickets.length}
              </strong>{" "}
              of <strong className="text-slate-700">{tickets.length}</strong>{" "}
              tickets
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
              >
                <XCircle size={14} />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Tickets Content Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          {loading && <LoadingSpinner message="Fetching support tickets..." />}

          {!loading && error && (
            <ErrorMessage
              title="Could not load tickets"
              message={error}
              onRetry={fetchTickets}
            />
          )}

          {!loading && !error && tickets.length === 0 && (
            <EmptyState
              title="No tickets in the system"
              description="No support tickets have been created yet. Submit a new ticket to test AI classification."
              action={
                <Link
                  href="/tickets/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg"
                >
                  <PlusCircle size={15} />
                  Create Ticket
                </Link>
              }
            />
          )}

          {!loading && !error && tickets.length > 0 && filteredTickets.length === 0 && (
            <EmptyState
              title="No matching tickets"
              description="No tickets match your search or filter criteria. Try resetting filters."
              action={
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100"
                >
                  Reset all filters
                </button>
              }
            />
          )}

          {!loading && !error && filteredTickets.length > 0 && (
            <TicketTable tickets={filteredTickets} showAll={true} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
