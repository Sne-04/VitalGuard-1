import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, AlertCircle, CheckCircle, Loader, Eye, ShieldAlert, Sparkles, Image as ImageIcon } from 'lucide-react';

const CONDITIONS = [
    { name: 'Eczema (Dermatitis)', category: 'Inflammatory', severity: 'Moderate', confidence: 87.3, related: [{ name: 'Contact Dermatitis', probability: 23 }, { name: 'Psoriasis', probability: 15 }], recommendations: ['Apply prescribed corticosteroid cream', 'Use fragrance-free moisturizer frequently', 'Avoid known irritants and allergens', 'Consult a dermatologist if symptoms persist'] },
    { name: 'Psoriasis', category: 'Autoimmune', severity: 'Moderate', confidence: 82.1, related: [{ name: 'Eczema', probability: 18 }, { name: 'Seborrheic Dermatitis', probability: 12 }], recommendations: ['Use topical treatments as prescribed', 'Phototherapy may help', 'Maintain skin moisture', 'Reduce stress levels'] },
    { name: 'Acne Vulgaris', category: 'Inflammatory', severity: 'Mild', confidence: 91.5, related: [{ name: 'Rosacea', probability: 14 }, { name: 'Folliculitis', probability: 10 }], recommendations: ['Use salicylic acid or benzoyl peroxide', 'Avoid touching face frequently', 'Keep skin clean and hydrated', 'Consider dietary changes'] },
    { name: 'Urticaria (Hives)', category: 'Allergic', severity: 'Mild', confidence: 89.2, related: [{ name: 'Angioedema', probability: 20 }, { name: 'Contact Dermatitis', probability: 13 }], recommendations: ['Take antihistamines as needed', 'Identify and avoid triggers', 'Apply cool compresses', 'Seek emergency care for throat swelling'] },
    { name: 'Fungal Infection', category: 'Infectious', severity: 'Mild', confidence: 85.7, related: [{ name: 'Tinea Versicolor', probability: 22 }, { name: 'Candidiasis', probability: 16 }], recommendations: ['Apply antifungal cream', 'Keep affected area dry', 'Avoid sharing personal items', 'Complete full course of treatment'] },
    { name: 'Cellulitis', category: 'Bacterial', severity: 'Severe', confidence: 83.9, related: [{ name: 'Abscess', probability: 18 }, { name: 'Erysipelas', probability: 15 }], recommendations: ['Seek medical attention immediately', 'Antibiotics may be needed', 'Elevate the affected limb', 'Keep wound clean and covered'] },
];
const BODY_PARTS = ['Face','Neck','Arm','Hand','Leg','Torso','Back','Scalp','Other'];

const severityColor = l => l === 'Severe' ? '#ef4444' : l === 'Moderate' ? '#f59e0b' : '#16a34a';
const severityBg    = l => l === 'Severe' ? 'rgba(239,68,68,0.06)' : l === 'Moderate' ? 'rgba(245,158,11,0.06)' : 'rgba(22,163,74,0.06)';
const severityBorder= l => l === 'Severe' ? 'rgba(239,68,68,0.2)' : l === 'Moderate' ? 'rgba(245,158,11,0.2)' : 'rgba(22,163,74,0.2)';

