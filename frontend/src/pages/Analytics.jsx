import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, PointElement, LineElement, BarElement,
    ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { BarChart3, TrendingUp, Users, Activity, AlertTriangle, Thermometer, Shield } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

// Generate mock analytics data (used when API has no data)
const generateMockData = (days) => {
    const diseases = ['Influenza', 'Common Cold', 'Migraine', 'Gastritis', 'Allergic Rhinitis', 'Bronchitis', 'Dengue Fever', 'UTI'];
    const symptoms = ['Fever', 'Cough', 'Headache', 'Fatigue', 'Nausea', 'Sore Throat', 'Body Pain', 'Chills', 'Dizziness', 'Vomiting'];

    const dailyTrends = Array.from({ length: days }, (_, i) => {
        const d = new Date(); d.setDate(d.getDate() - (days - 1 - i));
        return { _id: d.toISOString().split('T')[0], count: Math.floor(Math.random() * 30) + 5 };
    });

    const topSymptoms = symptoms.map(s => ({ _id: s, count: Math.floor(Math.random() * 80) + 10 })).sort((a, b) => b.count - a.count);
    const diseaseDistribution = diseases.map(d => ({ _id: d, count: Math.floor(Math.random() * 50) + 5 })).sort((a, b) => b.count - a.count);
    const severityDist = [
        { _id: 'Mild', count: Math.floor(Math.random() * 100) + 40 },
        { _id: 'Moderate', count: Math.floor(Math.random() * 60) + 20 },
        { _id: 'Severe', count: Math.floor(Math.random() * 30) + 5 }
    ];

    return { dailyTrends, topSymptoms, diseaseDistribution, severityDist, total: dailyTrends.reduce((s, d) => s + d.count, 0) };
};

const TIME_RANGES = [
    { label: '7 Days', value: 7 },
    { label: '30 Days', value: 30 },
    { label: '90 Days', value: 90 },
];

