import React from 'react';
import { Link } from 'react-router-dom';
import {
    Activity, Shield, Brain, TrendingUp, AlertTriangle,
    Watch, Camera, BarChart3, Beaker, ArrowRight,
    HeartPulse, Zap, Lock, Github, Linkedin, Sparkles, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import DotGrid from '../components/DotGrid';

const ease = [0.16, 1, 0.3, 1];
const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease, delay },
});
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } } };

const FEATURES = [
    { icon: <TrendingUp className="w-5 h-5" />,   label: 'Prediction',     title: 'Symptom Progression',   desc: '7-day risk timeline and severity forecasting using ML trained on clinical datasets.',      accent: '#16a34a' },
    { icon: <AlertTriangle className="w-5 h-5" />, label: 'Triage',         title: 'AI-Based Triage',       desc: 'Hospital-grade decision engine: Home Care, Doctor Visit, or Emergency — instantly.',        accent: '#ca8a04' },
    { icon: <Brain className="w-5 h-5" />,         label: 'Explainability', title: 'SHAP Explainable AI',   desc: 'Feature attribution shows exactly why the model reached its prediction.',                 accent: '#16a34a' },
    { icon: <Watch className="w-5 h-5" />,         label: 'IoT',            title: 'Wearable Integration',  desc: 'Sync real-time heart rate, SpO₂ and temperature from any smartwatch or IoT device.',      accent: '#16a34a', badge: 'New' },
    { icon: <Camera className="w-5 h-5" />,        label: 'Vision',         title: 'Image Diagnosis',       desc: 'Upload symptom photos for AI computer vision analysis in under 2 seconds.',              accent: '#16a34a', badge: 'New' },
    { icon: <Beaker className="w-5 h-5" />,        label: 'Lab',            title: 'Lab Report Analyzer',   desc: 'Parse and interpret blood reports with clinical risk flagging and trend detection.',       accent: '#16a34a', badge: 'New' },
    { icon: <BarChart3 className="w-5 h-5" />,     label: 'Analytics',      title: 'Population Analytics',  desc: 'Community health heatmaps, disease trends and epidemiological insight dashboards.',       accent: '#16a34a' },
    { icon: <Lock className="w-5 h-5" />,          label: 'Security',       title: 'Secure & Private',      desc: 'Clerk-powered auth, JWT tokens and HIPAA-aware data handling by default.',                accent: '#64748b' },
];

const STATS = [
    { value: '92.5%', label: 'Prediction Accuracy'   },
    { value: '87%',   label: 'Severity Classification' },
    { value: '95%',   label: 'Triage Accuracy'         },
    { value: '<2s',   label: 'Response Time'           },
];

const STEPS = [
    { n: '01', title: 'Enter Symptoms',   desc: 'Type, upload an image, or speak your symptoms to our AI assistant.'                },
    { n: '02', title: 'Connect Wearable', desc: 'Sync real-time vitals from your smartwatch or IoT health device.'                  },
    { n: '03', title: 'AI Analysis',      desc: 'ML and Computer Vision models process your data across 8 specialised engines.'     },
    { n: '04', title: 'Get Insights',     desc: 'Disease prediction, severity score, risk timeline and community health trends.'    },
];

const TEAM = [
    {
        name: 'Sneha Shaw',
        role: 'Full Stack Developer & AI Engineer',
        bio: 'Leads backend architecture and AI integration. Passionate about making healthcare more intelligent and accessible.',
        image: '/sneha_real.png',
        socials: { github: 'https://github.com/Sne-04', linkedin: 'https://www.linkedin.com/in/sneha-shaw23' },
    },
    {
        name: 'Baishaksi Singha',
        role: 'ML Engineer & Data Scientist',
        bio: 'Designs and trains the predictive ML models that power VitalGuard\'s clinical decision engine.',
        image: '/baishaksi.png',
        socials: { github: '#', linkedin: '#' },
    },
    {
        name: 'ShrutiKana Patra',
        role: 'Frontend Developer & UI/UX',
        bio: 'Crafts premium user experiences that make complex AI insights feel intuitive and human.',
        image: '/shrutikana.png',
        socials: { github: '#', linkedin: '#' },
    },
];

