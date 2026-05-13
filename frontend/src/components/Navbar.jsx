import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, LogOut, History as HistoryIcon,
    Watch, Camera, BarChart3, Menu, X, Beaker,
    HeartPulse, Sun, Moon
} from 'lucide-react';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const { theme, toggle, isDark } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 16);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleLogout = () => { logout(); navigate('/'); setMobileOpen(false); };
    const isActive = (path) => location.pathname === path;

    const authLinks = [
        { to:'/check',          icon:<Activity    className="w-3.5 h-3.5"/>, label:'Symptoms'   },
        { to:'/iot-vitals',     icon:<Watch       className="w-3.5 h-3.5"/>, label:'IoT Vitals' },
        { to:'/image-analysis', icon:<Camera      className="w-3.5 h-3.5"/>, label:'Image AI'   },
        { to:'/analytics',      icon:<BarChart3   className="w-3.5 h-3.5"/>, label:'Analytics'  },
        { to:'/lab',            icon:<Beaker      className="w-3.5 h-3.5"/>, label:'Lab Report' },
        { to:'/history',        icon:<HistoryIcon className="w-3.5 h-3.5"/>, label:'History'    },
    ];

    return (
        <motion.nav
            initial={{ y:-70, opacity:0 }}
            animate={{ y:0, opacity:1 }}
            transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}
            className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
            style={{
                background: scrolled ? 'var(--nav-bg)' : 'transparent',
                backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
                WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
                borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
                boxShadow: scrolled ? '0 1px 24px rgba(0,0,0,0.2)' : 'none',
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setMobileOpen(false)}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300"
                            style={{
                                background:'var(--accent)',
                                boxShadow:'0 0 16px var(--accent-glow)',
                            }}>
                            <HeartPulse className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-[15px] font-bold tracking-tight" style={{fontFamily:'Sora,sans-serif'}}>
                            <span style={{color:'var(--text-primary)'}}>Vital</span>
                            <span style={{color:'var(--accent)'}}>Guard</span>
                            <span style={{color:'var(--text-muted)', fontWeight:400, fontSize:'0.7rem', marginLeft:'2px'}}>AI</span>
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden lg:flex items-center gap-0.5">
                        {isAuthenticated ? authLinks.map(link => (
                            <Link key={link.to} to={link.to}
                                className={`nav-link ${isActive(link.to) ? 'active' : ''}`}>
                                {link.icon}
                                <span>{link.label}</span>
                            </Link>
                        )) : (
                            <Link to="/analytics" className={`nav-link ${isActive('/analytics') ? 'active' : ''}`}>
                                <BarChart3 className="w-3.5 h-3.5" />
                                Analytics
                            </Link>
                        )}
                    </div>

                    {/* Right actions */}
                    <div className="hidden lg:flex items-center gap-2">
                        {/* Theme toggle */}
                        <button
                            onClick={toggle}
                            className="p-2 rounded-lg transition-all duration-200"
                            style={{
                                background:'var(--bg-glass)',
                                border:'1px solid var(--border)',
                                color:'var(--text-secondary)',
                            }}
                            aria-label="Toggle theme"
                        >
                            {isDark
                                ? <Sun  className="w-4 h-4" />
                                : <Moon className="w-4 h-4" />
                            }
                        </button>

                        {isAuthenticated ? (
                            <>
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                                    style={{background:'var(--bg-glass)', border:'1px solid var(--border)'}}>
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                                        style={{background:'linear-gradient(135deg,var(--accent),#7c3aed)'}}>
                                        {user?.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <span className="text-sm font-medium max-w-[120px] truncate"
                                        style={{color:'var(--text-secondary)'}}>
                                        {user?.name}
                                    </span>
                                </div>
                                <button onClick={handleLogout} className="btn-ghost"
                                    style={{color:'var(--text-muted)'}}>
                                    <LogOut className="w-3.5 h-3.5" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn-ghost">Sign In</Link>
                                <Link to="/register" className="btn-primary !px-4 !py-2 text-sm">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile controls */}
                    <div className="lg:hidden flex items-center gap-2">
                        <button onClick={toggle}
                            className="p-2 rounded-lg"
                            style={{background:'var(--bg-glass)', border:'1px solid var(--border)', color:'var(--text-secondary)'}}>
                            {isDark ? <Sun className="w-4 h-4"/> : <Moon className="w-4 h-4"/>}
                        </button>
                        <button
                            className="p-2 rounded-lg"
                            style={{background:'var(--bg-glass)', border:'1px solid var(--border)', color:'var(--text-secondary)'}}
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            {mobileOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{opacity:0, height:0}}
                        animate={{opacity:1, height:'auto'}}
                        exit={{opacity:0, height:0}}
                        transition={{duration:0.2}}
                        className="lg:hidden overflow-hidden"
                        style={{borderTop:'1px solid var(--border)', background:'var(--nav-bg)', backdropFilter:'blur(24px)'}}
                    >
                        <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
                            {isAuthenticated ? (
                                <>
                                    {authLinks.map(link => (
                                        <Link key={link.to} to={link.to}
                                            onClick={() => setMobileOpen(false)}
                                            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive(link.to) ? 'active' : ''} nav-link`}>
                                            {link.icon}{link.label}
                                        </Link>
                                    ))}
                                    <div className="pt-3 mt-2 flex items-center justify-between"
                                        style={{borderTop:'1px solid var(--border)'}}>
                                        <div className="flex items-center gap-2 text-sm" style={{color:'var(--text-secondary)'}}>
                                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                                                style={{background:'linear-gradient(135deg,var(--accent),#7c3aed)'}}>
                                                {user?.name?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                            {user?.name}
                                        </div>
                                        <button onClick={handleLogout} className="btn-ghost text-xs" style={{color:'#ef4444'}}>
                                            <LogOut className="w-3.5 h-3.5"/>Logout
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link to="/analytics" onClick={() => setMobileOpen(false)} className="nav-link block">Analytics</Link>
                                    <Link to="/login"     onClick={() => setMobileOpen(false)} className="nav-link block">Sign In</Link>
                                    <Link to="/register"  onClick={() => setMobileOpen(false)} className="btn-primary w-full justify-center mt-2">
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
