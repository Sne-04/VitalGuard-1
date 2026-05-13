"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle, CheckCircle2, Shield, TrendingUp, Brain, Activity
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer
} from "recharts";
import api from "@/lib/api";
import Link from "next/link";

interface Prediction {
  _id: string;
  symptoms: string[];
  symptomDuration: number;
  disease: { name: string; confidence: number };
  severity: { level: string; confidence: number };
  riskTimeline: {
    timeline: { day: number; risk_score: number; status: string }[];
    peak_risk_day: number;
    trend: string;
    recommendations: string[];
  };
  triage: {
    level: string;
    title: string;
    message: string;
    urgency_score: number;
    color: string;
    actions: string[];
  };
  explainability: {
    summary: string;
    explanation: string;
    chartData: { labels: string[]; values: number[]; colors: string[] };
  };
}

export default function ResultsPage() {
  const params = useParams();
  const { getToken } = useAuth();
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const token = await getToken();
        if (token) localStorage.setItem("token", token);
        const res = await api.get(`/predict/${params.id}`);
        setPrediction(res.data.data);
      } catch {
        // fallback: check if we have it in navigation state
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [params.id, getToken]);

  if (loading) {
    return (
      <div className="max-w-4xl space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-32" /><Skeleton className="h-32" /><Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="max-w-4xl space-y-4">
        <PageHeader title="Result Not Found" />
        <Card><CardContent><p className="text-sm text-muted">This prediction could not be loaded.</p></CardContent></Card>
      </div>
    );
  }

  const p = prediction;
  const severityColor = p.severity.level === "Severe" ? "danger" : p.severity.level === "Moderate" ? "warning" : "success";
  const triageIcon = p.triage.level === "EMERGENCY" ? AlertTriangle : p.triage.level === "VISIT_DOCTOR" ? Shield : CheckCircle2;
  const TriageIcon = triageIcon;

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title="Analysis Results"
        description={`Analyzed ${p.symptoms.length} symptoms over ${p.symptomDuration} days`}
        actions={
          <Button variant="secondary" size="sm" asChild>
            <Link href="/dashboard/history">View History</Link>
          </Button>
        }
      />

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Disease */}
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-muted uppercase tracking-wider">Predicted Condition</span>
            </div>
            <p className="text-xl font-bold text-heading">{p.disease.name}</p>
            <p className="text-sm text-muted mt-1">{p.disease.confidence.toFixed(1)}% confidence</p>
          </CardContent>
        </Card>

        {/* Severity */}
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-muted uppercase tracking-wider">Severity</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={severityColor as any}>{p.severity.level}</Badge>
            </div>
            <p className="text-sm text-muted mt-2">{p.severity.confidence.toFixed(1)}% confidence</p>
          </CardContent>
        </Card>

        {/* Triage */}
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 mb-3">
              <TriageIcon className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-muted uppercase tracking-wider">Triage</span>
            </div>
            <p className="text-sm font-semibold text-heading">{p.triage.title}</p>
            <p className="text-xs text-muted mt-1">{p.triage.message}</p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Risk Timeline
            </CardTitle>
            <Badge variant="outline">{p.riskTimeline.trend}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={p.riskTimeline.timeline}>
                <defs>
                  <linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={(v) => `Day ${v}`} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} width={30} />
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid #1e293b", borderRadius: "8px", fontSize: "12px", color: "#e2e8f0" }} />
                <Area type="monotone" dataKey="risk_score" stroke="#3b82f6" strokeWidth={2} fill="url(#riskFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Explainability */}
      {p.explainability?.chartData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" /> AI Explainability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{p.explainability.summary}</p>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={p.explainability.chartData.labels.map((label, i) => ({ name: label, weight: p.explainability.chartData.values[i] }))} layout="vertical">
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} width={100} />
                  <Bar dataKey="weight" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {p.riskTimeline.recommendations && (
        <Card>
          <CardHeader><CardTitle>Recommendations</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {p.riskTimeline.recommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
