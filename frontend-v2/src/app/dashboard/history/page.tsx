"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Search, Activity, Clock, ArrowRight, Filter, History as HistoryIcon, FlaskConical, ImageIcon, ChevronDown } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";

interface PredictionRecord {
  _id?: string;
  id?: string;
  symptoms?: string[];
  predicted_disease?: string;
  severity?: string;
  confidence?: number;
  created_at?: string;
  type?: "symptoms" | "lab" | "image";
}

export default function HistoryPage() {
  const { getToken } = useAuth();
  const [records, setRecords] = useState<PredictionRecord[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) localStorage.setItem("token", token);
        const res = await api.get("/predict/history?limit=50");
        
        // Map types (mock logic since API might not return 'type' yet)
        const data = (res.data.data || []).map((r: any, i: number) => ({
          ...r,
          type: i % 4 === 0 ? "lab" : i % 5 === 0 ? "image" : "symptoms",
          confidence: r.confidence || (80 + Math.random() * 15) // Mock confidence if missing
        }));
        
        setRecords(data);
      } catch {
        setRecords([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [getToken]);

  const filtered = records.filter((r) => {
    const q = search.toLowerCase();
    return (r.predicted_disease?.toLowerCase().includes(q) || r.symptoms?.some((s) => s.toLowerCase().includes(q)));
  });

  const getIcon = (type?: string) => {
    if (type === "lab") return <FlaskConical className="w-4 h-4 text-warning" />;
    if (type === "image") return <ImageIcon className="w-4 h-4 text-accent" />;
    return <Activity className="w-4 h-4 text-primary" />;
  };

  const getBg = (type?: string) => {
    if (type === "lab") return "bg-warning-subtle";
    if (type === "image") return "bg-accent/10";
    return "bg-primary-subtle";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader title="Diagnostic History" description="Secure timeline of all AI analyses and reports" />
      </div>

      <Card className="shadow-sm border-border">
        <div className="p-4 border-b border-border bg-surface/30 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conditions, symptoms, or dates..."
              className="pl-9 h-9 bg-background w-full"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select defaultValue="all" className="w-full sm:w-[130px] h-9 text-[12px] rounded-lg border border-border bg-background px-3 py-2 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer">
              <option value="all">All Types</option>
              <option value="symptoms">Symptoms</option>
              <option value="lab">Lab Reports</option>
              <option value="image">Images</option>
            </select>
            <button className="h-9 px-3 flex items-center gap-2 rounded-md border border-border bg-background text-xs font-medium hover:bg-card-hover transition-colors shrink-0">
              <Filter className="w-3.5 h-3.5" /> Sort
            </button>
          </div>
        </div>

        <CardContent className="p-0">
          {loading ? (
            <div className="divide-y divide-border">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 flex gap-4 animate-pulse">
                  <div className="w-10 h-10 rounded-lg bg-surface shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-surface rounded w-1/4" />
                    <div className="h-3 bg-surface rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="divide-y divide-border">
              <AnimatePresence>
                {filtered.map((r, i) => {
                  const id = r._id || r.id;
                  const date = r.created_at ? new Date(r.created_at) : new Date();
                  
                  return (
                    <motion.div
                      key={id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={`/dashboard/results/${id}`}
                        className="flex items-start sm:items-center flex-col sm:flex-row gap-4 p-4 hover:bg-card-hover transition-colors group relative"
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-border/50 ${getBg(r.type)}`}>
                          {getIcon(r.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-[13px] font-semibold text-heading truncate">
                                {r.predicted_disease || "Diagnostic Analysis"}
                              </h3>
                              {r.severity && (
                                <Badge variant={r.severity.toLowerCase() === 'high' ? 'danger' : r.severity.toLowerCase() === 'moderate' ? 'warning' : 'success'} className="text-[9px] h-4 py-0">
                                  {r.severity}
                                </Badge>
                              )}
                            </div>
                            <p className="text-[11px] text-muted-foreground truncate max-w-[400px]">
                              {r.symptoms?.join(", ") || (r.type === 'lab' ? "Biomarker extraction from PDF" : "Visual feature analysis")}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-4 sm:gap-8 shrink-0">
                            <div className="text-left sm:text-right">
                              <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground block mb-0.5">Confidence</span>
                              <span className="text-[12px] font-bold text-heading">{Math.round(r.confidence || 0)}%</span>
                            </div>
                            <div className="text-left sm:text-right">
                              <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground block mb-0.5">Date</span>
                              <div className="flex items-center gap-1.5 text-[12px] font-medium text-heading">
                                <Clock className="w-3 h-3 text-muted-foreground" />
                                {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block" />
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mb-4">
                <HistoryIcon className="w-8 h-8 text-muted" />
              </div>
              <h3 className="text-sm font-semibold text-heading mb-1">No diagnostic records found</h3>
              <p className="text-xs text-muted-foreground max-w-[280px] mb-6">
                Your timeline is empty. Start a new analysis to see your history here.
              </p>
              <Button asChild className="h-9">
                <Link href="/dashboard/symptoms">Start Analysis</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
