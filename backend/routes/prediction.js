const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const db = require('../config/db');
const axios = require('axios');
const llmFallback = require('../services/llmFallback');

const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5001';

// In-memory store for demo/offline mode (when no user row exists in DB for demo user)
const inMemoryPredictions = [];

// @route   POST /api/predict
// @access  Private
router.post('/', protect, [
    body('symptoms').isArray({ min: 1 }).withMessage('Please provide at least one symptom'),
    body('duration').isInt({ min: 1 }).withMessage('Duration must be at least 1 day'),
    body('age').isInt({ min: 1, max: 120 }).withMessage('Age must be between 1 and 120'),
    body('gender').isIn(['Male', 'Female', 'Other', 'Not specified']).withMessage('Please select a valid gender')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { symptoms, duration, age, gender, comorbidities } = req.body;

        // Call ML API
        let mlResults;
        try {
            const response = await axios.post(`${ML_API_URL}/predict`, {
                symptoms,
                duration,
                age,
                gender,
                comorbidities: comorbidities || ['none']
            }, { timeout: 30000 });
            mlResults = response.data;
        } catch (mlError) {
            console.warn('⚠️ ML API Error, attempting LLM Fallback:', mlError.message);
            try {
                const systemPrompt = `You are a medical AI API. The user will provide a JSON object with:
symptoms (array of strings), duration (days), age, gender, comorbidities.
Return ONLY valid JSON matching this structure exactly (no markdown):
{
    "disease": { "name": "Predicted Disease Name", "confidence": 85.5 },
    "severity": { "level": "Mild"|"Moderate"|"Severe", "confidence": 80.0 },
    "riskTimeline": {
        "timeline": [ { "day": number, "risk_score": number, "status": "Low/Moderate/High Risk" } ], // array of 7 days
        "peak_risk_day": number,
        "trend": "Stable"|"Increasing"|"Decreasing",
        "recommendations": ["Actionable tip 1", "Actionable tip 2"]
    },
    "triage": {
        "level": "HOME_CARE"|"VISIT_DOCTOR"|"EMERGENCY",
        "title": "Short emoji title",
        "message": "Short explanation",
        "urgency_score": number, // 0-100
        "color": "#10b981"|"#f59e0b"|"#ef4444",
        "actions": ["Action 1", "Action 2"]
    },
    "explainability": {
        "summary": "1 sentence",
        "explanation": "2 sentences",
        "chartData": {
            "labels": ["symptom1", "symptom2"],
            "values": [80, 50],
            "colors": ["rgba(59, 130, 246, 1)", "rgba(59, 130, 246, 0.6)"]
        }
    }
}`;
                const userPrompt = JSON.stringify({ symptoms, duration, age, gender, comorbidities });
                const rawLlmResponse = await llmFallback.analyze(systemPrompt, userPrompt);
                const cleanJson = rawLlmResponse.replace(/```json|```/g, '').trim();
                mlResults = JSON.parse(cleanJson);
                console.log('✅ LLM Fallback successful!');
            } catch (llmError) {
                console.error('❌ LLM Fallback also failed:', llmError.message);
                mlResults = createMockPrediction(symptoms, duration, age, gender, comorbidities);
            }
        }

        // Check if demo user — store in-memory
        const DEMO_USER_ID = '65f1a2b3c4d5e6f7a8b9c0d1';
        const isDemo = req.user.id === DEMO_USER_ID;

        let prediction;
        if (isDemo) {
            prediction = {
                _id: 'pred_' + Date.now(),
                id: 'pred_' + Date.now(),
                user: req.user.id,
                symptoms,
                symptomDuration: duration,
                patientInfo: { age, gender, comorbidities: comorbidities || ['none'] },
                disease: mlResults.disease,
                severity: mlResults.severity,
                riskTimeline: mlResults.riskTimeline,
                triage: mlResults.triage,
                explainability: mlResults.explainability,
                createdAt: new Date().toISOString()
            };
            inMemoryPredictions.unshift(prediction);
        } else {
            // Save to NeonDB
            const { data, error } = await db
                .from('predictions')
                .insert({
                    user_id: req.user.id,
                    symptoms,
                    symptom_duration: duration,
                    patient_info: { age, gender, comorbidities: comorbidities || ['none'] },
                    disease: mlResults.disease,
                    severity: mlResults.severity,
                    risk_timeline: mlResults.riskTimeline,
                    triage: mlResults.triage,
                    explainability: mlResults.explainability,
                    ip_address: req.ip,
                    user_agent: req.headers['user-agent']
                })
                .select()
                .single();

            if (error) {
                console.warn('⚠️  DB save failed, using in-memory:', error.message);
                prediction = {
                    _id: 'pred_' + Date.now(),
                    id: 'pred_' + Date.now(),
                    user: req.user.id,
                    symptoms,
                    symptomDuration: duration,
                    patientInfo: { age, gender, comorbidities: comorbidities || ['none'] },
                    disease: mlResults.disease,
                    severity: mlResults.severity,
                    riskTimeline: mlResults.riskTimeline,
                    triage: mlResults.triage,
                    explainability: mlResults.explainability,
                    createdAt: new Date().toISOString()
                };
                inMemoryPredictions.unshift(prediction);
            } else {
                prediction = mapPrediction(data);
            }
        }

        res.status(200).json({ success: true, data: prediction });
    } catch (error) {
        console.error('Prediction error:', error);
        res.status(500).json({ success: false, message: 'Error generating prediction', error: error.message });
    }
});

