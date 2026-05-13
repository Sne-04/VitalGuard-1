"use client";

import { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { MetricCard } from "@/components/dashboard/metric-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Thermometer, Wind, Droplets, Wifi, WifiOff, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useTheme } from "@/components/theme-provider";

function generateVitalData(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    time: `${i}s`,
    heartRate: 70 + Math.floor(Math.random() * 20),
    spo2: 95 + Math.floor(Math.random() * 5),
    temp: +(36.5 + Math.random() * 1.5).toFixed(1),
    respRate: 14 + Math.floor(Math.random() * 6),
  }));
}

export default function VitalsPage() {
  const [connected, setConnected] = useState(false);
  const [data, setData] = useState(generateVitalData(20));
  const interval = useRef<NodeJS.Timeout | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const latest = data[data.length - 1];

  const tooltipStyle = {
    background: isDark ? "#18181b" : "#ffffff",
    border: `1px solid ${isDark ? "#27272a" : "#e2e8f0"}`,
    borderRadius: "10px",
    fontSize: "12px",
    color: isDark ? "#e4e4e7" : "#1e293b",
    boxShadow: isDark ? "0 4px 12px rgba(0,0,0,0.3)" : "0 4px 12px rgba(0,0,0,0.08)",
  };
  const gridColor = isDark ? "#27272a" : "#f1f5f9";
  const axisColor = isDark ? "#71717a" : "#94a3b8";

  const toggleConnection = () => {
    if (connected) {
      if (interval.current) clearInterval(interval.current);
      setConnected(false);
    } else {
      setConnected(true);
      interval.current = setInterval(() => {
        setData((prev) => {
          const newPoint = {
            time: `${prev.length}s`,
            heartRate: 70 + Math.floor(Math.random() * 20),
            spo2: 95 + Math.floor(Math.random() * 5),
            temp: +(36.5 + Math.random() * 1.5).toFixed(1),
            respRate: 14 + Math.floor(Math.random() * 6),
          };
          return [...prev.slice(-29), newPoint];
        });
      }, 1500);
    }
  };

  useEffect(() => { return () => { if (interval.current) clearInterval(interval.current); }; }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="IoT Vitals"
        description="Real-time health metrics from connected wearables"
        actions={
          <button
            onClick={toggleConnection}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all border ${
              connected
                ? "bg-success-subtle text-success border-success/20"
                : "bg-card text-muted-foreground border-border hover:border-muted-foreground/30 hover:bg-card-hover"
            }`}
          >
            {connected ? <><Wifi className="w-3.5 h-3.5" /> Connected — Live</> : <><WifiOff className="w-3.5 h-3.5" /> Connect Device</>}
          </button>
        }
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard title="Heart Rate" value={`${latest.heartRate} bpm`} icon={<Heart className="w-4 h-4" />}
          change={latest.heartRate > 85 ? "Elevated" : "Normal"} trend={latest.heartRate > 85 ? "up" : "flat"} iconBg="bg-danger-subtle text-danger" />
        <MetricCard title="SpO₂" value={`${latest.spo2}%`} icon={<Droplets className="w-4 h-4" />}
          change="Normal" trend="flat" iconBg="bg-primary-subtle text-primary" />
        <MetricCard title="Temperature" value={`${latest.temp}°C`} icon={<Thermometer className="w-4 h-4" />}
          change={latest.temp > 37.5 ? "Elevated" : "Normal"} trend={latest.temp > 37.5 ? "up" : "flat"} iconBg="bg-warning-subtle text-warning" />
        <MetricCard title="Resp. Rate" value={`${latest.respRate}/min`} icon={<Wind className="w-4 h-4" />}
          change="Normal" trend="flat" iconBg="bg-success-subtle text-success" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Heart className="w-4 h-4 text-danger" /> Heart Rate</CardTitle>
            <p className="text-xs text-muted-foreground">Beats per minute over time</p>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: axisColor }} />
                  <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: axisColor }} width={28} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="heartRate" stroke="#dc2626" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Droplets className="w-4 h-4 text-primary" /> Blood Oxygen (SpO₂)</CardTitle>
            <p className="text-xs text-muted-foreground">Oxygen saturation percentage</p>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: axisColor }} />
                  <YAxis domain={[90, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: axisColor }} width={28} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="spo2" stroke="#2563eb" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Thermometer className="w-4 h-4 text-warning" /> Temperature</CardTitle>
            <p className="text-xs text-muted-foreground">Body temperature in Celsius</p>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: axisColor }} />
                  <YAxis domain={[36, 39]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: axisColor }} width={28} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="temp" stroke="#d97706" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Wind className="w-4 h-4 text-success" /> Respiratory Rate</CardTitle>
            <p className="text-xs text-muted-foreground">Breaths per minute</p>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: axisColor }} />
                  <YAxis domain={[10, 24]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: axisColor }} width={28} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="respRate" stroke="#16a34a" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
