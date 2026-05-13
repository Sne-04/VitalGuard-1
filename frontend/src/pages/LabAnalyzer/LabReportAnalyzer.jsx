import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import UploadZone from './UploadZone';
import SummaryCard from './SummaryCard';
import ResultsTable from './ResultsTable';
import DoctorQuestions from './DoctorQuestions';
import DownloadReport from './DownloadReport';
import { Activity, Beaker, FileText, ChevronRight, AlertTriangle } from 'lucide-react';

const LabReportAnalyzer = () => {
    const [file, setFile] = useState(null);
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [history, setHistory] = useState([]);
    const [latestPrediction, setLatestPrediction] = useState(null);
    const reportRef = useRef();

    useEffect(() => {
        fetchHistory();
        fetchLatestSymptomPrediction();
    }, []);

    const fetchHistory = async () => {
        try {
            const resp = await api.get('/lab/history');
            if (resp.data.success) setHistory(resp.data.reports);
        } catch (err) {
            console.error('History fetch error:', err);
        }
    };

    const fetchLatestSymptomPrediction = async () => {
        try {
            const resp = await api.get('/predict/history?limit=1');
            if (resp.data.success && resp.data.data.length > 0) {
                setLatestPrediction(resp.data.data[0]);
            }
        } catch (err) {
            console.error('Symptom fetch error:', err);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;
        setLoading(true);
        setError('');
        
        const formData = new FormData();
        formData.append('report', file);

        try {
            const resp = await api.post('/lab/analyze', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (resp.data.success) {
                setReport(resp.data.report);
                // Refresh history
                fetchHistory();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'AI analysis failed. Please try a clearer digital PDF.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-24 pb-48">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2" style={{background:'var(--tag-bg)',border:'1px solid var(--tag-border)'}}>
                                <Beaker className="w-5 h-5" style={{color:'var(--accent)'}} />
                            </div>
                            <h1 className="text-4xl font-bold">Lab Report Analyzer</h1>
                        </div>
                        <p className="text-lg" style={{color:'var(--text-secondary)'}}>Upload blood tests for instant medical-grade AI explanation</p>
                    </div>
                    
                    {latestPrediction && (
                        <div className="p-4 flex items-center gap-4 max-w-sm"
                            style={{background:'rgba(22,163,74,0.06)',border:'1px solid var(--border-accent)'}}>
                            <Activity className="w-9 h-9 flex-shrink-0" style={{color:'var(--accent)'}} />
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{color:'var(--accent)'}}>Recent Symptom Insight</p>
                                <p className="text-sm" style={{color:'var(--text-secondary)'}}>Connected to: <span className="font-bold" style={{color:'var(--text-primary)'}}>{latestPrediction.disease.name}</span></p>
                            </div>
                        </div>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {!report ? (
                        <motion.div 
                            key="upload"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="max-w-2xl mx-auto space-y-6"
                        >
                            <UploadZone file={file} setFile={setFile} loading={loading} />
                            
                            <button
                                onClick={handleAnalyze}
                                disabled={!file || loading}
                                className="w-full btn-primary px-8 py-4 text-base font-bold flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                <FileText className="w-6 h-6" />
                                {loading ? 'Processing Medical Data...' : 'Analyze Report Now'}
                            </button>

                            {error && (
                                <motion.div initial={{opacity:0}} animate={{opacity:1}}
                                    className="px-4 py-3 flex gap-3 text-sm"
                                    style={{background:'rgba(239,68,68,0.06)',border:'1px solid rgba(239,68,68,0.2)',color:'#ef4444'}}>
                                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    {error}
                                </motion.div>
                            )}

                            {/* Recent Analysis Section */}
                            {history.length > 0 && (
                                <div className="mt-12 pt-12 border-t" style={{borderColor:'var(--border)'}}>
                                    <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{color:'var(--text-muted)'}}>Historical Records</h3>
                                    <div className="space-y-3">
                                        {history.slice(0, 3).map((item, i) => (
                                            <div
                                                key={i}
                                                onClick={() => setReport(item)}
                                                className="flex items-center justify-between p-4 cursor-pointer transition-colors"
                                                style={{border:'1px solid var(--border)',background:'var(--bg-surface)'}}
                                                onMouseEnter={e=>e.currentTarget.style.background='var(--bg-elevated)'}
                                                onMouseLeave={e=>e.currentTarget.style.background='var(--bg-surface)'}>
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2" style={{background:'var(--bg-elevated)',color:'var(--text-secondary)'}}>
                                                        <FileText className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p style={{color:'var(--text-primary)'}} className="font-bold">{item.fileName}</p>
                                                        <p className="text-xs" style={{color:'var(--text-muted)'}}>{new Date(item.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-5 h-5" style={{color:'var(--text-muted)'}} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-8"
                            ref={reportRef}
                        >
                            {/* Action Buttons (Floating at top or visible fixed) */}
                            <div className="flex justify-between items-center p-4 sticky top-24 z-30 no-print"
                                style={{background:'var(--bg-elevated)',border:'1px solid var(--border)'}}>
                                <button
                                    onClick={() => setReport(null)}
                                    className="flex items-center gap-2 font-medium"
                                    style={{color:'var(--text-secondary)'}}
                                >
                                    ← Analyze new report
                                </button>
                                <DownloadReport reportId={report._id} printRef={reportRef} />
                            </div>

                            {/* Patient Info Strip */}
                            <div className="p-6" style={{border:'1px solid var(--border)',background:'var(--bg-surface)'}}>
                               <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                                <div>
                                  <p className="text-xs uppercase text-gray-500 font-bold tracking-widest mb-1">Medical Facility</p>
                                  <p className="text-lg font-bold text-white truncate">{report.analysis.patient?.lab || 'Detected Laboratory'}</p>
                                </div>
                                <div>
                                  <p className="text-xs uppercase text-gray-500 font-bold tracking-widest mb-1">Source File</p>
                                  <p className="text-sm font-bold text-primary truncate max-w-[150px]">{report.fileName}</p>
                                </div>
                              </div>
                            </div>

                            {/* Overall Insights */}
                            <div className="p-6" style={{border:'1px solid var(--border-accent)',background:'var(--bg-elevated)'}}>
                                <h3 className="text-xl font-bold mb-2">Internal Health Context</h3>
                                <p className="leading-relaxed" style={{color:'var(--text-secondary)',fontStyle:'italic'}}>"{report.analysis.overallInsight}"</p>
                            </div>

                            <SummaryCard summary={report.analysis.summary} />
                            
                            <ResultsTable results={report.analysis.results} />
                            
                            <DoctorQuestions questions={report.analysis.doctorQuestions} />

                            {/* Correlation Card */}
                            {latestPrediction && (
                              <div className="glass-card p-8 rounded-2xl border-2 border-primary/30 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                  <Brain className="w-32 h-32" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                  <Shield className="w-5 h-5 text-primary" />
                                  Cross-Reference Insights
                                </h3>
                                <div className="space-y-4 max-w-2xl leading-relaxed text-gray-300">
                                  <p>
                                    Our AI has connected these lab results with your recent symptom check for <span className="text-white font-bold underline decoration-primary underline-offset-4">{latestPrediction.disease.name}</span>.
                                  </p>
                                  <p className="bg-white/5 p-4 rounded-xl border-l-4 border-yellow-500 italic">
                                    "Clinical Note: Abnormal markers such as {report.analysis.results.find(r => r.status === 'abnormal')?.test || 'certain indicators'} in this report can often be observed in conditions similar to your predicted diagnosis. This provides a multi-layered view of your current health status."
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Footer Disclaimer */}
                            <div className="text-center pt-12 text-[10px] text-gray-600 uppercase tracking-widest max-w-2xl mx-auto leading-tight">
                              Disclaimer: For informational purposes only. This laboratory analysis is performed by AI and is not a substitute for professional medical advice, clinical diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions regarding lab results.
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default LabReportAnalyzer;
