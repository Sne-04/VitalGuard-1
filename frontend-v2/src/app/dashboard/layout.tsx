"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-[240px] flex flex-col min-h-screen transition-all duration-200">
        <Topbar />
        <main className="flex-1 p-6 min-w-0">
          <div className="max-w-[1300px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
