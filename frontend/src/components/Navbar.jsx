import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity, LogOut, History as HistoryIcon,
    Watch, Camera, BarChart3, Menu, X, Beaker,
    HeartPulse, ChevronDown
} from 'lucide-react';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleLogout = () => { logout(); navigate('/'); setMobileOpen(false); };
    const isActive = (path) => location.pathname === path;

    const authLinks = [
        { to: '/check',         icon: <Activity   className="w-3.5 h-3.5" />, label: 'Symptoms'   },
        { to: '/iot-vitals',    icon: <Watch      className="w-3.5 h-3.5" />, label: 'IoT Vitals' },
        { to: '/image-analysis',icon: <Camera     className="w-3.5 h-3.5" />, label: 'Image AI'   },
        { to: '/analytics',     icon: <BarChart3  className="w-3.5 h-3.5" />, label: 'Analytics'  },
        { to: '/lab',           icon: <Beaker     className="w-3.5 h-3.5" />, label: 'Lab Report' },
        { to: '/history',       icon: <HistoryIcon className="w-3.5 h-3.5" />, label: 'History'  },
    ];

    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-[#080c14]/90 backdrop-blur-xl border-b border-white/6 shadow-[0_1px_30px_rgba(0,0,0,0.5)]'
                    : 'bg-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setMobileOpen(false)}>
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-[0_0_16px_rgba(59,130,246,0.5)] group-hover:shadow-[0_0_24px_rgba(59,130,246,0.7)] transition-shadow">
                            <HeartPulse className="w-4.5 h-4.5 text-white" />
                        </div>
                        <span className="text-[15px] font-bold tracking-tight">
                            <span className="text-white">Vital</span>
                            <span className="text-blue-400">Guard</span>
                            <span className="text-slate-500 font-normal text-xs ml-1">AI</span>
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden lg:flex items-center gap-1">
                        {isAuthenticated ? (
                            <>
                                {authLinks.map(link => (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        className={`nav-link ${isActive(link.to) ? 'active' : ''}`}
                                    >
                                        {link.icon}
                                        <span>{link.label}</span>
                                    </Link>
                                ))}
                            </>
                        ) : (
                            <Link to="/analytics" className={`nav-link ${isActive('/analytics') ? 'active' : ''}`}>
                                <BarChart3 className="w-3.5 h-3.5" />
                                Analytics
                            </Link>
                        )}
                    </div>

                    {/* Right Actions */}
                    <div className="hidden lg:flex items-center gap-3">
                        {isAuthenticated ? (
                            <>
                                {/* User avatar */}
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/4 border border-white/8">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-[10px] font-bold text-white">
                                        {user?.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <span className="text-sm text-slate-300 font-medium max-w-[120px] truncate">
                                        {user?.name}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="btn-ghost text-slate-400 hover:text-red-400"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn-ghost">Sign In</Link>
                                <Link to="/register" className="btn-primary text-sm !px-4 !py-2">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="lg:hidden overflow-hidden border-t border-white/6 bg-[#080c14]/95 backdrop-blur-xl"
                    >
                        <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
                            {isAuthenticated ? (
                                <>
                                    {authLinks.map(link => (
                                        <Link
                                            key={link.to}
                                            to={link.to}
                                            onClick={() => setMobileOpen(false)}
                                            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                                isActive(link.to)
                                                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                            }`}
                                        >
                                            {link.icon}
                                            {link.label}
                                        </Link>
                                    ))}
                                    <div className="pt-3 mt-3 border-t border-white/6 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-[10px] font-bold text-white">
                                                {user?.name?.[0]?.toUpperCase() || 'U'}
                                            </div>
                                            {user?.name}
                                        </div>
                                        <button onClick={handleLogout} className="btn-ghost text-red-400 text-xs">
                                            <LogOut className="w-3.5 h-3.5" />
                                            Logout
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link to="/analytics" onClick={() => setMobileOpen(false)} className="nav-link block">Analytics</Link>
                                    <Link to="/login" onClick={() => setMobileOpen(false)} className="nav-link block">Sign In</Link>
                                    <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary w-full justify-center mt-2">
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
