import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { BarChart3, TrendingUp, Users, Activity, AlertTriangle, Thermometer, Shield } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const GREEN = ['rgba(22,163,74,0.85)','rgba(21,128,61,0.85)','rgba(20,83,45,0.85)','rgba(74,222,128,0.85)','rgba(134,239,172,0.85)','rgba(187,247,208,0.85)','rgba(240,253,244,0.85)','rgba(5,150,105,0.85)'];

const genMock = (days) => {
    const diseases = ['Influenza','Common Cold','Migraine','Gastritis','Allergic Rhinitis','Bronchitis','Dengue Fever','UTI'];
    const symptoms = ['Fever','Cough','Headache','Fatigue','Nausea','Sore Throat','Body Pain','Chills','Dizziness','Vomiting'];
    const dailyTrends = Array.from({ length: days }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (days - 1 - i)); return { _id: d.toISOString().split('T')[0], count: Math.floor(Math.random() * 30) + 5 }; });
    const topSymptoms = symptoms.map(s => ({ _id: s, count: Math.floor(Math.random() * 80) + 10 })).sort((a, b) => b.count - a.count);
    const diseaseDistribution = diseases.map(d => ({ _id: d, count: Math.floor(Math.random() * 50) + 5 })).sort((a, b) => b.count - a.count);
    const severityDist = [{ _id: 'Mild', count: Math.floor(Math.random() * 100) + 40 }, { _id: 'Moderate', count: Math.floor(Math.random() * 60) + 20 }, { _id: 'Severe', count: Math.floor(Math.random() * 30) + 5 }];
    return { dailyTrends, topSymptoms, diseaseDistribution, severityDist, total: dailyTrends.reduce((s, d) => s + d.count, 0) };
};

const TIME_RANGES = [{ label: '7 Days', value: 7 }, { label: '30 Days', value: 30 }, { label: '90 Days', value: 90 }];

const chartBase = (title) => ({
    responsive: true,
    plugins: {
        legend: { display: false },
        title: { display: true, text: title, color: 'var(--text-primary)', font: { size: 13, weight: '600' } }
    },
    scales: {
        y: { beginAtZero: true, ticks: { color: 'var(--text-muted)' }, grid: { color: 'var(--border)' } },
        x: { ticks: { color: 'var(--text-muted)', maxRotation: 45 }, grid: { color: 'var(--border)' } }
    }
});
const pieBase = (title) => ({
    responsive: true,
    plugins: {
        legend: { position: 'bottom', labels: { color: 'var(--text-secondary)', padding: 14, font: { size: 11 } } },
        title: { display: true, text: title, color: 'var(--text-primary)', font: { size: 13, weight: '600' } }
    }
});

