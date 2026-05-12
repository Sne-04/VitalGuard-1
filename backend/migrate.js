require('dotenv').config();
const { Pool } = require('pg');
const dns = require('dns');
const { URL } = require('url');

dns.setServers(['8.8.8.8', '8.8.4.4']);

async function migrate() {
    const dbUrl = new URL(process.env.DATABASE_URL);
    const host = dbUrl.hostname;
    
    console.log('Resolving...', host);
    const addresses = await dns.promises.resolve4(host);
    const resolvedIp = addresses[0];
    console.log('Connecting to IP...', resolvedIp);
    
    const pool = new Pool({
        user: dbUrl.username,
        password: dbUrl.password,
        host: resolvedIp,
        port: dbUrl.port || 5432,
        database: dbUrl.pathname.slice(1),
        ssl: { 
            rejectUnauthorized: false,
            servername: host
        }
    });

    console.log('Creating tables...');

    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS predictions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id TEXT NOT NULL,
            symptoms JSONB,
            symptom_duration INTEGER,
            patient_info JSONB,
            disease JSONB,
            severity JSONB,
            risk_timeline JSONB,
            triage JSONB,
            explainability JSONB,
            ip_address TEXT,
            user_agent TEXT,
            created_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS lab_reports (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id TEXT NOT NULL,
            file_name TEXT,
            report_date TEXT,
            analysis JSONB,
            created_at TIMESTAMP DEFAULT NOW()
        );
    `);

    console.log('Tables created successfully!');
    process.exit(0);
}

migrate().catch(err => {
    console.error(err);
    process.exit(1);
});