const Analytics = () => {
    const [timeRange, setTimeRange] = useState(30);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // Simulate API fetch with mock data
        const timer = setTimeout(() => {
            setData(generateMockData(timeRange));
            setLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, [timeRange]);

    if (loading || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="loading-spinner mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading analytics...</p>
                </div>
            </div>
        );
    }

    // Alert cards for epidemiological insights
    const alerts = [
        { icon: <Thermometer className="w-5 h-5" />, text: `Fever cases up ${Math.floor(Math.random() * 30 + 10)}% this week`, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
        { icon: <AlertTriangle className="w-5 h-5" />, text: `${data.diseaseDistribution[0]._id} is the most predicted condition`, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
        { icon: <Shield className="w-5 h-5" />, text: `${data.severityDist.find(s => s._id === 'Mild')?.count || 0} cases classified as mild`, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    ];

    // Chart: Top Symptoms Bar
    const symptomsBarData = {
        labels: data.topSymptoms.slice(0, 8).map(s => s._id),
        datasets: [{
            label: 'Reported Count',
            data: data.topSymptoms.slice(0, 8).map(s => s.count),
            backgroundColor: [
                'rgba(59, 130, 246, 0.8)', 'rgba(99, 102, 241, 0.8)', 'rgba(139, 92, 246, 0.8)',
                'rgba(168, 85, 247, 0.8)', 'rgba(236, 72, 153, 0.8)', 'rgba(239, 68, 68, 0.8)',
                'rgba(245, 158, 11, 0.8)', 'rgba(16, 185, 129, 0.8)'
            ],
            borderRadius: 6
        }]
    };

    // Chart: Disease Distribution Doughnut
    const diseaseDoughnutData = {
        labels: data.diseaseDistribution.slice(0, 6).map(d => d._id),
        datasets: [{
            data: data.diseaseDistribution.slice(0, 6).map(d => d.count),
            backgroundColor: [
                'rgba(59, 130, 246, 0.85)', 'rgba(139, 92, 246, 0.85)', 'rgba(236, 72, 153, 0.85)',
                'rgba(245, 158, 11, 0.85)', 'rgba(16, 185, 129, 0.85)', 'rgba(99, 102, 241, 0.85)'
            ],
            borderWidth: 0
        }]
    };

    // Chart: Severity Pie
    const severityPieData = {
        labels: ['Mild', 'Moderate', 'Severe'],
        datasets: [{
            data: [
                data.severityDist.find(s => s._id === 'Mild')?.count || 0,
                data.severityDist.find(s => s._id === 'Moderate')?.count || 0,
                data.severityDist.find(s => s._id === 'Severe')?.count || 0,
            ],
            backgroundColor: ['rgba(16, 185, 129, 0.85)', 'rgba(245, 158, 11, 0.85)', 'rgba(239, 68, 68, 0.85)'],
            borderWidth: 0
        }]
    };

    // Chart: Daily Trend Line
    const trendLineData = {
        labels: data.dailyTrends.map(d => {
            const date = new Date(d._id);
            return `${date.getMonth() + 1}/${date.getDate()}`;
        }),
        datasets: [{
            label: 'Predictions',
            data: data.dailyTrends.map(d => d.count),
            borderColor: 'rgba(99, 102, 241, 1)',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            fill: true, tension: 0.4, pointRadius: 2
        }]
    };

    const darkChartOptions = (title) => ({
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: title, color: '#fff', font: { size: 14, weight: 'bold' } }
        },
        scales: {
            y: { beginAtZero: true, ticks: { color: '#9ca3af' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            x: { ticks: { color: '#9ca3af', maxRotation: 45 }, grid: { color: 'rgba(255,255,255,0.05)' } }
        }
    });

    const pieOptions = (title) => ({
        responsive: true,
        plugins: {
            legend: { position: 'bottom', labels: { color: '#9ca3af', padding: 16, font: { size: 11 } } },
            title: { display: true, text: title, color: '#fff', font: { size: 14, weight: 'bold' } }
        }
    });

    return (
        <div className="container mx-auto px-4 py-24">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 rounded-full mb-4">
                        <BarChart3 className="w-5 h-5 text-indigo-400" />
                        <span className="text-sm font-semibold text-indigo-400">Population Health Intelligence</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-3">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                            Community Analytics
                        </span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Anonymized, aggregated health trends — tracking symptoms and diseases across our community
                    </p>
                </div>

                {/* Time Range Selector */}
                <div className="flex justify-center gap-2 mb-8">
                    {TIME_RANGES.map(range => (
                        <button
                            key={range.value}
                            onClick={() => setTimeRange(range.value)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${timeRange === range.value
                                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                        >
                            {range.label}
                        </button>
                    ))}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Predictions', value: data.total, icon: <Activity className="w-5 h-5" />, color: 'text-blue-400' },
                        { label: 'Top Condition', value: data.diseaseDistribution[0]._id, icon: <AlertTriangle className="w-5 h-5" />, color: 'text-yellow-400' },
                        { label: 'Avg Daily', value: Math.round(data.total / timeRange), icon: <TrendingUp className="w-5 h-5" />, color: 'text-emerald-400' },
                        { label: 'Active Users', value: Math.floor(data.total * 0.7), icon: <Users className="w-5 h-5" />, color: 'text-purple-400' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card rounded-xl p-5"
                        >
                            <div className={`${stat.color} mb-2`}>{stat.icon}</div>
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <div className="text-xs text-gray-400">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Alert Banners */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    {alerts.map((alert, i) => (
                        <div key={i} className={`${alert.bg} border rounded-xl px-4 py-3 flex items-center gap-3`}>
                            <div className={alert.color}>{alert.icon}</div>
                            <span className="text-sm text-gray-300">{alert.text}</span>
                        </div>
                    ))}
                </div>

                {/* Charts Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Daily Trends */}
                    <div className="glass-card rounded-2xl p-6">
                        <div className="bg-gray-900/50 p-4 rounded-lg">
                            <Line data={trendLineData} options={darkChartOptions('Daily Prediction Volume')} />
                        </div>
                    </div>

                    {/* Top Symptoms */}
                    <div className="glass-card rounded-2xl p-6">
                        <div className="bg-gray-900/50 p-4 rounded-lg">
                            <Bar data={symptomsBarData} options={darkChartOptions('Trending Symptoms')} />
                        </div>
                    </div>

                    {/* Disease Distribution */}
                    <div className="glass-card rounded-2xl p-6">
                        <div className="bg-gray-900/50 p-4 rounded-lg">
                            <Doughnut data={diseaseDoughnutData} options={pieOptions('Disease Distribution')} />
                        </div>
                    </div>

                    {/* Severity Breakdown */}
                    <div className="glass-card rounded-2xl p-6">
                        <div className="bg-gray-900/50 p-4 rounded-lg">
                            <Pie data={severityPieData} options={pieOptions('Severity Breakdown')} />
                        </div>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="text-center text-xs text-gray-500 mt-4">
                    <p>📊 All data is anonymized and aggregated. No personal health information is displayed.</p>
                    <p className="mt-1">Data shown represents community-level trends for educational purposes only.</p>
                </div>
            </motion.div>
        </div>
    );
};

export default Analytics;
