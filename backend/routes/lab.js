const express = require('express');
const multer = require('multer');
const { PdfReader } = require('pdfreader');

const { protect } = require('../middleware/auth');
const db = require('../config/db');

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    }
});

const llmFallback = require('../services/llmFallback');

// Helper: extract text from PDF buffer using pdfreader
function extractTextFromPDF(buffer) {
    return new Promise((resolve, reject) => {
        let text = '';
        new PdfReader().parseBuffer(buffer, (err, item) => {
            if (err) {
                reject(err);
            } else if (!item) {
                resolve(text);
            } else if (item.text) {
                text += item.text + ' ';
            }
        });
    });
}

router.post('/analyze', protect, (req, res, next) => {
    // Handle multer errors (file too large, wrong type) before the async handler
    upload.single('report')(req, res, (multerErr) => {
        if (multerErr) {
            if (multerErr.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ success: false, message: 'File too large. Maximum allowed size is 25 MB.' });
            }
            return res.status(400).json({ success: false, message: multerErr.message });
        }
        next();
    });
}, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        let extractedText;
        try {
            extractedText = await extractTextFromPDF(req.file.buffer);
        } catch (parseErr) {
            console.error('PDF parse error:', parseErr);
            return res.status(400).json({
                success: false,
                message: 'Failed to parse the PDF. Please ensure it is a valid, non-scanned PDF file.'
            });
        }

        if (!extractedText || extractedText.trim().length < 10) {
            return res.status(400).json({
                success: false,
                message: 'This appears to be a scanned or image-based PDF with no extractable text. Please upload a digital (text-based) PDF.'
            });
        }

        const systemPrompt = `You are a medical lab report analyzer. The user has uploaded a lab report.
Extract ALL test values and return ONLY a valid JSON object.
No preamble, no markdown, no explanation outside the JSON.

Return this exact structure:
{
  "patient": {
    "name": "string or null",
    "date": "string or null",
    "lab": "string or null"
  },
  "summary": {
    "total": number,
    "normal": number,
    "borderline": number,
    "abnormal": number
  },
  "results": [
    {
      "test": "Test name",
      "value": "e.g. 11.2",
      "unit": "e.g. g/dL",
      "normalRange": "e.g. 12.0 - 17.5",
      "status": "normal" | "borderline" | "abnormal",
      "plainEnglish": "One sentence explanation a non-doctor can understand",
      "detail": "2-3 sentence deeper explanation of what this means for health",
      "concern": "What symptom or condition this could relate to (or null)"
    }
  ],
  "doctorQuestions": [
    "Question 1 to ask doctor",
    "Question 2 to ask doctor",
    "Question 3 to ask doctor"
  ],
  "overallInsight": "2-3 sentence plain English summary of the overall report"
}`;

        const rawText = await llmFallback.analyze(systemPrompt, `Lab Report Text:\n${extractedText}`);

        // Robust JSON extraction — strip markdown fences and trailing noise
        let analysis;
        try {
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error('No JSON object found in LLM response');
            analysis = JSON.parse(jsonMatch[0]);
        } catch (jsonErr) {
            console.error('JSON parse error:', jsonErr.message, '\nRaw LLM output:', rawText?.slice(0, 500));
            return res.status(422).json({
                success: false,
                message: 'The AI could not produce a structured analysis for this report. Try a cleaner digital PDF or a different report.'
            });
        }

        if (!analysis.results || analysis.results.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No lab values detected. Please ensure this is a blood/lab report.'
            });
        }

        const { data: report, error } = await db
            .from('lab_reports')
            .insert({
                user_id: req.user.id,
                file_name: req.file.originalname,
                report_date: analysis.patient?.date || new Date().toISOString(),
                analysis
            })
            .select()
            .single();

        if (error) throw error;

        res.json({ success: true, report: mapReport(report) });
    } catch (err) {
        console.error('Lab Analysis Error:', err);
        res.status(500).json({ success: false, message: err.message || 'Internal server error' });
    }
});

router.get('/history', protect, async (req, res) => {
    try {
        const { data, error } = await db
            .from('lab_reports')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.json({ success: true, reports: (data || []).map(mapReport) });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

function mapReport(row) {
    return {
        _id: row.id,
        id: row.id,
        userId: row.user_id,
        fileName: row.file_name,
        reportDate: row.report_date,
        analysis: row.analysis,
        createdAt: row.created_at
    };
}

module.exports = router;
