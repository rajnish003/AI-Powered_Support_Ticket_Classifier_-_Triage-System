"use client";

import { usePathname } from "next/navigation";
import { Menu, Bell } from "lucide-react";

const PAGE_TITLES = {
  "/": "Dashboard",
  "/tickets": "All Tickets",
  "/tickets/new": "New Ticket",
  "/analytics": "Analytics",
};

function getPageTitle(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith("/tickets/") && pathname !== "/tickets/new") {
    return "Ticket Details";
  }
  return "Dashboard";
}

function getPageDescription(pathname) {
  if (pathname === "/") return "Overview of your support ticket system";
  if (pathname === "/tickets") return "Browse, search and manage all support tickets";
  if (pathname === "/tickets/new") return "Submit a new support ticket for AI classification";
  if (pathname === "/analytics") return "In-depth ticket trends and category breakdowns";
  if (pathname.startsWith("/tickets/")) return "Full details and status management for this ticket";
  return "";
}

export default function Header({ onMenuClick }) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);
  const description = getPageDescription(pathname);

  return (
    <header className="bg-white border-b border-slate-200 flex-shrink-0">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Left: hamburger + page title */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          <div>
            <h1 className="text-lg font-semibold text-slate-900 leading-tight">
              {title}
            </h1>
            {description && (
              <p className="text-xs text-slate-400 leading-tight hidden sm:block">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Right: status indicator */}
        <div className="flex items-center gap-3">
          {/* API status dot */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Backend connected
          </div>

          {/* Notification bell (cosmetic) */}
          <button className="p-2 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <Bell size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

