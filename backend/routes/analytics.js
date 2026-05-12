const express = require('express');
const router = express.Router();
const db = require('../config/db');

// @route   GET /api/analytics/overview
// @access  Public
router.get('/overview', async (req, res) => {
    try {
        const { count: totalPredictions } = await db
            .from('predictions')
            .select('*', { count: 'exact', head: true });

        const last30Days = new Date();
        last30Days.setDate(last30Days.getDate() - 30);

        const { count: recentCount } = await db
            .from('predictions')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', last30Days.toISOString());

        // Severity distribution — fetch all and group in JS
        const { data: allPreds } = await db
            .from('predictions')
            .select('severity');

        const severityMap = {};
        (allPreds || []).forEach(p => {
            const level = p.severity?.level || 'Unknown';
            severityMap[level] = (severityMap[level] || 0) + 1;
        });
        const severityDistribution = Object.entries(severityMap).map(([_id, count]) => ({ _id, count }));

        // Top diseases
        const { data: diseasePreds } = await db
            .from('predictions')
            .select('disease');

        const diseaseMap = {};
        (diseasePreds || []).forEach(p => {
            const name = p.disease?.name || 'Unknown';
            diseaseMap[name] = (diseaseMap[name] || 0) + 1;
        });
        const topDiseases = Object.entries(diseaseMap)
            .map(([_id, count]) => ({ _id, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        res.status(200).json({
            success: true,
            data: {
                totalPredictions: totalPredictions || 0,
                recentPredictions: recentCount || 0,
                severityDistribution,
                topDiseases,
                lastUpdated: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Analytics overview error:', error);
        res.status(500).json({ success: false, message: 'Error fetching analytics', error: error.message });
    }
});

// @route   GET /api/analytics/trends
// @access  Public
router.get('/trends', async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const { data: preds } = await db
            .from('predictions')
            .select('created_at, symptoms, disease')
            .gte('created_at', startDate.toISOString());

        // Daily trends
        const dailyMap = {};
        const symptomMap = {};
        const diseaseDistMap = {};

        (preds || []).forEach(p => {
            const day = p.created_at.slice(0, 10);
            dailyMap[day] = (dailyMap[day] || 0) + 1;

            const symptoms = Array.isArray(p.symptoms) ? p.symptoms : [];
            symptoms.forEach(s => {
                symptomMap[s] = (symptomMap[s] || 0) + 1;
            });

            const name = p.disease?.name || 'Unknown';
            diseaseDistMap[name] = (diseaseDistMap[name] || 0) + 1;
        });

        const dailyTrends = Object.entries(dailyMap)
            .map(([_id, count]) => ({ _id, count }))
            .sort((a, b) => a._id.localeCompare(b._id));

        const topSymptoms = Object.entries(symptomMap)
            .map(([_id, count]) => ({ _id, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        const diseaseDistribution = Object.entries(diseaseDistMap)
            .map(([_id, count]) => ({ _id, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        res.status(200).json({
            success: true,
            data: {
                dailyTrends,
                topSymptoms,
                diseaseDistribution,
                dateRange: { start: startDate, end: new Date(), days }
            }
        });
    } catch (error) {
        console.error('Analytics trends error:', error);
        res.status(500).json({ success: false, message: 'Error fetching trends', error: error.message });
    }
});

// @route   GET /api/analytics/severity-distribution
// @access  Public
router.get('/severity-distribution', async (req, res) => {
    try {
        const { data: preds } = await db
            .from('predictions')
            .select('severity, triage');

        const severityMap = {};
        const triageMap = {};

        (preds || []).forEach(p => {
            const level = p.severity?.level || 'Unknown';
            if (!severityMap[level]) severityMap[level] = { count: 0, totalConf: 0 };
            severityMap[level].count++;
            severityMap[level].totalConf += p.severity?.confidence || 0;

            const tLevel = p.triage?.level || 'Unknown';
            triageMap[tLevel] = (triageMap[tLevel] || 0) + 1;
        });

        const severityDistribution = Object.entries(severityMap).map(([_id, v]) => ({
            _id,
            count: v.count,
            avgConfidence: v.count ? v.totalConf / v.count : 0
        }));

        const triageDistribution = Object.entries(triageMap)
            .map(([_id, count]) => ({ _id, count }))
            .sort((a, b) => b.count - a.count);

        res.status(200).json({
            success: true,
            data: { severityDistribution, triageDistribution }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching distribution', error: error.message });
    }
});

module.exports = router;