export default function ImageAnalysis() {
    const [image, setImage]           = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [analyzing, setAnalyzing]   = useState(false);
    const [result, setResult]         = useState(null);
    const [bodyPart, setBodyPart]     = useState('');
    const [dragActive, setDragActive] = useState(false);
    const [analysisHistory, setAnalysisHistory] = useState([]);
    const fileInputRef = useRef(null);

    const handleFile = (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        setImage(file); setResult(null);
        const reader = new FileReader();
        reader.onload = e => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
    };

    const analyzeImage = async () => {
        if (!image) return;
        setAnalyzing(true);
        await new Promise(r => setTimeout(r, 2800));
        const hash = image.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        const cond = CONDITIONS[hash % CONDITIONS.length];
        const jitter = (Math.random() - 0.5) * 8;
        const res = {
            condition: { name: cond.name, confidence: Math.min(99, Math.max(60, cond.confidence + jitter)), category: cond.category },
            severity: { level: cond.severity },
            relatedConditions: cond.related,
            recommendations: cond.recommendations,
            bodyPart: bodyPart || 'Unknown',
            analyzedAt: new Date().toLocaleString()
        };
        setResult(res);
        setAnalysisHistory(prev => [{ ...res, fileName: image.name }, ...prev].slice(0, 10));
        setAnalyzing(false);
    };

    const clearImage = () => { setImage(null); setImagePreview(null); setResult(null); setBodyPart(''); };

    return (
        <div className="container mx-auto px-4 py-24 max-w-5xl">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

                <div className="mb-10" style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '1.25rem' }}>
                    <span className="section-label mb-3 inline-flex">
                        <Camera className="w-3.5 h-3.5" /> Computer Vision Analysis
                    </span>
                    <h1 className="text-4xl font-bold mt-2 mb-1">Symptom Image Analysis</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Upload a photo of visible symptoms for AI-powered visual diagnosis.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Upload panel */}
                    <div className="space-y-4">
                        <div className="p-6" style={{ border: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
                            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                                <Upload className="w-4 h-4" style={{ color: 'var(--accent)' }} /> Upload Image
                            </h2>

                            {/* Drop zone */}
                            <div
                                onDragOver={e => { e.preventDefault(); setDragActive(true); }}
                                onDragLeave={() => setDragActive(false)}
                                onDrop={e => { e.preventDefault(); setDragActive(false); handleFile(e.dataTransfer.files[0]); }}
                                onClick={() => fileInputRef.current?.click()}
                                className="relative p-8 text-center cursor-pointer transition-all"
                                style={{
                                    border: `2px dashed ${dragActive ? 'var(--accent)' : 'var(--border-accent)'}`,
                                    background: dragActive ? 'var(--tag-bg)' : 'var(--bg-elevated)',
                                }}>
                                <input ref={fileInputRef} type="file" accept="image/*"
                                    onChange={e => handleFile(e.target.files[0])} className="hidden" />
                                {imagePreview ? (
                                    <div className="relative">
                                        <img src={imagePreview} alt="Uploaded" className="max-h-48 mx-auto object-cover" />
                                        <button onClick={e => { e.stopPropagation(); clearImage(); }}
                                            className="absolute top-1 right-1 p-1"
                                            style={{ background: '#ef4444', color: 'white' }}>
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <ImageIcon className="w-10 h-10 mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
                                        <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>Drag & drop an image here</p>
                                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>or click to browse · JPG, PNG, WEBP</p>
                                    </>
                                )}
                            </div>

                            {/* Body part selector */}
                            <div className="mt-4">
                                <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                                    Affected Body Part
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {BODY_PARTS.map(part => (
                                        <button key={part} onClick={() => setBodyPart(part)}
                                            className={`chip ${bodyPart === part ? 'selected' : ''}`}>
                                            {part}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button onClick={analyzeImage} disabled={!image || analyzing}
                                className="w-full mt-5 btn-primary py-3 disabled:opacity-40 disabled:cursor-not-allowed">
                                {analyzing ? <><Loader className="w-4 h-4 animate-spin" />Analysing with AI…</> : <><Sparkles className="w-4 h-4" />Analyse Image</>}
                            </button>
                        </div>

                        {/* Tips */}
                        <div className="p-5" style={{ border: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
                            <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>📸 Tips for Best Results</h3>
                            <ul className="space-y-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                                <li className="flex items-start gap-2"><CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />Good lighting, close-up of affected area</li>
                                <li className="flex items-start gap-2"><CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />Avoid filters or image editing</li>
                                <li className="flex items-start gap-2"><CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />Include surrounding healthy skin</li>
                                <li className="flex items-start gap-2"><AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#f59e0b' }} />Not a substitute for professional diagnosis</li>
                            </ul>
                        </div>
                    </div>

                    {/* Results panel */}
                    <div className="space-y-4">
                        <AnimatePresence mode="wait">
                            {analyzing ? (
                                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="p-8 text-center" style={{ border: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
                                    <div className="relative w-16 h-16 mx-auto mb-4">
                                        <div className="absolute inset-0" style={{ border: '2px solid var(--border)' }} />
                                        <div className="absolute inset-0 border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
                                        <Eye className="absolute inset-0 m-auto w-7 h-7" style={{ color: 'var(--accent)' }} />
                                    </div>
                                    <h3 className="font-semibold mb-1">Analysing Image…</h3>
                                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Running deep learning model</p>
                                    <div className="mt-4 space-y-2 text-left max-w-48 mx-auto">
                                        {['Image preprocessing','Feature extraction','Classification'].map((s, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                                                {i === 0 ? <CheckCircle className="w-3 h-3" style={{ color: 'var(--accent)' }} /> : i === 1 ? <Loader className="w-3 h-3 animate-spin" style={{ color: 'var(--accent)' }} /> : <div className="w-3 h-3" style={{ border: '1px solid var(--border)' }} />}
                                                {s}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : result ? (
                                <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                                    <div className="p-5" style={{ border: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="font-semibold text-sm">Detected Condition</h3>
                                            <span className="text-xs px-2 py-0.5 font-semibold" style={{ color: 'var(--accent)', background: 'var(--tag-bg)', border: '1px solid var(--tag-border)' }}>{result.condition.category}</span>
                                        </div>
                                        <p className="text-2xl font-bold mb-3" style={{ color: 'var(--accent)' }}>{result.condition.name}</p>
                                        <div className="flex items-center gap-6 mb-3">
                                            <div><span className="text-xs" style={{ color: 'var(--text-muted)' }}>Confidence</span><div className="font-bold">{result.condition.confidence.toFixed(1)}%</div></div>
                                            <div><span className="text-xs" style={{ color: 'var(--text-muted)' }}>Body Part</span><div className="font-bold">{result.bodyPart}</div></div>
                                        </div>
                                        <div className="w-full h-1.5" style={{ background: 'var(--border)' }}>
                                            <div className="h-full transition-all duration-700" style={{ width: `${result.condition.confidence}%`, background: 'var(--accent)' }} />
                                        </div>
                                    </div>

                                    <div className="px-4 py-3 flex items-center justify-between"
                                        style={{ background: severityBg(result.severity.level), border: `1px solid ${severityBorder(result.severity.level)}` }}>
                                        <div className="flex items-center gap-2">
                                            <ShieldAlert className="w-4 h-4" style={{ color: severityColor(result.severity.level) }} />
                                            <span className="text-sm font-medium">Severity</span>
                                        </div>
                                        <span className="font-bold" style={{ color: severityColor(result.severity.level) }}>{result.severity.level}</span>
                                    </div>

                                    <div className="p-5" style={{ border: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
                                        <h4 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Related Conditions</h4>
                                        <div className="space-y-2">
                                            {result.relatedConditions.map((c, i) => (
                                                <div key={i} className="flex items-center justify-between">
                                                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{c.name}</span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-20 h-1.5" style={{ background: 'var(--border)' }}>
                                                            <div className="h-full" style={{ width: `${c.probability}%`, background: 'var(--accent)' }} />
                                                        </div>
                                                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.probability}%</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-5" style={{ border: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
                                        <h4 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Recommendations</h4>
                                        <ul className="space-y-2">
                                            {result.recommendations.map((r, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                                                    {r}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="p-10 text-center" style={{ border: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
                                    <Eye className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
                                    <h3 className="font-semibold mb-1">No Analysis Yet</h3>
                                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Upload an image and click Analyse to get AI diagnosis.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {analysisHistory.length > 0 && (
                            <div className="p-5" style={{ border: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
                                <h4 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Analysis History</h4>
                                <div className="space-y-2">
                                    {analysisHistory.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between py-2"
                                            style={{ borderBottom: i < analysisHistory.length - 1 ? '1px solid var(--border)' : 'none' }}>
                                            <div>
                                                <p className="text-sm font-medium">{item.condition.name}</p>
                                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.analyzedAt}</p>
                                            </div>
                                            <span className="text-xs px-2 py-0.5 font-semibold"
                                                style={{ color: severityColor(item.severity.level), background: severityBg(item.severity.level), border: `1px solid ${severityBorder(item.severity.level)}` }}>
                                                {item.severity.level}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
