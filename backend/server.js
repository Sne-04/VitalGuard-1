require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const db = require('./config/db');

// Initialize Express app
const app = express();

// Check NeonDB connection on startup
db.from('users').select('count', { count: 'exact', head: true })
    .then(({ error }) => {
        if (error) {
            console.error(`❌ NeonDB connection error: ${error.message}`);
        } else {
            console.log('✅ NeonDB Connected');
        }
    })
    .catch((err) => {
        console.error(`❌ NeonDB network error: ${err.message}`);
    });

// Middleware
app.use(helmet()); // Security headers
// Allow all Vercel preview + production URLs dynamically
const allowedOrigins = [
    'http://localhost:3039',
    'http://localhost:5173',
    // Specific Vercel deployed URL (set in env for production)
    process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        // Allow all vercel.app subdomains
        if (origin.endsWith('.vercel.app') || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100
});
app.use('/api/', limiter);

// Routes
app.use('/api/predict', require('./routes/prediction'));
app.use('/api/vitals', require('./routes/vitals'));
app.use('/api/image-analysis', require('./routes/imageAnalysis'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/lab', require('./routes/lab'));

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'VitalGuard API is running',
        db: 'NeonDB (PostgreSQL)',
        timestamp: new Date().toISOString()
    });
});

// Root route
app.get('/', (req, res) => {
    res.json({
        name: 'VitalGuard AI API',
        version: '1.0.0',
        description: 'Advanced ML-Powered Health Assistant',
        database: 'NeonDB',
        endpoints: {
            auth: '/api/auth',
            predictions: '/api/predict',
            health: '/health'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 VitalGuard API Server`);
    console.log(`📡 Running on port ${PORT} (0.0.0.0)`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API URL: http://0.0.0.0:${PORT}`);
    console.log(`✅ Server started successfully!\n`);
});

module.exports = app;
