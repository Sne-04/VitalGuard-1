import React from 'react';
import { Link } from 'react-router-dom';
import {
    Activity, Shield, Brain, TrendingUp, AlertTriangle,
    Watch, Camera, BarChart3, Beaker, ArrowRight,
    HeartPulse, Zap, Lock
} from 'lucide-react';
import { motion } from 'framer-motion';

const ease = [0.16, 1, 0.3, 1];

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease, delay }
});

const stagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease } }
};

export default function Home() {
    const features = [
        {
            icon: <TrendingUp className="w-5 h-5" />,
            label: 'Prediction',
            title: 'Symptom Progression',
            description: 'Predict disease severity and 7-day risk timeline with ML models trained on clinical data.',
            accent: '#3b82f6',
        },
        {
            icon: <AlertTriangle className="w-5 h-5" />,
            label: 'Triage',
            title: 'AI-Based Triage',
            description: 'Hospital-grade decision engine: Home Care, Doctor Visit, or Emergency — instantly.',
            accent: '#f59e0b',
        },
        {
            icon: <Brain className="w-5 h-5" />,
            label: 'Explainability',
            title: 'Explainable AI',
            description: 'SHAP-powered feature attribution. See exactly why the model reached its conclusion.',
            accent: '#10b981',
        },
        {
            icon: <Watch className="w-5 h-5" />,
            label: 'IoT',
            title: 'Wearable Integration',
            description: 'Sync real-time vitals — heart rate, SpO₂, temperature — directly from your smartwatch.',
            accent: '#8b5cf6',
            badge: 'New',
        },
        {
            icon: <Camera className="w-5 h-5" />,
            label: 'Vision',
            title: 'Image Diagnosis',
            description: 'Upload symptom photos for AI-powered computer vision analysis in seconds.',
            accent: '#06b6d4',
            badge: 'New',
        },
        {
            icon: <Beaker className="w-5 h-5" />,
            label: 'Lab',
            title: 'Lab Report Analyzer',
            description: 'Parse and interpret your lab reports with clinical context and risk flagging.',
            accent: '#ec4899',
            badge: 'New',
        },
        {
            icon: <BarChart3 className="w-5 h-5" />,
            label: 'Analytics',
            title: 'Population Analytics',
            description: 'Community health trends, disease heatmaps and epidemiological dashboards.',
            accent: '#6366f1',
        },
        {
            icon: <Lock className="w-5 h-5" />,
            label: 'Security',
            title: 'Secure & Private',
            description: 'Clerk-powered auth, JWT tokens, and HIPAA-aware data handling by default.',
            accent: '#64748b',
        },
    ];

    const stats = [
        { value: '92.5%', label: 'Prediction Accuracy' },
        { value: '87%',   label: 'Severity Classification' },
        { value: '95%',   label: 'Triage Accuracy' },
        { value: '<2s',   label: 'Average Response Time' },
    ];

    const steps = [
        { n: '01', title: 'Enter Symptoms',    desc: 'Type, upload an image, or let AI listen to you' },
        { n: '02', title: 'Connect Wearable',  desc: 'Sync real-time vitals from any IoT device'       },
        { n: '03', title: 'AI Analysis',       desc: 'ML + Computer Vision models process your data'   },
        { n: '04', title: 'Get Insights',      desc: 'Disease, severity, risk timeline & trends'       },
    ];

    return (
        <div className="min-h-screen">

            {/* ── Hero ──────────────────────────────────────────────── */}
            <section className="relative pt-36 pb-28 px-4 overflow-hidden">
                {/* Orb decorations */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="orb orb-blue w-[500px] h-[500px] -top-32 left-1/2 -translate-x-1/2 opacity-20" />
                    <div className="orb orb-violet w-[350px] h-[350px] top-40 -right-20 opacity-15" style={{ animationDelay: '4s' }} />
                    <div className="orb orb-teal w-[280px] h-[280px] top-60 -left-16 opacity-10" style={{ animationDelay: '8s' }} />
                </div>

                {/* Subtle grid overlay */}
                <div className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
                        backgroundSize: '64px 64px'
                    }}
                />

                <div className="max-w-5xl mx-auto text-center relative z-10">

                    <motion.div {...fadeUp(0)}>
                        <span className="section-label mb-8 inline-flex">
                            <HeartPulse className="w-3.5 h-3.5" />
                            AI-Powered Health Intelligence
                        </span>
                    </motion.div>

                    <motion.h1
                        className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.08]"
                        {...fadeUp(0.1)}
                    >
                        Your health,{' '}
                        <span className="gradient-text">understood</span>
                        <br />by AI
                    </motion.h1>

                    <motion.p
                        className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                        {...fadeUp(0.2)}
                    >
                        VitalGuard combines machine learning, IoT wearables, and computer vision
                        to give you hospital-grade health insights — right from your phone.
                    </motion.p>

                    <motion.div className="flex gap-3 justify-center flex-wrap" {...fadeUp(0.3)}>
                        <Link to="/check" className="btn-primary px-6 py-3 text-[15px]">
                            <Activity className="w-4 h-4" />
                            Start Health Check
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link to="/lab" className="btn-secondary px-6 py-3 text-[15px]">
                            <Beaker className="w-4 h-4 text-pink-400" />
                            Analyze Lab Report
                        </Link>
                    </motion.div>

                    {/* Stats Row */}
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-3xl mx-auto"
                        variants={stagger} initial="hidden" animate="show"
                    >
                        {stats.map((s, i) => (
                            <motion.div key={i} variants={item} className="stat-pill">
                                <div className="text-2xl font-bold text-white mb-0.5">{s.value}</div>
                                <div className="text-xs text-slate-500 font-medium">{s.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── Features ───────────────────────────────────────────── */}
            <section className="py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="section-label mb-4 inline-flex">
                            <Zap className="w-3.5 h-3.5" />
                            Capabilities
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4 mb-3">
                            Beyond basic symptom checking
                        </h2>
                        <p className="text-slate-400 text-base max-w-xl mx-auto">
                            A full-stack health intelligence platform with eight specialized AI modules.
                        </p>
                    </div>

                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
                        variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
                    >
                        {features.map((f, i) => (
                            <motion.div key={i} variants={item} className="feature-card group relative overflow-hidden">
                                {/* Accent line top */}
                                <div className="absolute top-0 inset-x-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-[var(--radius-card)]"
                                    style={{ background: `linear-gradient(90deg, transparent, ${f.accent}, transparent)` }}
                                />

                                {f.badge && (
                                    <span className="absolute top-3 right-3 text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                                        style={{ background: `${f.accent}22`, color: f.accent, border: `1px solid ${f.accent}44` }}>
                                        {f.badge}
                                    </span>
                                )}

                                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                                    style={{ background: `${f.accent}18`, color: f.accent }}>
                                    {f.icon}
                                </div>

                                <div className="text-[10px] font-semibold uppercase tracking-widest mb-1.5"
                                    style={{ color: f.accent }}>
                                    {f.label}
                                </div>
                                <h3 className="text-[15px] font-bold text-white mb-2 leading-snug">{f.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{f.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── How It Works ───────────────────────────────────────── */}
            <section className="py-24 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="section-label mb-4 inline-flex">
                            <Activity className="w-3.5 h-3.5" />
                            Process
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4">
                            How VitalGuard works
                        </h2>
                    </div>

                    <div className="relative">
                        {/* Connecting line */}
                        <div className="absolute left-[19px] top-6 bottom-6 w-px bg-gradient-to-b from-blue-500/40 via-violet-500/30 to-transparent hidden sm:block" />

                        <div className="space-y-8">
                            {steps.map((s, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.12, duration: 0.5, ease }}
                                    className="flex gap-5 items-start"
                                >
                                    <div className="step-badge text-sm shrink-0">{s.n}</div>
                                    <div className="surface-card flex-1 p-5">
                                        <h3 className="font-semibold text-white text-[15px] mb-1">{s.title}</h3>
                                        <p className="text-slate-500 text-sm">{s.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ────────────────────────────────────────────────── */}
            <section className="py-24 px-4">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease }}
                        className="relative overflow-hidden rounded-2xl border border-blue-500/20 p-12 text-center"
                        style={{
                            background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(139,92,246,0.05) 50%, rgba(6,182,212,0.04) 100%)'
                        }}
                    >
                        {/* Glow */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full"
                                style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)' }} />
                        </div>

                        <div className="relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-blue-600 mx-auto mb-6 flex items-center justify-center shadow-[0_0_32px_rgba(59,130,246,0.5)]">
                                <HeartPulse className="w-7 h-7 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-3">
                                Ready to check your health?
                            </h2>
                            <p className="text-slate-400 mb-8 max-w-md mx-auto">
                                Get AI-powered insights in seconds — from symptom analysis to full lab report interpretation.
                            </p>
                            <div className="flex gap-3 justify-center flex-wrap">
                                <Link to="/check" className="btn-primary px-7 py-3">
                                    <Activity className="w-4 h-4" />
                                    Start Health Check
                                </Link>
                                <Link to="/iot-vitals" className="btn-secondary px-7 py-3">
                                    <Watch className="w-4 h-4" />
                                    Connect Wearable
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Footer line ─────────────────────────────────────────── */}
            <div className="border-t border-white/5 py-8 text-center text-slate-600 text-xs">
                © 2025 VitalGuard AI · Built with ML, IoT & Computer Vision
            </div>
        </div>
    );
}
