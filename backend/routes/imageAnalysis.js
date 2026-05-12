const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const db = require('../config/db');

// @route   POST /api/image-analysis
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { imageThumbnail, originalFileName, condition, severity, relatedConditions, recommendations, bodyPart } = req.body;

        if (!condition || !condition.name) {
            return res.status(400).json({ success: false, message: 'Condition name is required' });
        }

        const { data, error } = await db
            .from('image_analyses')
            .insert({
                user_id: req.user.id,
                image_thumbnail: imageThumbnail || null,
                original_file_name: originalFileName || 'unknown',
                condition,
                severity: severity || { level: 'Mild', confidence: 70 },
                related_conditions: relatedConditions || [],
                recommendations: recommendations || [],
                body_part: bodyPart || 'Unknown'
            })
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({ success: true, data: mapAnalysis(data) });
    } catch (error) {
        console.error('Image analysis save error:', error);
        res.status(500).json({ success: false, message: 'Error saving analysis', error: error.message });
    }
});

// @route   GET /api/image-analysis/history
// @access  Private
router.get('/history', protect, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;

        const { data, error } = await db
            .from('image_analyses')
            .select('id, user_id, original_file_name, condition, severity, related_conditions, recommendations, body_part, created_at')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;

        res.status(200).json({ success: true, data: (data || []).map(mapAnalysis), count: data?.length || 0 });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching history', error: error.message });
    }
});

// @route   GET /api/image-analysis/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const { data, error } = await db
            .from('image_analyses')
            .select('*')
            .eq('id', req.params.id)
            .eq('user_id', req.user.id)
            .single();

        if (error || !data) {
            return res.status(404).json({ success: false, message: 'Analysis not found' });
        }

        res.status(200).json({ success: true, data: mapAnalysis(data) });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching analysis', error: error.message });
    }
});

function mapAnalysis(row) {
    return {
        _id: row.id,
        id: row.id,
        user: row.user_id,
        imageThumbnail: row.image_thumbnail,
        originalFileName: row.original_file_name,
        condition: row.condition,
        severity: row.severity,
        relatedConditions: row.related_conditions,
        recommendations: row.recommendations,
        bodyPart: row.body_part,
        createdAt: row.created_at
    };
}

module.exports = router;
