import React from 'react';
import { Link } from 'react-router-dom';
import {
    Activity, Shield, Brain, TrendingUp, AlertTriangle,
    Watch, Camera, BarChart3, Beaker, ArrowRight,
    HeartPulse, Zap, Lock, Github, Linkedin, Twitter,
    Sparkles, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import DotGrid from '../components/DotGrid';

const ease = [0.16, 1, 0.3, 1];
const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, ease, delay },
});
const stagger = { hidden:{opacity:0}, show:{opacity:1,transition:{staggerChildren:0.07}} };
const item = { hidden:{opacity:0,y:20}, show:{opacity:1,y:0,transition:{duration:0.5,ease}} };

const FEATURES = [
    { icon:<TrendingUp className="w-5 h-5"/>, label:'Prediction',     title:'Symptom Progression',   desc:'7-day risk timeline and severity forecasting using ML trained on clinical datasets.',     accent:'#3b82f6' },
    { icon:<AlertTriangle className="w-5 h-5"/>, label:'Triage',      title:'AI-Based Triage',       desc:'Hospital-grade decision engine: Home Care, Doctor Visit, or Emergency — instantly.',       accent:'#f59e0b' },
    { icon:<Brain className="w-5 h-5"/>,  label:'Explainability',     title:'SHAP Explainable AI',   desc:'Feature attribution shows exactly why the model reached its prediction.',               accent:'#10b981' },
    { icon:<Watch className="w-5 h-5"/>,  label:'IoT',                title:'Wearable Integration',  desc:'Sync real-time heart rate, SpO₂ & temperature from any smartwatch or IoT device.',     accent:'#8b5cf6', badge:'New' },
    { icon:<Camera className="w-5 h-5"/>, label:'Vision',             title:'Image Diagnosis',       desc:'Upload symptom photos for AI computer vision analysis in under 2 seconds.',             accent:'#06b6d4', badge:'New' },
    { icon:<Beaker className="w-5 h-5"/>, label:'Lab',                title:'Lab Report Analyzer',   desc:'Parse and interpret blood reports with clinical risk flagging and trend detection.',      accent:'#ec4899', badge:'New' },
    { icon:<BarChart3 className="w-5 h-5"/>, label:'Analytics',       title:'Population Analytics',  desc:'Community health heatmaps, disease trends and epidemiological insight dashboards.',      accent:'#6366f1' },
    { icon:<Lock className="w-5 h-5"/>,   label:'Security',           title:'Secure & Private',      desc:'Clerk-powered auth, JWT tokens and HIPAA-aware data handling by default.',               accent:'#64748b' },
];

const STATS = [
    { value:'92.5%', label:'Prediction Accuracy' },
    { value:'87%',   label:'Severity Classification' },
    { value:'95%',   label:'Triage Accuracy' },
    { value:'<2s',   label:'Response Time' },
];

const STEPS = [
    { n:'01', title:'Enter Symptoms',   desc:'Type, upload an image, or speak your symptoms to our AI assistant.' },
    { n:'02', title:'Connect Wearable', desc:'Sync real-time vitals from your smartwatch or IoT health device.'   },
    { n:'03', title:'AI Analysis',      desc:'ML + Computer Vision models process your data across 8 specialized engines.' },
    { n:'04', title:'Get Insights',     desc:'Disease prediction, severity score, risk timeline and community trends.' },
];

const TEAM = [
    {
        name: 'Sneha Shaw',
        role: 'Full Stack Developer & AI Engineer',
        bio: 'Leads backend architecture and AI integration. Passionate about making healthcare intelligent.',
        image: '/sneha.png',
        accent: '#3b82f6',
        socials: { github: '#', linkedin: '#' },
    },
    {
        name: 'Baishaksi Singha',
        role: 'ML Engineer & Data Scientist',
        bio: 'Designs and trains the predictive ML models powering VitalGuard\'s clinical decision engine.',
        image: '/baishaksi.png',
        accent: '#8b5cf6',
        socials: { github: '#', linkedin: '#' },
    },
    {
        name: 'ShrutiKana Patra',
        role: 'Frontend Developer & UI/UX',
        bio: 'Crafts premium user experiences that make complex AI insights feel intuitive and accessible.',
        image: '/shrutikana.png',
        accent: '#ec4899',
        socials: { github: '#', linkedin: '#' },
    },
];