// @route   GET /api/predict/history
// @access  Private
router.get('/history', protect, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const DEMO_USER_ID = '65f1a2b3c4d5e6f7a8b9c0d1';
        const isDemo = req.user.id === DEMO_USER_ID;

        let predictions, total;

        if (isDemo) {
            const userPreds = inMemoryPredictions.filter(p => p.user === req.user.id);
            total = userPreds.length;
            predictions = userPreds.slice(from, to + 1);
        } else {
            const { data, error, count } = await db
                .from('predictions')
                .select('*', { count: 'exact' })
                .eq('user_id', req.user.id)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;
            predictions = (data || []).map(mapPrediction);
            total = count || 0;
        }

        res.status(200).json({
            success: true,
            data: predictions,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 }
        });
    } catch (error) {
        console.error('History fetch error:', error);
        res.status(500).json({ success: false, message: 'Error fetching prediction history', error: error.message });
    }
});

// @route   GET /api/predict/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const { id } = req.params;
        const DEMO_USER_ID = '65f1a2b3c4d5e6f7a8b9c0d1';
        const isDemo = req.user.id === DEMO_USER_ID;

        let prediction;
        if (isDemo || id.startsWith('pred_')) {
            prediction = inMemoryPredictions.find(p => (p._id === id || p.id === id) && p.user === req.user.id);
        } else {
            const { data, error } = await db
                .from('predictions')
                .select('*')
                .eq('id', id)
                .eq('user_id', req.user.id)
                .single();
            if (error) throw error;
            prediction = mapPrediction(data);
        }

        if (!prediction) {
            return res.status(404).json({ success: false, message: 'Prediction not found' });
        }

        res.status(200).json({ success: true, data: prediction });
    } catch (error) {
        console.error('Prediction fetch error:', error);
        res.status(500).json({ success: false, message: 'Error fetching prediction', error: error.message });
    }
});

// Map NeonDB row to frontend-expected shape
function mapPrediction(row) {
    return {
        _id: row.id,
        id: row.id,
        user: row.user_id,
        symptoms: row.symptoms,
        symptomDuration: row.symptom_duration,
        patientInfo: row.patient_info,
        disease: row.disease,
        severity: row.severity,
        riskTimeline: row.risk_timeline,
        triage: row.triage,
        explainability: row.explainability,
        createdAt: row.created_at
    };
}

function createMockPrediction(symptoms, duration, age, gender, comorbidities) {
    const disease = determineDiseaseFromSymptoms(symptoms);
    const severity = determineSeverity(symptoms, duration, age);

    const riskTimeline = {
        timeline: Array.from({ length: 7 }, (_, i) => ({
            day: i + 1,
            risk_score: severity === 'Severe' ? 80 + i * 2 : severity === 'Moderate' ? 50 + i : 30 - i,
            status: severity === 'Severe' ? 'High Risk' : severity === 'Moderate' ? 'Moderate Risk' : 'Low Risk'
        })),
        peak_risk_day: severity === 'Severe' ? 7 : 3,
        trend: severity === 'Severe' ? 'Increasing' : 'Stable',
        recommendations: ['💊 Take prescribed medications', '🏥 Monitor symptoms daily', '📞 Contact doctor if symptoms worsen']
    };

    const triage = {
        level: severity === 'Severe' ? 'EMERGENCY' : severity === 'Moderate' ? 'VISIT_DOCTOR' : 'HOME_CARE',
        title: severity === 'Severe' ? '🔴 Emergency Care Needed' : severity === 'Moderate' ? '🟡 Doctor Visit Recommended' : '🟢 Home Care Sufficient',
        message: 'Based on your symptoms, please follow the recommended action.',
        urgency_score: severity === 'Severe' ? 90 : severity === 'Moderate' ? 60 : 30,
        color: severity === 'Severe' ? '#ef4444' : severity === 'Moderate' ? '#f59e0b' : '#10b981',
        actions: ['Monitor symptoms', 'Stay hydrated', 'Get rest']
    };

    return {
        disease: { name: disease, confidence: 85.5 },
        severity: { level: severity, confidence: 80.0 },
        riskTimeline,
        triage,
        explainability: {
            summary: `Your symptoms indicate ${disease}`,
            explanation: 'The model analyzed your symptoms and patient information.',
            chartData: {
                labels: symptoms.slice(0, 5),
                values: [85, 70, 60, 45, 30].slice(0, symptoms.slice(0, 5).length),
                colors: ['rgba(59, 130, 246, 1)', 'rgba(59, 130, 246, 0.8)', 'rgba(59, 130, 246, 0.6)', 'rgba(59, 130, 246, 0.4)', 'rgba(59, 130, 246, 0.2)'].slice(0, symptoms.slice(0, 5).length)
            }
        }
    };
}

function determineDiseaseFromSymptoms(symptoms) {
    const s = symptoms.map(x => x.toLowerCase());
    if (s.some(x => x.includes('fever')) && s.some(x => x.includes('cough'))) return 'Influenza';
    if (s.some(x => x.includes('chest pain'))) return 'Possible Cardiac Issue';
    if (s.some(x => x.includes('headache'))) return 'Migraine';
    return 'Common Cold';
}

function determineSeverity(symptoms, duration, age) {
    if (age > 65 || duration > 7 || symptoms.some(s => s.toLowerCase().includes('severe'))) return 'Severe';
    if (duration > 3 || symptoms.length > 4) return 'Moderate';
    return 'Mild';
}

module.exports = router;
