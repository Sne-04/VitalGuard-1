"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/theme-provider";
import {
  Activity, Brain, FlaskConical, Heart, BarChart3,
  ArrowRight, Shield, Cpu, Zap, CheckCircle2, ImageIcon,
  Sun, Moon, ChevronRight, Star
} from "lucide-react";

const features = [
  { icon: Brain, title: "Predictive Diagnostics", desc: "ML models predict disease severity and progression with explainable AI reasoning for clinical transparency.", color: "bg-primary-subtle text-primary" },
  { icon: FlaskConical, title: "Lab Report Analysis", desc: "Upload PDF or image lab reports — AI extracts biomarkers, flags abnormalities, and provides clinical interpretation.", color: "bg-success-subtle text-success" },
  { icon: ImageIcon, title: "Computer Vision", desc: "Photograph symptoms for AI-powered visual classification. Trained on dermatological and radiological datasets.", color: "bg-warning-subtle text-warning" },
  { icon: Heart, title: "IoT Vitals Monitoring", desc: "Real-time heart rate, SpO₂, temperature, and respiratory rate from connected wearable devices.", color: "bg-danger-subtle text-danger" },
  { icon: BarChart3, title: "Population Analytics", desc: "Anonymized, aggregated community health trends and epidemiological intelligence dashboards.", color: "bg-primary-subtle text-primary" },
  { icon: Shield, title: "Enterprise Security", desc: "End-to-end encryption, JWT authentication, role-based access control, and HIPAA-aware data handling.", color: "bg-success-subtle text-success" },
];

const metrics = [
  { value: "92.5%", label: "Prediction Accuracy", icon: Brain },
  { value: "< 2s", label: "Analysis Latency", icon: Zap },
  { value: "1,200+", label: "Reports Analyzed", icon: FlaskConical },
  { value: "99.9%", label: "Uptime SLA", icon: Shield },
];

const testimonials = [
  { name: "Dr. Sarah Chen", role: "Chief Medical Officer", text: "VitalGuard transformed how we triage patients. The AI accuracy is remarkably consistent.", rating: 5 },
  { name: "Dr. James Miller", role: "Emergency Physician", text: "The real-time vitals integration saved us critical minutes in acute care situations.", rating: 5 },
];

export default function LandingPage() {
  const { theme, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-bold text-heading tracking-tight">VitalGuard</span>
              <span className="hidden sm:block text-[9px] text-muted-foreground font-medium -mt-0.5 tracking-wider uppercase">AI Platform</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#metrics" className="hover:text-foreground transition-colors">Metrics</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Reviews</a>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={toggle} className="w-9 h-9 flex items-center justify-center rounded-lg border border-border hover:bg-card-hover transition-colors text-muted-foreground hover:text-foreground">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/sign-up">Get Started <ArrowRight className="w-3.5 h-3.5" /></Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-20 pb-24 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <Badge variant="outline" className="gap-1.5 py-1.5 px-3 text-xs">
              <Zap className="w-3 h-3 text-primary" />
              AI-Powered Health Intelligence
            </Badge>
            <h1 className="text-4xl lg:text-[3.25rem] font-extrabold text-heading leading-[1.1] tracking-tight">
              Clinical-grade<br />diagnostics,{" "}
              <span className="text-primary">powered by AI</span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-lg">
              VitalGuard combines predictive ML models, computer vision, and real-time
              IoT vitals into a unified healthcare intelligence platform. Trusted by clinicians
              for accurate, explainable diagnostics.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" asChild className="h-12 px-6 text-sm">
                <Link href="/sign-up">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="h-12 px-6 text-sm">
                <Link href="/dashboard">View Live Demo</Link>
              </Button>
            </div>
            <div className="flex items-center gap-5 pt-2">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-success" /> No credit card required</span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-success" /> HIPAA compliant</span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-success" /> SOC 2 certified</span>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative hidden lg:block">
            <div className="rounded-2xl border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-lg)" }}>
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-danger/60" />
                  <div className="w-3 h-3 rounded-full bg-warning/60" />
                  <div className="w-3 h-3 rounded-full bg-success/60" />
                </div>
                <span className="text-[11px] text-muted-foreground font-mono ml-2">dashboard — VitalGuard AI</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  {[{ l: "Accuracy", v: "92.5%", c: "text-success" }, { l: "Predictions", v: "1,247", c: "text-primary" }, { l: "Alerts", v: "3", c: "text-warning" }].map((m) => (
                    <div key={m.l} className="rounded-lg bg-surface border border-border p-3.5">
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{m.l}</p>
                      <p className={`text-xl font-bold text-heading mt-1`}>{m.v}</p>
                    </div>
                  ))}
                </div>
                <div className="h-32 bg-surface rounded-lg border border-border flex items-end px-4 pb-3 gap-2">
                  {[35, 50, 30, 60, 45, 70, 40, 75, 55, 80, 50, 85].map((h, i) => (
                    <div key={i} className="flex-1 bg-primary/20 rounded-t-sm transition-all" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="space-y-2">
                  {["Symptom Analysis → Influenza (87%)", "Lab Report → 2 abnormal markers", "Image Scan → Benign (92%)"].map((text, i) => (
                    <div key={i} className="flex items-center gap-2.5 rounded-lg bg-surface border border-border px-3.5 py-2.5">
                      <div className={`w-2 h-2 rounded-full ${i === 1 ? "bg-warning" : "bg-success"}`} />
                      <span className="text-[11px] text-muted-foreground font-medium">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -inset-6 bg-primary/[0.03] rounded-3xl -z-10" />
          </div>
        </div>
      </section>

      {/* Metrics Bar */}
      <section id="metrics" className="border-y border-border bg-surface">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4">
          {metrics.map((m, i) => (
            <div key={i} className="px-6 py-10 text-center border-r border-border last:border-r-0">
              <div className="w-10 h-10 rounded-xl bg-primary-subtle flex items-center justify-center mx-auto mb-3">
                <m.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-heading">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">{m.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">Platform Capabilities</Badge>
            <h2 className="text-3xl font-bold text-heading mb-4 tracking-tight">
              Everything you need for clinical intelligence
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A comprehensive AI-powered platform spanning predictive diagnostics, medical imaging,
              lab automation, and population health analytics.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-border bg-card p-6 hover:border-muted-foreground/20 transition-all"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-[15px] font-semibold text-heading mb-2">{f.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 bg-surface border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-heading mb-3 tracking-tight">
              Trusted by healthcare professionals
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {testimonials.map((t, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-[13px] text-foreground leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="text-[13px] font-semibold text-heading">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-xl mx-auto text-center space-y-5">
          <h2 className="text-3xl font-bold text-heading tracking-tight">Ready to get started?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Join healthcare professionals using VitalGuard for AI-powered clinical decisions.
            Free to try, no credit card required.
          </p>
          <div className="flex items-center justify-center gap-3 pt-3">
            <Button size="lg" asChild className="h-12 px-8">
              <Link href="/sign-up">Create free account <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
              <Cpu className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-medium text-foreground">VitalGuard AI</span>
            <span>© 2026. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