export default function Home() {
    return (
        <div className="min-h-screen">

            {/* ── HERO ──────────────────────────────────────────── */}
            <section className="relative pt-36 pb-32 px-4 overflow-hidden" style={{minHeight:'90vh', display:'flex', alignItems:'center'}}>

                {/* 3D Dot Grid */}
                <div className="absolute inset-0" style={{zIndex:0}}>
                    <DotGrid />
                </div>

                {/* Orb glows */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{zIndex:1}}>
                    <div className="orb orb-blue   w-[600px] h-[600px] -top-48 left-1/2 -translate-x-1/2" />
                    <div className="orb orb-violet w-[400px] h-[400px] top-32 -right-24" style={{animationDelay:'5s'}} />
                    <div className="orb orb-teal   w-[300px] h-[300px] bottom-0 -left-20" style={{animationDelay:'10s'}} />
                </div>

                {/* Grid overlay */}
                <div className="absolute inset-0 pointer-events-none" style={{
                    zIndex:1,
                    backgroundImage:'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
                    backgroundSize:'72px 72px'
                }}/>

                <div className="max-w-5xl mx-auto text-center relative w-full" style={{zIndex:2}}>

                    <motion.div {...fadeUp(0)}>
                        <span className="section-label mb-8 inline-flex">
                            <HeartPulse className="w-3.5 h-3.5" />
                            AI-Powered Health Intelligence
                        </span>
                    </motion.div>

                    <motion.h1
                        className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.06] mb-6"
                        style={{fontFamily:'Sora,sans-serif'}}
                        {...fadeUp(0.1)}
                    >
                        Your health,{' '}
                        <span className="gradient-text">understood</span>
                        <br />by AI
                    </motion.h1>

                    <motion.p
                        className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
                        style={{color:'var(--text-secondary)'}}
                        {...fadeUp(0.2)}
                    >
                        VitalGuard combines machine learning, IoT wearables and computer vision
                        to deliver hospital-grade health insights — in seconds, not hours.
                    </motion.p>

                    <motion.div className="flex gap-3 justify-center flex-wrap" {...fadeUp(0.3)}>
                        <Link to="/check" className="btn-primary px-7 py-3.5 text-[15px] font-semibold">
                            <Activity className="w-4 h-4" />
                            Start Health Check
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link to="/lab" className="btn-secondary px-7 py-3.5 text-[15px] font-semibold">
                            <Beaker className="w-4 h-4" style={{color:'var(--accent)'}} />
                            Analyze Lab Report
                        </Link>
                    </motion.div>

                    {/* Trust badges */}
                    <motion.div
                        className="flex items-center justify-center gap-6 mt-10 flex-wrap"
                        {...fadeUp(0.4)}
                    >
                        {['TensorFlow', 'Clerk Auth', 'NeonDB', 'React 18', 'SHAP XAI'].map(t => (
                            <span key={t} className="text-xs font-medium px-3 py-1 rounded-full"
                                style={{color:'var(--text-muted)', border:'1px solid var(--border)'}}>
                                {t}
                            </span>
                        ))}
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto"
                        variants={stagger} initial="hidden" animate="show"
                    >
                        {STATS.map((s, i) => (
                            <motion.div key={i} variants={item} className="stat-pill">
                                <div className="text-2xl font-bold" style={{color:'var(--accent)', fontFamily:'Sora,sans-serif'}}>
                                    {s.value}
                                </div>
                                <div className="text-xs mt-0.5 font-medium" style={{color:'var(--text-muted)'}}>
                                    {s.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── FEATURES ──────────────────────────────────────── */}
            <section className="py-28 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="section-label mb-5 inline-flex">
                            <Zap className="w-3.5 h-3.5" />
                            Capabilities
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-3" style={{fontFamily:'Sora,sans-serif'}}>
                            Beyond basic symptom checking
                        </h2>
                        <p className="text-base max-w-lg mx-auto" style={{color:'var(--text-secondary)'}}>
                            Eight specialized AI engines working in concert.
                        </p>
                    </div>

                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
                        variants={stagger} initial="hidden" whileInView="show" viewport={{once:true}}
                    >
                        {FEATURES.map((f, i) => (
                            <motion.div key={i} variants={item}
                                className="feature-card group relative overflow-hidden"
                            >
                                {/* Hover accent glow */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
                                    style={{background:`radial-gradient(ellipse at 30% 30%, ${f.accent}12 0%, transparent 70%)`}} />

                                {/* Top accent line */}
                                <div className="absolute top-0 inset-x-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{background:`linear-gradient(90deg, transparent, ${f.accent}, transparent)`}} />

                                {f.badge && (
                                    <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-md"
                                        style={{background:`${f.accent}20`, color:f.accent, border:`1px solid ${f.accent}40`}}>
                                        {f.badge}
                                    </span>
                                )}

                                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                                    style={{background:`${f.accent}18`, color:f.accent}}>
                                    {f.icon}
                                </div>

                                <div className="text-[10px] font-bold uppercase tracking-widest mb-1.5"
                                    style={{color:f.accent}}>
                                    {f.label}
                                </div>
                                <h3 className="text-[15px] font-bold mb-2">{f.title}</h3>
                                <p className="text-sm leading-relaxed" style={{color:'var(--text-secondary)'}}>
                                    {f.desc}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── HOW IT WORKS ──────────────────────────────────── */}
            <section className="py-28 px-4" style={{background:'var(--bg-surface)'}}>
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="section-label mb-5 inline-flex">
                            <Activity className="w-3.5 h-3.5" />
                            Process
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold mt-4" style={{fontFamily:'Sora,sans-serif'}}>
                            From symptoms to insights
                        </h2>
                    </div>

                    <div className="relative">
                        <div className="absolute left-5 top-8 bottom-8 w-px"
                            style={{background:'linear-gradient(180deg, var(--accent) 0%, #7c3aed 60%, transparent 100%)', opacity:0.3}}
                        />
                        <div className="space-y-6">
                            {STEPS.map((s, i) => (
                                <motion.div key={i}
                                    initial={{opacity:0, x:-24}}
                                    whileInView={{opacity:1, x:0}}
                                    viewport={{once:true}}
                                    transition={{delay: i * 0.1, duration:0.5, ease}}
                                    className="flex gap-5 items-start"
                                >
                                    <div className="step-badge">{s.n}</div>
                                    <div className="surface-card flex-1 px-5 py-4"
                                        style={{borderRadius:'14px'}}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <ChevronRight className="w-4 h-4" style={{color:'var(--accent)'}} />
                                            <h3 className="font-bold text-[15px]">{s.title}</h3>
                                        </div>
                                        <p className="text-sm" style={{color:'var(--text-secondary)'}}>{s.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── TEAM ──────────────────────────────────────────── */}
            <section className="py-28 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="section-label mb-5 inline-flex">
                            <Sparkles className="w-3.5 h-3.5" />
                            The Team
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-3" style={{fontFamily:'Sora,sans-serif'}}>
                            Built by passionate engineers
                        </h2>
                        <p className="text-base max-w-xl mx-auto" style={{color:'var(--text-secondary)'}}>
                            A team of AI, ML and product engineers obsessed with making healthcare smarter.
                        </p>
                    </div>

                    <motion.div
                        className="grid md:grid-cols-3 gap-6"
                        variants={stagger} initial="hidden" whileInView="show" viewport={{once:true}}
                    >
                        {TEAM.map((member, i) => (
                            <motion.div key={i} variants={item} className="team-card group">
                                {/* Avatar glow ring */}
                                <div className="relative">
                                    <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-500 blur-xl"
                                        style={{background:member.accent, transform:'scale(0.8)'}} />
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="team-avatar relative z-10"
                                        onError={e => {
                                            e.target.onerror = null;
                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=${member.accent.slice(1)}&color=fff&size=200`;
                                        }}
                                    />
                                </div>

                                {/* Info */}
                                <div>
                                    <h3 className="text-lg font-bold mb-0.5">{member.name}</h3>
                                    <p className="text-xs font-semibold uppercase tracking-wider mb-3"
                                        style={{color:member.accent}}>
                                        {member.role}
                                    </p>
                                    <p className="text-sm leading-relaxed" style={{color:'var(--text-secondary)'}}>
                                        {member.bio}
                                    </p>
                                </div>

                                {/* Social links */}
                                <div className="flex items-center gap-3 mt-1">
                                    <a href={member.socials.github}
                                        className="p-2 rounded-lg transition-colors duration-150 hover:scale-110"
                                        style={{background:'var(--bg-elevated)', color:'var(--text-secondary)'}}
                                        target="_blank" rel="noopener noreferrer">
                                        <Github className="w-4 h-4" />
                                    </a>
                                    <a href={member.socials.linkedin}
                                        className="p-2 rounded-lg transition-colors duration-150 hover:scale-110"
                                        style={{background:'var(--bg-elevated)', color:'var(--text-secondary)'}}
                                        target="_blank" rel="noopener noreferrer">
                                        <Linkedin className="w-4 h-4" />
                                    </a>
                                </div>

                                {/* Bottom accent */}
                                <div className="w-full h-0.5 rounded-full mt-1 opacity-30"
                                    style={{background:`linear-gradient(90deg, transparent, ${member.accent}, transparent)`}} />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── CTA ───────────────────────────────────────────── */}
            <section className="py-28 px-4">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{opacity:0, y:32}}
                        whileInView={{opacity:1, y:0}}
                        viewport={{once:true}}
                        transition={{duration:0.6, ease}}
                        className="gradient-border p-12 text-center relative overflow-hidden"
                    >
                        <div className="absolute inset-0 pointer-events-none"
                            style={{background:'radial-gradient(ellipse 70% 60% at 50% 50%, var(--accent-glow) 0%, transparent 70%)'}} />

                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                                style={{background:'var(--accent)', boxShadow:`0 0 40px var(--accent-glow)`}}>
                                <HeartPulse className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold mb-3" style={{fontFamily:'Sora,sans-serif'}}>
                                Ready to check your health?
                            </h2>
                            <p className="mb-8 max-w-md mx-auto" style={{color:'var(--text-secondary)'}}>
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
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── FOOTER ────────────────────────────────────────── */}
            <footer className="border-t py-8 px-4" style={{borderColor:'var(--border)'}}>
                <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md flex items-center justify-center"
                            style={{background:'var(--accent)'}}>
                            <HeartPulse className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-sm font-semibold">VitalGuard AI</span>
                    </div>
                    <p className="text-xs" style={{color:'var(--text-muted)'}}>
                        © 2025 VitalGuard AI · Built with ML, IoT & Computer Vision
                    </p>
                    <div className="flex gap-4 text-xs" style={{color:'var(--text-muted)'}}>
                        <span>Privacy</span>
                        <span>Terms</span>
                        <span>Contact</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