export default function Home() {
    return (
        <div className="min-h-screen">

            {/* ── HERO ──────────────────────────────────────────────── */}
            <section className="relative pt-36 pb-32 px-4 overflow-hidden"
                style={{ minHeight: '92vh', display: 'flex', alignItems: 'center' }}>

                {/* 3D Dot Grid */}
                <div className="absolute inset-0" style={{ zIndex: 0 }}>
                    <DotGrid />
                </div>

                {/* Subtle green orb — no gradient, single color */}
                <div className="orb w-[560px] h-[560px] absolute -top-40 left-1/2 -translate-x-1/2" style={{ zIndex: 1 }} />

                {/* Fine grid overlay */}
                <div className="absolute inset-0 pointer-events-none" style={{
                    zIndex: 1,
                    backgroundImage: 'linear-gradient(rgba(34,197,94,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.025) 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }} />

                <div className="max-w-5xl mx-auto text-center relative w-full" style={{ zIndex: 2 }}>

                    <motion.div {...fadeUp(0)}>
                        <span className="section-label mb-8 inline-flex">
                            <HeartPulse className="w-3.5 h-3.5" />
                            AI-Powered Health Intelligence
                        </span>
                    </motion.div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.06] mb-6"
                        {...fadeUp(0.1)}
                    >
                        Your health,{' '}
                        <span style={{ color: 'var(--accent)' }}>understood</span>
                        <br />
                        <em style={{ fontStyle: 'italic', fontWeight: 400 }}>by AI</em>
                    </h1>

                    <motion.p
                        className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
                        style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Sans, sans-serif' }}
                        {...fadeUp(0.2)}
                    >
                        VitalGuard combines machine learning, IoT wearables and computer vision
                        to deliver hospital-grade health insights — in seconds, not hours.
                    </motion.p>

                    <motion.div className="flex gap-3 justify-center flex-wrap" {...fadeUp(0.3)}>
                        <Link to="/check" className="btn-primary px-7 py-3.5 text-[15px]">
                            <Activity className="w-4 h-4" />
                            Start Health Check
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link to="/lab" className="btn-secondary px-7 py-3.5 text-[15px]">
                            <Beaker className="w-4 h-4" />
                            Analyse Lab Report
                        </Link>
                    </motion.div>

                    {/* Trust badges */}
                    <motion.div className="flex items-center justify-center gap-3 mt-10 flex-wrap" {...fadeUp(0.4)}>
                        {['TensorFlow', 'Clerk Auth', 'NeonDB', 'React 18', 'SHAP XAI'].map(t => (
                            <span key={t} className="text-xs font-medium px-3 py-1"
                                style={{ color: 'var(--text-muted)', border: '1px solid var(--border)', fontFamily: 'IBM Plex Sans, sans-serif' }}>
                                {t}
                            </span>
                        ))}
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-px mt-16 max-w-3xl mx-auto"
                        style={{ border: '1px solid var(--border)', background: 'var(--border)' }}
                        variants={stagger} initial="hidden" animate="show"
                    >
                        {STATS.map((s, i) => (
                            <motion.div key={i} variants={item} className="stat-pill">
                                <div className="text-2xl font-bold"
                                    style={{ color: 'var(--accent)', fontFamily: 'Playfair Display, serif' }}>
                                    {s.value}
                                </div>
                                <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                    {s.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── DIVIDER ────────────────────────────────────────────── */}
            <div style={{ borderTop: '1px solid var(--border)' }} />

            {/* ── FEATURES ───────────────────────────────────────────── */}
            <section className="py-28 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-16" style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '1.25rem' }}>
                        <span className="section-label mb-3 inline-flex">
                            <Zap className="w-3.5 h-3.5" />
                            Capabilities
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold mt-3"
                            style={{ fontFamily: 'Playfair Display, serif' }}>
                            Beyond basic symptom checking
                        </h2>
                        <p className="text-base mt-2" style={{ color: 'var(--text-secondary)' }}>
                            Eight specialised AI engines working in concert.
                        </p>
                    </div>

                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-px"
                        style={{ background: 'var(--border)' }}
                        variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
                    >
                        {FEATURES.map((f, i) => (
                            <motion.div key={i} variants={item}
                                className="group relative p-6 cursor-default"
                                style={{ background: 'var(--bg-surface)', transition: 'background 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-surface)'}
                            >
                                {/* Left accent bar on hover */}
                                <div className="absolute top-0 left-0 bottom-0 w-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    style={{ background: 'var(--accent)' }} />

                                {f.badge && (
                                    <span className="absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5"
                                        style={{ background: 'var(--tag-bg)', color: 'var(--accent)', border: '1px solid var(--tag-border)' }}>
                                        {f.badge}
                                    </span>
                                )}

                                <div className="w-8 h-8 flex items-center justify-center mb-4"
                                    style={{ background: 'var(--tag-bg)', color: 'var(--accent)' }}>
                                    {f.icon}
                                </div>

                                <div className="text-[10px] font-bold uppercase tracking-widest mb-1.5"
                                    style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Sans' }}>
                                    {f.label}
                                </div>
                                <h3 className="text-[15px] font-semibold mb-2"
                                    style={{ fontFamily: 'Playfair Display, serif' }}>
                                    {f.title}
                                </h3>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                    {f.desc}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <div style={{ borderTop: '1px solid var(--border)' }} />

            {/* ── HOW IT WORKS ───────────────────────────────────────── */}
            <section className="py-28 px-4" style={{ background: 'var(--bg-surface)' }}>
                <div className="max-w-4xl mx-auto">
                    <div className="mb-16" style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '1.25rem' }}>
                        <span className="section-label mb-3 inline-flex">
                            <Activity className="w-3.5 h-3.5" />
                            Process
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold mt-3"
                            style={{ fontFamily: 'Playfair Display, serif' }}>
                            From symptoms to insights
                        </h2>
                    </div>

                    <div className="relative">
                        <div className="absolute left-5 top-5 bottom-5 w-px"
                            style={{ background: 'var(--border-accent)' }} />
                        <div className="space-y-4">
                            {STEPS.map((s, i) => (
                                <motion.div key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.09, duration: 0.45, ease }}
                                    className="flex gap-5 items-start"
                                >
                                    <div className="step-badge">{s.n}</div>
                                    <div className="flex-1 p-5" style={{ border: '1px solid var(--border)', background: 'var(--bg-base)' }}>
                                        <h3 className="font-semibold text-[15px] mb-1"
                                            style={{ fontFamily: 'Playfair Display, serif' }}>
                                            {s.title}
                                        </h3>
                                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <div style={{ borderTop: '1px solid var(--border)' }} />

            {/* ── TEAM ───────────────────────────────────────────────── */}
            <section className="py-28 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-16" style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '1.25rem' }}>
                        <span className="section-label mb-3 inline-flex">
                            <Sparkles className="w-3.5 h-3.5" />
                            The Team
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold mt-3"
                            style={{ fontFamily: 'Playfair Display, serif' }}>
                            Built by passionate engineers
                        </h2>
                        <p className="text-base mt-2" style={{ color: 'var(--text-secondary)' }}>
                            A team obsessed with making healthcare smarter and more accessible.
                        </p>
                    </div>

                    <motion.div
                        className="grid md:grid-cols-3 gap-px"
                        style={{ background: 'var(--border)' }}
                        variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
                    >
                        {TEAM.map((member, i) => (
                            <motion.div key={i} variants={item}
                                className="group flex flex-col items-center text-center p-8 gap-5"
                                style={{ background: 'var(--bg-surface)', transition: 'background 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-surface)'}
                            >
                                {/* Green top bar on hover */}
                                <div className="absolute top-0 inset-x-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden"
                                    style={{ background: 'var(--accent)' }} />

                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="team-avatar"
                                    onError={e => {
                                        e.target.onerror = null;
                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=166534&color=e8f5eb&size=200`;
                                    }}
                                />

                                <div>
                                    <h3 className="text-lg font-bold mb-0.5"
                                        style={{ fontFamily: 'Playfair Display, serif' }}>
                                        {member.name}
                                    </h3>
                                    <p className="text-xs font-semibold uppercase tracking-wider mb-3"
                                        style={{ color: 'var(--accent)', fontFamily: 'IBM Plex Sans' }}>
                                        {member.role}
                                    </p>
                                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                        {member.bio}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 mt-auto">
                                    <a href={member.socials.github}
                                        className="p-2 transition-colors duration-150"
                                        style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                                        target="_blank" rel="noopener noreferrer"
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                                        <Github className="w-4 h-4" />
                                    </a>
                                    <a href={member.socials.linkedin}
                                        className="p-2 transition-colors duration-150"
                                        style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                                        target="_blank" rel="noopener noreferrer"
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                                        <Linkedin className="w-4 h-4" />
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <div style={{ borderTop: '1px solid var(--border)' }} />

            {/* ── CTA ────────────────────────────────────────────────── */}
            <section className="py-28 px-4" style={{ background: 'var(--bg-surface)' }}>
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55, ease }}
                        className="p-12 text-center"
                        style={{ border: '1px solid var(--border-accent)', background: 'var(--bg-elevated)' }}
                    >
                        <div className="w-12 h-12 flex items-center justify-center mx-auto mb-6"
                            style={{ background: 'var(--accent)' }}>
                            <HeartPulse className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold mb-3"
                            style={{ fontFamily: 'Playfair Display, serif' }}>
                            Ready to check your health?
                        </h2>
                        <p className="mb-8 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
                            Get AI-powered insights from symptom analysis to full lab report interpretation — free.
                        </p>
                        <div className="flex gap-3 justify-center flex-wrap">
                            <Link to="/check" className="btn-primary px-7 py-3.5">
                                <Activity className="w-4 h-4" />
                                Start Health Check
                            </Link>
                            <Link to="/iot-vitals" className="btn-secondary px-7 py-3.5">
                                <Watch className="w-4 h-4" />
                                Connect Wearable
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── FOOTER ─────────────────────────────────────────────── */}
            <footer className="py-8 px-4" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-base)' }}>
                <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 flex items-center justify-center"
                            style={{ background: 'var(--accent)' }}>
                            <HeartPulse className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-sm font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>
                            VitalGuard AI
                        </span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        © 2025 VitalGuard AI · Final Year Project · Built with ML, IoT &amp; Computer Vision
                    </p>
                    <div className="flex gap-4 text-xs items-center" style={{ color: 'var(--text-muted)' }}>
                        <a href="https://github.com/Sne-04/VitalGuard-1"
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 transition-colors"
                            style={{ color: 'var(--text-muted)' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                            <Github className="w-3.5 h-3.5" /> Source Code
                        </a>
                        <a href="https://www.linkedin.com/in/sneha-shaw23"
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 transition-colors"
                            style={{ color: 'var(--text-muted)' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                            <Linkedin className="w-3.5 h-3.5" /> Team
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
