"use client";

import { Bell, Search, ChevronDown } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import { useTheme } from "@/components/theme-provider";

export function Topbar() {
  const { user } = useUser();
  const { theme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-[60px] items-center justify-between border-b border-border bg-surface/80 backdrop-blur-md px-6">
      {/* Left: Search */}
      <div className="flex items-center flex-1">
        <button className="flex items-center gap-2.5 w-[320px] h-9 px-3.5 rounded-lg border border-border bg-background text-sm text-muted hover:border-muted-foreground/40 transition-colors">
          <Search className="w-4 h-4 shrink-0 text-muted" />
          <span className="flex-1 text-left text-[13px]">Search or press</span>
          <kbd className="text-[11px] border border-border px-1.5 py-0.5 rounded font-medium bg-surface text-muted-foreground">⌘K</kbd>
        </button>
      </div>

      {/* Right: Workspace + Bell + Avatar */}
      <div className="flex items-center gap-3">
        {/* Workspace Switcher */}
        <button className="flex items-center gap-2 h-9 px-3.5 rounded-lg border border-border bg-background hover:bg-card-hover transition-colors text-[13px] font-medium text-heading">
          <div className="w-5 h-5 rounded bg-primary/15 text-primary flex items-center justify-center">
            <svg viewBox="0 0 16 16" className="w-3 h-3" fill="currentColor"><path d="M8 0L0 4l8 4 8-4L8 0zM0 8l8 4 8-4M0 12l8 4 8-4"/></svg>
          </div>
          <span>Health Workspace</span>
          <ChevronDown className="w-3.5 h-3.5 text-muted" />
        </button>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card-hover transition-colors border border-border bg-background">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center min-w-[18px] min-h-[18px]">3</span>
        </button>

        {/* Avatar */}
        <UserButton
          appearance={{
            elements: { avatarBox: "w-9 h-9 rounded-full border-2 border-border shadow-sm" },
          }}
        />
        <ChevronDown className="w-3.5 h-3.5 text-muted -ml-1" />
      </div>
    </header>
  );
}
