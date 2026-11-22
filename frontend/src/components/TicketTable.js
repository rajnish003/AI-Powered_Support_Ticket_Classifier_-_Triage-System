import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import CategoryBadge from "@/components/CategoryBadge";
import { ExternalLink } from "lucide-react";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function truncate(str, max = 70) {
  if (!str) return "";
  return str.length > max ? str.slice(0, max) + "…" : str;
}

export default function TicketTable({ tickets, showAll = true }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="pb-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide w-14">
              ID
            </th>
            <th className="pb-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Complaint
            </th>
            <th className="pb-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide w-28 hidden sm:table-cell">
              Category
            </th>
            {showAll && (
              <th className="pb-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide w-24 hidden lg:table-cell">
                Confidence
              </th>
            )}
            <th className="pb-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide w-28 hidden md:table-cell">
              Status
            </th>
            {showAll && (
              <th className="pb-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide w-28 hidden xl:table-cell">
                Date
              </th>
            )}
            <th className="pb-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide w-20">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              className="hover:bg-slate-50/60 transition-colors group"
            >
              <td className="py-3.5 pr-4 text-xs font-mono font-medium text-slate-500">
                #{ticket.id}
              </td>
              <td className="py-3.5 pr-4">
                <p className="text-slate-700 font-medium leading-snug">
                  {truncate(ticket.ticket_text)}
                </p>
                {/* Mobile view inline badges */}
                <div className="flex flex-wrap items-center gap-2 mt-1 sm:hidden">
                  <CategoryBadge category={ticket.category} />
                  <StatusBadge status={ticket.status} />
                  {ticket.confidence != null && (
                    <span className="text-[11px] text-slate-400">
                      {(ticket.confidence * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
              </td>
              <td className="py-3.5 pr-4 hidden sm:table-cell">
                <CategoryBadge category={ticket.category} />
              </td>
              {showAll && (
                <td className="py-3.5 pr-4 hidden lg:table-cell text-xs font-medium text-slate-600">
                  {ticket.confidence != null
                    ? `${(ticket.confidence * 100).toFixed(1)}%`
                    : "—"}
                </td>
              )}
              <td className="py-3.5 pr-4 hidden md:table-cell">
                <StatusBadge status={ticket.status} />
              </td>
              {showAll && (
                <td className="py-3.5 pr-4 text-xs text-slate-400 hidden xl:table-cell">
                  {formatDate(ticket.created_at)}
                </td>
              )}
              <td className="py-3.5 text-right">
                <Link
                  href={`/tickets/${ticket.id}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <ExternalLink size={12} />
                  Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
