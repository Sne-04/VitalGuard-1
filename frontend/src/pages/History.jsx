import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { Clock, Calendar, Activity, ChevronRight, Loader, History as HistoryIcon } from 'lucide-react';

const getSeverityStyle = (severity) => {
    switch (severity) {
        case 'Severe':   return { color: '#ef4444', background: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.25)' };
        case 'Moderate': return { color: '#f59e0b', background: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.25)' };
        case 'Mild':     return { color: '#16a34a', background: 'rgba(22,163,74,0.08)',   border: 'rgba(22,163,74,0.25)' };
        default:         return { color: 'var(--text-muted)', background: 'var(--bg-elevated)', border: 'var(--border)' };
    }
};

export default function History() {
    const navigate = useNavigate();
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState('');
    const [pagination, setPagination]   = useState({ page: 1, limit: 10, total: 0, pages: 0 });

    useEffect(() => { fetchHistory(); }, [pagination.page]);

    const fetchHistory = async () => {
        try {
            const res = await api.get(`/predict/history?page=${pagination.page}&limit=${pagination.limit}`);
            setPredictions(res.data.data);
            setPagination(res.data.pagination);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load history');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="loading-spinner mx-auto mb-3" />
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading history…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-24 max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

                <div className="mb-10" style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '1.25rem' }}>
                    <span className="section-label mb-3 inline-flex">
                        <HistoryIcon className="w-3.5 h-3.5" /> Health Records
                    </span>
                    <h1 className="text-4xl font-bold mt-2 mb-1">Health Check History</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Review your past health assessments and AI predictions.</p>
                </div>

                {error && (
                    <div className="mb-6 px-4 py-3 text-sm flex items-center gap-2"
                        style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
                        {error}
                    </div>
                )}

                {predictions.length === 0 ? (
                    <div className="p-12 text-center" style={{ border: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
                        <Activity className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
                        <h3 className="text-lg font-semibold mb-2">No History Yet</h3>
                        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                            Start your first health check to see AI predictions here.
                        </p>
                        <button onClick={() => navigate('/check')} className="btn-primary px-6 py-2.5">
                            Start Health Check
                        </button>
                    </div>
                ) : (
                    <>
                        <div style={{ border: '1px solid var(--border)' }}>
                            {predictions.map((p, idx) => {
                                const sty = getSeverityStyle(p.severity.level);
                                return (
                                    <motion.div key={p._id}
                                        initial={{ opacity: 0, x: -16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        onClick={() => navigate(`/results/${p._id}`)}
                                        className="flex items-center justify-between px-5 py-4 cursor-pointer transition-colors"
                                        style={{ borderBottom: idx < predictions.length - 1 ? '1px solid var(--border)' : 'none' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                <h3 className="text-base font-semibold">{p.disease.name}</h3>
                                                <span className="text-xs font-semibold px-2 py-0.5"
                                                    style={{ color: sty.color, background: sty.background, border: `1px solid ${sty.border}` }}>
                                                    {p.severity.level}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 mb-2">
                                                {p.symptoms.slice(0, 4).map((s, i) => (
                                                    <span key={i} className="chip text-xs">{s}</span>
                                                ))}
                                                {p.symptoms.length > 4 && (
                                                    <span className="chip text-xs">+{p.symptoms.length - 4} more</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-5 text-xs" style={{ color: 'var(--text-muted)' }}>
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {new Date(p.createdAt).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {p.symptomDuration} days
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Activity className="w-3.5 h-3.5" />
                                                    {p.disease.confidence.toFixed(1)}% confidence
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 ml-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                                    </motion.div>
                                );
                            })}
                        </div>

                        {pagination.pages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-6">
                                <button
                                    onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                                    disabled={pagination.page === 1}
                                    className="btn-secondary px-5 py-2 disabled:opacity-40 disabled:cursor-not-allowed">
                                    Previous
                                </button>
                                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    Page {pagination.page} of {pagination.pages}
                                </span>
                                <button
                                    onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                                    disabled={pagination.page === pagination.pages}
                                    className="btn-secondary px-5 py-2 disabled:opacity-40 disabled:cursor-not-allowed">
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </motion.div>
        </div>
    );
}
