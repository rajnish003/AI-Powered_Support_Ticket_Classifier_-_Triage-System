"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  BarChart3,
  Cpu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "All Tickets",
    href: "/tickets",
    icon: Ticket,
  },
  {
    label: "New Ticket",
    href: "/tickets/new",
    icon: PlusCircle,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar — always visible */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-slate-200 flex-shrink-0">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile sidebar — slides in */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200
          transform transition-transform duration-300 ease-in-out
          lg:hidden flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Mobile close button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>
        <SidebarContent pathname={pathname} onLinkClick={onClose} />
      </aside>
    </>
  );
}

function SidebarContent({ pathname, onLinkClick }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
          <Cpu size={16} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 leading-tight">
            AI Ticket
          </p>
          <p className="text-xs text-slate-400 leading-tight">Classifier</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Menu
        </p>
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(href + "/");

          return (
            <Link
              key={href}
              href={href}
              onClick={onLinkClick}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-colors duration-150
                ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }
              `}
            >
              <Icon
                size={18}
                className={isActive ? "text-indigo-600" : "text-slate-400"}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-100">
        <p className="text-xs text-slate-400">
          AI Ticket Classifier
        </p>
        <p className="text-xs text-slate-300">v1.0.0</p>
      </div>
    </div>
  );
}

