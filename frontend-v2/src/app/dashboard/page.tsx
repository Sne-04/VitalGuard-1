"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity, Heart, FlaskConical, TrendingUp,
  ArrowRight, Clock, AlertTriangle, ShieldCheck, ImageIcon,
  ChevronRight, ChevronDown, Sparkles, Plus, CheckCircle2, MessageSquare
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { useTheme } from "@/components/theme-provider";
import { useUser } from "@clerk/nextjs";

/* ── Chart Data ── */
const healthTrendData = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    healthScore: Math.round(75 + Math.sin(i * 0.3) * 8 + (i > 20 ? 4 : 0)),
    riskLevel: Math.round(20 - Math.sin(i * 0.3) * 6 + (i > 25 ? 8 : 0)),
  };
});

/* ── Sparkline SVG component ── */
function Sparkline({ color = "#4361ee", data }: { color?: string; data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 80},${30 - ((v - min) / range) * 25}`).join(" ");
  return (
    <svg width="80" height="30" viewBox="0 0 80 30" className="opacity-50">
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
}

const sparkHealthData = [70, 72, 78, 80, 82, 85, 87, 84, 86, 87];
const sparkAlertData = [5, 3, 4, 2, 3, 2, 1, 2, 2, 2];
const sparkRiskData = [30, 28, 25, 22, 20, 18, 15, 14, 12, 10];
const sparkAnalysesData = [3, 5, 4, 6, 2, 5, 7, 4, 3, 5];

/* ── Activity Items ── */
const recentActivity = [
  { id: 1, title: "Symptom check completed", desc: "Headache, Fatigue, Dizziness", time: "2m ago", icon: CheckCircle2, color: "text-success", bg: "bg-success-subtle" },
  { id: 2, title: "Image analysis completed", desc: "Chest X-ray • Normal", time: "15m ago", icon: ImageIcon, color: "text-primary", bg: "bg-primary-subtle" },
  { id: 3, title: "Lab report analyzed", desc: "Blood Test • 3 abnormal", time: "1h ago", icon: FlaskConical, color: "text-danger", bg: "bg-danger-subtle" },
  { id: 4, title: "IoT vitals synced", desc: "Heart Rate: 72 bpm", time: "2h ago", icon: Heart, color: "text-warning", bg: "bg-warning-subtle" },
  { id: 5, title: "AI insights generated", desc: "Weekly health summary", time: "3h ago", icon: Sparkles, color: "text-accent", bg: "bg-primary-subtle" },
];

const quickActions = [
  { label: "Symptom Checker", href: "/dashboard/symptoms", icon: Activity },
  { label: "Image Analysis", href: "/dashboard/image", icon: ImageIcon },
  { label: "Lab Reports", href: "/dashboard/lab", icon: FlaskConical },
  { label: "IoT Vitals", href: "/dashboard/vitals", icon: Heart },
];

export default function DashboardPage() {
  const { theme } = useTheme();
  const { user } = useUser();
  const isDark = theme === "dark";

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const tooltipStyle = {
    background: isDark ? "#151c2c" : "#ffffff",
    border: `1px solid ${isDark ? "#1e293b" : "#e5e9f0"}`,
    borderRadius: "10px",
    fontSize: "12px",
    color: isDark ? "#cbd5e1" : "#2d3748",
    boxShadow: isDark ? "0 4px 12px rgba(0,0,0,0.4)" : "0 4px 12px rgba(0,0,0,0.08)",
  };
  const gridColor = isDark ? "#1e293b" : "#f0f4f8";
  const axisColor = isDark ? "#475569" : "#a0aec0";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-heading tracking-tight">
            {greeting()}, {user?.firstName || "there"} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Here&apos;s your health overview for today</p>
        </div>
        <Button className="h-10 px-5 rounded-xl shadow-sm font-semibold text-[13px] gap-2">
          <Plus className="w-4 h-4" /> New Analysis
          <ChevronDown className="w-3.5 h-3.5 ml-1 opacity-70" />
        </Button>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* AI Health Score */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-subtle flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                </div>
                <span className="text-[12px] font-medium text-muted-foreground">AI Health Score</span>
              </div>
              <Sparkline color={isDark ? "#818cf8" : "#4361ee"} data={sparkHealthData} />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-primary tracking-tight">87</span>
              <span className="text-sm text-muted-foreground font-medium">/100</span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3 text-success" />
              <span className="text-[11px] text-success font-medium">12% from last week</span>
            </div>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-danger-subtle flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-danger" />
                </div>
                <span className="text-[12px] font-medium text-muted-foreground">Active Alerts</span>
              </div>
              <Sparkline color={isDark ? "#f87171" : "#ef4444"} data={sparkAlertData} />
            </div>
            <span className="text-3xl font-extrabold text-danger tracking-tight">2</span>
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-danger inline-block" />
              Requires attention
            </p>
          </CardContent>
        </Card>

        {/* Risk Level */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-success-subtle flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-success" />
                </div>
                <span className="text-[12px] font-medium text-muted-foreground">Risk Level</span>
              </div>
              <Sparkline color={isDark ? "#34d399" : "#10b981"} data={sparkRiskData} />
            </div>
            <span className="text-3xl font-extrabold text-success tracking-tight">Low</span>
            <p className="text-[11px] text-muted-foreground mt-2">Your health is stable</p>
          </CardContent>
        </Card>

        {/* Total Analyses */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-subtle flex items-center justify-center">
                  <Activity className="w-4 h-4 text-primary" />
                </div>
                <span className="text-[12px] font-medium text-muted-foreground">Total Analyses</span>
              </div>
              <Sparkline color={isDark ? "#818cf8" : "#4361ee"} data={sparkAnalysesData} />
            </div>
            <span className="text-3xl font-extrabold text-primary tracking-tight">24</span>
            <p className="text-[11px] text-muted-foreground mt-2">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Main Content Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Health Trend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-[14px] font-semibold">Health Trend <span className="text-muted-foreground font-normal">(Last 30 Days)</span></CardTitle>
                <div className="flex items-center gap-4 mt-2 text-[11px] font-medium">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary" /> Health Score</div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent" /> Risk Level</div>
                </div>
              </div>
              <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border bg-background text-[12px] font-medium text-muted-foreground hover:bg-card-hover transition-colors">
                30 Days <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={healthTrendData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isDark ? "#6366f1" : "#4361ee"} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={isDark ? "#6366f1" : "#4361ee"} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="fillRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isDark ? "#22d3ee" : "#06b6d4"} stopOpacity={0.1} />
                      <stop offset="95%" stopColor={isDark ? "#22d3ee" : "#06b6d4"} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: axisColor }} dy={10} interval={4} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: axisColor }} domain={[0, 100]} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="healthScore" stroke={isDark ? "#6366f1" : "#4361ee"} strokeWidth={2} fill="url(#fillScore)" dot={false} activeDot={{ r: 5, fill: isDark ? "#6366f1" : "#4361ee", stroke: "#fff", strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="riskLevel" stroke={isDark ? "#22d3ee" : "#06b6d4"} strokeWidth={2} fill="url(#fillRisk)" dot={false} activeDot={{ r: 5, fill: isDark ? "#22d3ee" : "#06b6d4", stroke: "#fff", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: AI Rec + Quick Actions */}
        <div className="space-y-5">
          {/* AI Recommendation */}
          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-[13px] font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> AI Recommendation
              </CardTitle>
              <p className="text-[11px] text-muted-foreground">Based on your recent data</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="bg-primary-subtle rounded-xl p-4 mt-2">
                <p className="text-[13px] text-foreground leading-relaxed">
                  Your sleep quality has improved by 18% this week. Keep maintaining your current routine!
                </p>
                <Link href="/dashboard/analytics" className="text-[12px] text-primary font-medium mt-3 inline-flex items-center gap-1 hover:underline">
                  View full insights <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-[13px] font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-warning" /> Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-1">
              {quickActions.map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-card-hover transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <a.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-[13px] font-medium text-heading">{a.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Bottom Row: Live Metrics + Recent Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Live Health Metrics (dark mode) / Recent Activity alt */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[14px] font-semibold">Live Health Metrics</CardTitle>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-[11px] text-success font-medium">Live</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Heart Rate", icon: Heart, value: "72", unit: "bpm", status: "Normal", color: "text-danger", bg: "bg-danger-subtle", sparkData: [68, 70, 72, 74, 72, 71, 73, 72] },
                { label: "SpO₂", icon: Activity, value: "98", unit: "%", status: "Normal", color: "text-primary", bg: "bg-primary-subtle", sparkData: [97, 98, 98, 99, 98, 97, 98, 98] },
                { label: "Body Temp.", icon: Activity, value: "36.6", unit: "°C", status: "Normal", color: "text-warning", bg: "bg-warning-subtle", sparkData: [36.4, 36.5, 36.6, 36.5, 36.6, 36.7, 36.6, 36.6] },
                { label: "Stress Level", icon: Activity, value: "Low", unit: "", status: "Normal", color: "text-success", bg: "bg-success-subtle", sparkData: [30, 28, 25, 22, 20, 18, 15, 14] },
              ].map((m) => (
                <div key={m.label} className="p-3 rounded-xl bg-surface border border-border/50">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className={`w-6 h-6 rounded-md ${m.bg} flex items-center justify-center`}>
                      <m.icon className={`w-3 h-3 ${m.color}`} />
                    </div>
                    <span className="text-[10px] font-medium text-muted-foreground">{m.label}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-heading">{m.value}</span>
                    {m.unit && <span className="text-[11px] text-muted-foreground">{m.unit}</span>}
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] text-success font-medium">{m.status}</span>
                    <Sparkline color={isDark ? "#475569" : "#a0aec0"} data={m.sparkData} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[14px] font-semibold">Recent Activity</CardTitle>
              <Link href="/dashboard/history" className="text-[12px] text-primary font-medium hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-0.5">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-lg py-2.5 px-2 hover:bg-card-hover transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.bg}`}>
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-heading leading-tight">{item.title}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{item.desc}</p>
                  </div>
                  <span className="text-[11px] text-muted shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── AI Health Assistant Bar ── */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="py-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-heading">AI Health Assistant</h3>
              <p className="text-[12px] text-muted-foreground">I&apos;m here to help you understand your health better. Ask me anything!</p>
            </div>
          </div>
          <Button variant="outline" className="rounded-xl border-primary/30 text-primary hover:bg-primary hover:text-white transition-colors gap-2">
            <MessageSquare className="w-4 h-4" /> Start Conversation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