export default function Analytics() {
    const [timeRange, setTimeRange] = useState(30);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const t = setTimeout(() => { setData(genMock(timeRange)); setLoading(false); }, 700);
        return () => clearTimeout(t);
    }, [timeRange]);

    if (loading || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="loading-spinner mx-auto mb-3" />
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading analytics…</p>
                </div>
            </div>
        );
    }

    const symptomsBarData = { labels: data.topSymptoms.slice(0, 8).map(s => s._id), datasets: [{ label: 'Reported Count', data: data.topSymptoms.slice(0, 8).map(s => s.count), backgroundColor: GREEN, borderRadius: 0 }] };
    const diseaseDoughnutData = { labels: data.diseaseDistribution.slice(0, 6).map(d => d._id), datasets: [{ data: data.diseaseDistribution.slice(0, 6).map(d => d.count), backgroundColor: GREEN, borderWidth: 0 }] };
    const severityPieData = { labels: ['Mild','Moderate','Severe'], datasets: [{ data: [data.severityDist.find(s => s._id === 'Mild')?.count || 0, data.severityDist.find(s => s._id === 'Moderate')?.count || 0, data.severityDist.find(s => s._id === 'Severe')?.count || 0], backgroundColor: ['rgba(22,163,74,0.85)','rgba(245,158,11,0.85)','rgba(239,68,68,0.85)'], borderWidth: 0 }] };
    const trendLineData = { labels: data.dailyTrends.map(d => { const dt = new Date(d._id); return `${dt.getMonth()+1}/${dt.getDate()}`; }), datasets: [{ label: 'Predictions', data: data.dailyTrends.map(d => d.count), borderColor: '#16a34a', backgroundColor: 'rgba(22,163,74,0.06)', fill: true, tension: 0.4, pointRadius: 2 }] };

    const statCards = [
        { label: 'Total Predictions', value: data.total,                                                         icon: <Activity className="w-4 h-4" /> },
        { label: 'Top Condition',      value: data.diseaseDistribution[0]._id,                                   icon: <AlertTriangle className="w-4 h-4" /> },
        { label: 'Avg Daily',          value: Math.round(data.total / timeRange),                                icon: <TrendingUp className="w-4 h-4" /> },
        { label: 'Active Users',       value: Math.floor(data.total * 0.7),                                      icon: <Users className="w-4 h-4" /> },
    ];

    const alerts = [
        { icon: <Thermometer className="w-4 h-4" />, text: `Fever cases up ${Math.floor(Math.random() * 30 + 10)}% this week`,              color: '#ef4444', bg: 'rgba(239,68,68,0.06)',  border: 'rgba(239,68,68,0.15)' },
        { icon: <AlertTriangle className="w-4 h-4" />, text: `${data.diseaseDistribution[0]._id} is the most predicted condition`,          color: '#f59e0b', bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.15)' },
        { icon: <Shield className="w-4 h-4" />, text: `${data.severityDist.find(s => s._id === 'Mild')?.count || 0} cases classified mild`, color: '#16a34a', bg: 'rgba(22,163,74,0.06)',  border: 'rgba(22,163,74,0.15)' },
    ];

    return (
        <div className="container mx-auto px-4 py-24 max-w-6xl">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

                <div className="mb-10" style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '1.25rem' }}>
                    <span className="section-label mb-3 inline-flex">
                        <BarChart3 className="w-3.5 h-3.5" /> Population Health Intelligence
                    </span>
                    <h1 className="text-4xl font-bold mt-2 mb-1">Community Analytics</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Anonymised, aggregated health trends across our community.</p>
                </div>

                {/* Time range */}
                <div className="flex gap-2 mb-8">
                    {TIME_RANGES.map(r => (
                        <button key={r.value} onClick={() => setTimeRange(r.value)}
                            className="px-4 py-1.5 text-sm font-semibold transition-all"
                            style={{
                                border: '1px solid var(--border-accent)',
                                background: timeRange === r.value ? 'var(--accent)' : 'transparent',
                                color: timeRange === r.value ? 'white' : 'var(--text-secondary)',
                            }}>
                            {r.label}
                        </button>
                    ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-px mb-8" style={{ background: 'var(--border)' }}>
                    {statCards.map((s, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                            className="p-5" style={{ background: 'var(--bg-surface)' }}>
                            <div className="mb-2" style={{ color: 'var(--accent)' }}>{s.icon}</div>
                            <div className="text-2xl font-bold mb-0.5">{s.value}</div>
                            <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Alerts */}
                <div className="grid md:grid-cols-3 gap-3 mb-8">
                    {alerts.map((a, i) => (
                        <div key={i} className="px-4 py-3 flex items-center gap-3"
                            style={{ background: a.bg, border: `1px solid ${a.border}` }}>
                            <div style={{ color: a.color }}>{a.icon}</div>
                            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{a.text}</span>
                        </div>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid md:grid-cols-2 gap-4">
                    {[
                        { chart: <Line data={trendLineData} options={chartBase('Daily Prediction Volume')} />, title: null },
                        { chart: <Bar  data={symptomsBarData} options={chartBase('Trending Symptoms')} />, title: null },
                        { chart: <Doughnut data={diseaseDoughnutData} options={pieBase('Disease Distribution')} />, title: null },
                        { chart: <Pie data={severityPieData} options={pieBase('Severity Breakdown')} />, title: null },
                    ].map((c, i) => (
                        <div key={i} className="p-5" style={{ border: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
                            {c.chart}
                        </div>
                    ))}
                </div>

                <p className="text-center text-xs mt-6" style={{ color: 'var(--text-muted)' }}>
                    All data is anonymised and aggregated. No personal health information is displayed.
                </p>
            </motion.div>
        </div>
    );
}
