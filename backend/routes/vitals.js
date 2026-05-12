const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const db = require('../config/db');

// @route   POST /api/vitals
// @access  Private
router.post('/', protect, [
    body('heartRate').isFloat({ min: 30, max: 250 }).withMessage('Heart rate must be between 30-250 BPM'),
    body('spo2').isFloat({ min: 50, max: 100 }).withMessage('SpO2 must be between 50-100%'),
    body('temperature').isFloat({ min: 90, max: 110 }).withMessage('Temperature must be between 90-110°F')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { heartRate, spo2, temperature, bloodPressure, steps, device } = req.body;

        // Determine status
        let status = 'normal';
        if (heartRate > 120 || heartRate < 50 || spo2 < 90 || temperature > 103) {
            status = 'critical';
        } else if (heartRate > 100 || heartRate < 60 || spo2 < 95 || temperature > 100.4) {
            status = 'warning';
        }

        const { data, error } = await db
            .from('vitals')
            .insert({
                user_id: req.user.id,
                heart_rate: heartRate,
                spo2,
                temperature,
                blood_pressure: bloodPressure || { systolic: 120, diastolic: 80 },
                steps: steps || 0,
                device: device || 'generic_sensor',
                status
            })
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ success: true, data: mapVitals(data) });
    } catch (error) {
        console.error('Vitals save error:', error);
        res.status(500).json({ success: false, message: 'Error saving vitals', error: error.message });
    }
});

// @route   GET /api/vitals/latest
// @access  Private
router.get('/latest', protect, async (req, res) => {
    try {
        const { data, error } = await db
            .from('vitals')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        res.status(200).json({ success: true, data: data ? mapVitals(data) : null });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching vitals', error: error.message });
    }
});

// @route   GET /api/vitals/history
// @access  Private
router.get('/history', protect, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;

        const { data, error } = await db
            .from('vitals')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;

        res.status(200).json({ success: true, data: (data || []).map(mapVitals), count: data?.length || 0 });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching vitals history', error: error.message });
    }
});

function mapVitals(row) {
    return {
        _id: row.id,
        id: row.id,
        user: row.user_id,
        heartRate: row.heart_rate,
        spo2: row.spo2,
        temperature: row.temperature,
        bloodPressure: row.blood_pressure,
        steps: row.steps,
        device: row.device,
        status: row.status,
        createdAt: row.created_at
    };
}

module.exports = router;
