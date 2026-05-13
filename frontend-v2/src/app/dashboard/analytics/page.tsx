"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Activity, BarChart3, TrendingUp, AlertTriangle, Filter, ChevronDown, Download } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, ComposedChart, Line
} from "recharts";
import { useTheme } from "@/components/theme-provider";

const systemMetrics = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  predictions: Math.floor(Math.random() * 50) + 10,
  latency: Math.floor(Math.random() * 300) + 100,
  errors: Math.random() > 0.8 ? Math.floor(Math.random() * 5) : 0,
}));

const diagnosticDistribution = [
  { name: "Respiratory", value: 45, fill: "#2563eb" },
  { name: "Dermatological", value: 25, fill: "#0ea5e9" },
  { name: "Metabolic", value: 20, fill: "#8b5cf6" },
  { name: "Cardiovascular", value: 10, fill: "#f43f5e" },
];

export default function AnalyticsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const tooltipStyle = {
    background: isDark ? "#18181b" : "#ffffff",
    border: `1px solid ${isDark ? "#27272a" : "#e2e8f0"}`,
    borderRadius: "8px",
    fontSize: "12px",
    color: isDark ? "#e4e4e7" : "#1e293b",
    boxShadow: isDark ? "0 4px 12px rgba(0,0,0,0.3)" : "0 4px 12px rgba(0,0,0,0.08)",
  };

  const gridColor = isDark ? "#27272a" : "#f1f5f9";
  const axisColor = isDark ? "#71717a" : "#94a3b8";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader title="Platform Analytics" description="Enterprise telemetry and model performance" />
        <div className="flex items-center gap-2">
          <select defaultValue="24h" className="w-[140px] h-9 text-[12px] rounded-lg border border-border bg-background px-3 py-2 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer">
            <option value="1h">Last 1 Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <Button variant="outline" size="icon" className="h-9 w-9"><Filter className="w-4 h-4" /></Button>
          <Button variant="outline" size="sm" className="h-9"><Download className="w-4 h-4 mr-2" /> Export</Button>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Requests", value: "24.5k", change: "+12%", trend: "up" },
          { label: "Avg Latency", value: "124ms", change: "-5ms", trend: "up" },
          { label: "P99 Latency", value: "412ms", change: "+12ms", trend: "down" },
          { label: "Error Rate", value: "0.01%", change: "-0.05%", trend: "up" },
        ].map((kpi, i) => (
          <Card key={i} className="shadow-sm border-border">
            <CardContent className="p-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">{kpi.label}</span>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-heading">{kpi.value}</span>
                <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${
                  kpi.trend === 'up' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'
                }`}>{kpi.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2 shadow-sm border-border overflow-hidden">
          <CardHeader className="border-b border-border bg-surface/30 py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" /> API Traffic & Latency
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={systemMetrics} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: axisColor }} dy={10} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: axisColor }} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: axisColor }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar yAxisId="left" dataKey="predictions" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Line yAxisId="right" type="monotone" dataKey="latency" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Breakdown */}
        <Card className="shadow-sm border-border">
          <CardHeader className="border-b border-border bg-surface/30 py-3">
            <CardTitle className="text-sm font-semibold">Diagnostic Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {diagnosticDistribution.map((d) => (
                <div key={d.name}>
                  <div className="flex items-center justify-between text-[12px] font-medium mb-1.5">
                    <span className="text-heading">{d.name}</span>
                    <span className="text-muted-foreground">{d.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-surface rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${d.value}%`, backgroundColor: d.fill }} />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-primary-subtle rounded-xl border border-primary/20">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-primary mb-2">AI Forecasting</h4>
              <p className="text-[12px] text-muted-foreground leading-relaxed">
                Respiratory diagnostic requests are projected to increase by 15% next week due to seasonal trends in the region.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
