import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { Plus, X, Loader2, Activity, Sparkles } from 'lucide-react';

const ease = [0.16, 1, 0.3, 1];

const COMMON_SYMPTOMS = [
    'Fever', 'Cough', 'Fatigue', 'Headache', 'Sore Throat',
    'Shortness of Breath', 'Chest Pain', 'Nausea', 'Vomiting',
    'Diarrhea', 'Muscle Pain', 'Joint Pain', 'Chills', 'Dizziness',
    'Runny Nose', 'Loss of Appetite', 'Sweating',
];

const SymptomChecker = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [symptoms, setSymptoms] = useState([]);
    const [input, setInput] = useState('');
    const [duration, setDuration] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const addSymptom = (s) => {
        const trimmed = s.trim();
        if (trimmed && !symptoms.includes(trimmed)) {
            setSymptoms(prev => [...prev, trimmed]);
            setInput('');
        }
    };

    const removeSymptom = (s) => setSymptoms(prev => prev.filter(x => x !== s));

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') { e.preventDefault(); addSymptom(input); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!symptoms.length) { setError('Add at least one symptom to continue.'); return; }
        if (!duration || +duration < 1) { setError('Please enter how many days you have had these symptoms.'); return; }

        setLoading(true);
        try {
            const { data } = await api.post('/predict', {
                symptoms,
                duration: parseInt(duration),
                age: user?.age || 30,
                gender: user?.gender || 'Not specified',
                comorbidities: user?.medicalHistory?.comorbidities?.length
                    ? user.medicalHistory.comorbidities
                    : ['none'],
            });
            navigate(`/results/${data.data._id}`, { state: { prediction: data.data } });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to get prediction. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-16 px-4">
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center">
                            <Activity className="w-5 h-5 text-blue-400" />
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">
                            Symptom Analysis
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">What are you feeling?</h1>
                    <p className="text-slate-400 text-sm">
                        Tell us your symptoms and our AI will assess severity, predict progression, and recommend next steps.
                    </p>
                </motion.div>

                {/* Error */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="mb-6 flex items-start gap-3 bg-red-500/8 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm"
                        >
                            <X className="w-4 h-4 mt-0.5 shrink-0" />
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease, delay: 0.1 }}
                    className="space-y-6"
                >
                    {/* Symptom Input */}
                    <div className="surface-card p-6">
                        <label className="block text-sm font-semibold text-white mb-4">
                            Symptoms
                        </label>

                        {/* Input row */}
                        <div className="flex gap-2 mb-5">
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type a symptom and press Enter…"
                                className="input-field flex-1 text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => addSymptom(input)}
                                className="btn-primary !px-3 !py-2.5 shrink-0"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Common chips */}
                        <div className="mb-4">
                            <p className="text-xs text-slate-500 font-medium mb-2.5 uppercase tracking-wider">Common symptoms</p>
                            <div className="flex flex-wrap gap-2">
                                {COMMON_SYMPTOMS.map(s => {
                                    const selected = symptoms.includes(s);
                                    return (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => selected ? removeSymptom(s) : addSymptom(s)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border ${
                                                selected
                                                    ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                                                    : 'bg-transparent text-slate-400 border-white/8 hover:border-white/20 hover:text-slate-200'
                                            }`}
                                        >
                                            {selected && <span className="mr-1">✓</span>}
                                            {s}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Selected tags */}
                        <AnimatePresence>
                            {symptoms.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="pt-4 border-t border-white/6"
                                >
                                    <p className="text-xs text-slate-500 mb-2.5 font-medium">
                                        Selected · {symptoms.length}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {symptoms.map(s => (
                                            <motion.span
                                                key={s}
                                                layout
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.8, opacity: 0 }}
                                                className="flex items-center gap-1.5 bg-blue-500/12 text-blue-300 border border-blue-500/25 px-3 py-1.5 rounded-lg text-xs font-medium"
                                            >
                                                {s}
                                                <button
                                                    type="button"
                                                    onClick={() => removeSymptom(s)}
                                                    className="hover:text-white transition-colors ml-0.5"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </motion.span>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Duration */}
                    <div className="surface-card p-6">
                        <label className="block text-sm font-semibold text-white mb-1">
                            Duration
                        </label>
                        <p className="text-xs text-slate-500 mb-4">How many days have you had these symptoms?</p>
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                value={duration}
                                onChange={e => setDuration(e.target.value)}
                                min="1"
                                max="365"
                                placeholder="e.g. 3"
                                className="input-field max-w-[140px] text-sm"
                            />
                            <span className="text-slate-500 text-sm">days</span>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading || symptoms.length === 0}
                        className="w-full btn-primary py-3.5 text-[15px] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Analyzing your symptoms…
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                Get AI Diagnosis
                            </>
                        )}
                    </button>

                    <p className="text-center text-xs text-slate-600">
                        This is an AI tool for informational purposes only. Always consult a qualified healthcare provider.
                    </p>
                </motion.form>
            </div>
        </div>
    );
};

export default SymptomChecker;
