"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "flat";
  icon?: React.ReactNode;
  className?: string;
  iconBg?: string;
}

export function MetricCard({ title, value, change, trend, icon, className, iconBg }: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 transition-all hover:border-muted-foreground/20",
        className
      )}
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-muted-foreground">{title}</span>
        {icon && (
          <div className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center",
            iconBg || "bg-primary-subtle text-primary"
          )}>
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-heading tracking-tight leading-none">{value}</span>
      </div>
      {change && (
        <div className="mt-2 flex items-center gap-1">
          <span
            className={cn(
              "flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-md",
              trend === "up" && "text-success bg-success-subtle",
              trend === "down" && "text-danger bg-danger-subtle",
              trend === "flat" && "text-muted-foreground bg-surface"
            )}
          >
            {trend === "up" && <TrendingUp className="w-3 h-3" />}
            {trend === "down" && <TrendingDown className="w-3 h-3" />}
            {trend === "flat" && <Minus className="w-3 h-3" />}
            {change}
          </span>
          <span className="text-[11px] text-muted">vs last period</span>
        </div>
      )}
    </div>
  );
}
