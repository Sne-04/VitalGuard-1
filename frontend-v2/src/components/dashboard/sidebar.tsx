"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  Activity, BarChart3, History, FlaskConical, Heart,
  LayoutDashboard, ChevronLeft, ChevronsLeft, ImageIcon,
  TrendingUp, FileText, Settings, User, Sun, Moon, ChevronDown
} from "lucide-react";
import { useState } from "react";

const NAV_GROUPS = [
  {
    label: "CLINICAL TOOLS",
    items: [
      { href: "/dashboard/symptoms", icon: Activity, label: "Symptom Checker" },
      { href: "/dashboard/image", icon: ImageIcon, label: "Image Analysis" },
      { href: "/dashboard/lab", icon: FlaskConical, label: "Lab Reports" },
      { href: "/dashboard/vitals", icon: Heart, label: "IoT Vitals" },
    ],
  },
  {
    label: "ANALYTICS",
    items: [
      { href: "/dashboard/analytics", icon: TrendingUp, label: "AI Insights" },
      { href: "/dashboard/trends", icon: BarChart3, label: "Community Trends" },
    ],
  },
  {
    label: "RECORDS",
    items: [
      { href: "/dashboard/history", icon: History, label: "History" },
      { href: "/dashboard/reports", icon: FileText, label: "Saved Reports" },
    ],
  },
  {
    label: "SETTINGS",
    items: [
      { href: "/dashboard/settings", icon: Settings, label: "Settings" },
      { href: "/dashboard/profile", icon: User, label: "Profile" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useUser();
  const { theme, toggle } = useTheme();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col border-r transition-all duration-200",
        "bg-sidebar-bg border-sidebar-border",
        collapsed ? "w-[60px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 h-[60px] px-4 border-b border-sidebar-border shrink-0">
        {!collapsed ? (
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <span className="text-[14px] font-bold text-heading tracking-tight block leading-tight">VitalGuard AI</span>
              <span className="text-[10px] text-muted-foreground font-medium leading-tight block">AI Health Intelligence</span>
            </div>
          </Link>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center mx-auto">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
        )}
      </div>

      {/* Dashboard link (special - highlighted) */}
      <div className="px-3 pt-3 pb-1">
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition-all",
            pathname === "/dashboard"
              ? "bg-primary text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-sidebar-hover"
          )}
        >
          <LayoutDashboard className={cn("w-[18px] h-[18px] shrink-0", collapsed && "mx-auto")} />
          {!collapsed && <span>Dashboard</span>}
        </Link>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-sidebar-label px-3 mb-1.5 block">
                {group.label}
              </span>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all group",
                      isActive
                        ? "bg-sidebar-active text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-sidebar-hover"
                    )}
                  >
                    <item.icon className={cn("w-[16px] h-[16px] shrink-0", collapsed && "mx-auto", isActive ? "text-primary" : "text-muted group-hover:text-foreground")} />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Section: User + Theme */}
      {!collapsed && (
        <div className="border-t border-sidebar-border p-3 space-y-3">
          {/* User */}
          <div className="flex items-center gap-2.5 px-2">
            <UserButton
              appearance={{
                elements: { avatarBox: "w-8 h-8 rounded-full" },
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-heading truncate">{user?.fullName || "User"}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user?.primaryEmailAddress?.emailAddress || "user@example.com"}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted shrink-0" />
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
              {theme === "dark" ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
            </div>
            <button
              onClick={toggle}
              className={cn(
                "relative w-10 h-[22px] rounded-full transition-colors",
                theme === "dark" ? "bg-primary" : "bg-muted"
              )}
            >
              <span className={cn(
                "absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm transition-transform",
                theme === "dark" ? "left-[22px]" : "left-[3px]"
              )} />
            </button>
          </div>

          {/* Collapse */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-2 w-full px-2 py-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-sidebar-hover"
          >
            <ChevronsLeft className="w-3.5 h-3.5" />
            <span>Collapse</span>
          </button>
        </div>
      )}

      {collapsed && (
        <div className="border-t border-sidebar-border p-2 flex flex-col items-center gap-2">
          <UserButton appearance={{ elements: { avatarBox: "w-8 h-8 rounded-full" } }} />
          <button onClick={toggle} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-sidebar-hover transition-colors">
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button onClick={() => setCollapsed(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-sidebar-hover transition-colors">
            <ChevronsLeft className="w-4 h-4 rotate-180" />
          </button>
        </div>
      )}
    </aside>
  );
}
