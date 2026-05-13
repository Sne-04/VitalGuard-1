import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Watch, Heart, Thermometer, Wind, Footprints, Bluetooth, BluetoothConnected, AlertTriangle, Zap, Activity } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const gen = (base, variance) => +(base + (Math.random() - 0.5) * variance).toFixed(1);
const DEVICES = [
    { id: 'fitbit', name: 'Fitbit Sense 2', icon: '⌚' },
    { id: 'apple_watch', name: 'Apple Watch Ultra', icon: '⌚' },
    { id: 'generic_sensor', name: 'IoT Health Sensor', icon: '📡' },
];
const statusColor = s => s === 'critical' ? '#ef4444' : s === 'warning' ? '#f59e0b' : 'var(--accent)';
const getStatus = (type, v) => {
    if (type === 'heartRate') return v > 100 || v < 55 ? 'critical' : v > 90 || v < 60 ? 'warning' : 'normal';
    if (type === 'spo2') return v < 90 ? 'critical' : v < 95 ? 'warning' : 'normal';
    if (type === 'temperature') return v > 103 ? 'critical' : v > 100 ? 'warning' : 'normal';
    return 'normal';
};

export default function IoTVitals() {
    const [connected, setConnected] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [vitals, setVitals] = useState({ heartRate: 72, spo2: 98, temperature: 98.4, systolic: 120, diastolic: 80, steps: 4523 });
    const [history, setHistory] = useState([]);
    const [liveData, setLiveData] = useState({ labels: [], heartRate: [], spo2: [] });
    const iRef = useRef(null);

    const connect = async (device) => { setSelectedDevice(device); setConnecting(true); await new Promise(r => setTimeout(r, 2500)); setConnecting(false); setConnected(true); };
    const disconnect = () => { setConnected(false); setSelectedDevice(null); if (iRef.current) clearInterval(iRef.current); };

    useEffect(() => {
        if (!connected) return;
        iRef.current = setInterval(() => {
            const v = { heartRate: gen(72, 20), spo2: gen(97, 4), temperature: gen(98.4, 2), systolic: gen(120, 15), diastolic: gen(80, 10) };
            setVitals(prev => ({ ...v, steps: prev.steps + Math.floor(Math.random() * 15) }));
            const t = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
            setLiveData(prev => ({ labels: [...prev.labels, t].slice(-20), heartRate: [...prev.heartRate, v.heartRate].slice(-20), spo2: [...prev.spo2, v.spo2].slice(-20) }));
            setHistory(prev => [{ time: t, ...v, bp: `${Math.round(v.systolic)}/${Math.round(v.diastolic)}` }, ...prev].slice(0, 24));
        }, 2000);
        return () => clearInterval(iRef.current);
    }, [connected]);

    const cards = [
        { key: 'heartRate', label: 'Heart Rate', value: Math.round(vitals.heartRate), unit: 'BPM', icon: <Heart className="w-5 h-5" />, type: 'heartRate' },
        { key: 'spo2', label: 'SpO₂', value: vitals.spo2.toFixed(1), unit: '%', icon: <Wind className="w-5 h-5" />, type: 'spo2' },
        { key: 'temp', label: 'Temperature', value: vitals.temperature.toFixed(1), unit: '°F', icon: <Thermometer className="w-5 h-5" />, type: 'temperature' },
        { key: 'bp', label: 'Blood Pressure', value: `${Math.round(vitals.systolic)}/${Math.round(vitals.diastolic)}`, unit: 'mmHg', icon: <Activity className="w-5 h-5" />, type: 'normal' },
        { key: 'steps', label: 'Steps', value: vitals.steps.toLocaleString(), unit: 'steps', icon: <Footprints className="w-5 h-5" />, type: 'normal' },
    ];

    const chartData = {
        labels: liveData.labels,
        datasets: [
            { label: 'Heart Rate (BPM)', data: liveData.heartRate, borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.05)', fill: true, tension: 0.4, pointRadius: 2 },
            { label: 'SpO₂ (%)', data: liveData.spo2, borderColor: '#16a34a', backgroundColor: 'rgba(22,163,74,0.05)', fill: true, tension: 0.4, pointRadius: 2 },
        ]
    };
    const chartOpts = {
        responsive: true, animation: { duration: 300 },
        plugins: { legend: { labels: { color: 'var(--text-secondary)', font: { size: 11 } } }, title: { display: true, text: 'Real-Time Vitals Stream', color: 'var(--text-primary)', font: { size: 13, weight: '600' } } },
        scales: { y: { min: 50, max: 120, ticks: { color: 'var(--text-muted)' }, grid: { color: 'var(--border)' } }, x: { ticks: { color: 'var(--text-muted)', maxTicksLimit: 8 }, grid: { color: 'var(--border)' } } }
    };

    return (
        <div className="container mx-auto px-4 py-24 max-w-5xl">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <div className="mb-10" style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '1.25rem' }}>
                    <span className="section-label mb-3 inline-flex"><Watch className="w-3.5 h-3.5" />IoT Wearable Integration</span>
                    <h1 className="text-4xl font-bold mt-2 mb-1">Real-Time Vitals</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Connect your wearable for continuous monitoring with AI anomaly detection.</p>
                </div>

                {!connected ? (
                    <div className="max-w-2xl mx-auto p-8" style={{ border: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
                        <h2 className="text-base font-semibold mb-5 flex items-center gap-2">
                            <Bluetooth className="w-4 h-4" style={{ color: 'var(--accent)' }} /> Select a Device
                        </h2>
                        <div className="grid sm:grid-cols-3 gap-3">
                            {DEVICES.map(d => (
                                <button key={d.id} onClick={() => connect(d)} disabled={connecting}
                                    className="relative p-5 text-center text-sm transition-all disabled:opacity-50"
                                    style={{ border: '1px solid var(--border)', background: 'var(--bg-elevated)' }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                                    <div className="text-3xl mb-2">{d.icon}</div>
                                    <div className="font-semibold mb-0.5">{d.name}</div>
                                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Tap to connect</div>
                                    {connecting && selectedDevice?.id === d.id && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: 'var(--bg-elevated)' }}>
                                            <div className="loading-spinner mb-1" />
                                            <span className="text-xs" style={{ color: 'var(--accent)' }}>Pairing…</span>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mb-5 px-5 py-3 flex items-center justify-between"
                            style={{ border: '1px solid var(--border-accent)', background: 'var(--bg-surface)' }}>
                            <div className="flex items-center gap-3">
                                <BluetoothConnected className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                                <span className="font-semibold text-sm" style={{ color: 'var(--accent)' }}>{selectedDevice?.name}</span>
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: 'var(--accent)' }} />
                                    <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: 'var(--accent)' }} />
                                </span>
                                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Live</span>
                            </div>
                            <button onClick={disconnect} className="text-xs font-medium" style={{ color: '#ef4444' }}>Disconnect</button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-px mb-5" style={{ background: 'var(--border)' }}>
                            {cards.map((c, idx) => {
                                const raw = c.type === 'heartRate' ? vitals.heartRate : c.type === 'spo2' ? vitals.spo2 : c.type === 'temperature' ? vitals.temperature : 0;
                                const st = c.type !== 'normal' ? getStatus(c.type, raw) : 'normal';
                                return (
                                    <motion.div key={c.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.07 }}
                                        className="p-4 text-center" style={{ background: 'var(--bg-surface)', borderTop: `2px solid ${statusColor(st)}20` }}>
                                        <div className="flex justify-center mb-2" style={{ color: statusColor(st) }}>{c.icon}</div>
                                        <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{c.label}</div>
                                        <div className="text-xl font-bold" style={{ color: statusColor(st) }}>{c.value}</div>
                                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.unit}</div>
                                        {st !== 'normal' && <div className="mt-1 text-xs flex items-center justify-center gap-1" style={{ color: statusColor(st) }}><AlertTriangle className="w-3 h-3" />{st}</div>}
                                    </motion.div>
                                );
                            })}
                        </div>

                        <div className="p-5 mb-5" style={{ border: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
                            <Line data={chartData} options={chartOpts} />
                        </div>

                        {history.length > 0 && (
                            <div style={{ border: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
                                <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)' }}>
                                    <Zap className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                                    <h3 className="font-semibold text-sm">Recent Readings</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                                {['Time','HR (BPM)','SpO₂ (%)','Temp (°F)','BP'].map(h => (
                                                    <th key={h} className="py-2.5 px-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {history.slice(0, 10).map((row, i) => (
                                                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}
                                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                    <td className="py-2.5 px-4" style={{ color: 'var(--text-secondary)' }}>{row.time}</td>
                                                    <td className="py-2.5 px-4 font-medium" style={{ color: statusColor(getStatus('heartRate', row.heartRate)) }}>{Math.round(row.heartRate)}</td>
                                                    <td className="py-2.5 px-4 font-medium" style={{ color: statusColor(getStatus('spo2', row.spo2)) }}>{row.spo2.toFixed(1)}</td>
                                                    <td className="py-2.5 px-4 font-medium" style={{ color: statusColor(getStatus('temperature', row.temperature)) }}>{row.temperature.toFixed(1)}</td>
                                                    <td className="py-2.5 px-4" style={{ color: 'var(--text-secondary)' }}>{row.bp}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </motion.div>
        </div>
    );
}
