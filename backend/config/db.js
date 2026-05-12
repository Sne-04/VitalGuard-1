const { Pool } = require('pg');
const dns = require('dns');
const { URL } = require('url');

// Force Node.js dns.resolve to use Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

let poolPromise = createPool();

async function createPool() {
    try {
        const dbUrl = new URL(process.env.DATABASE_URL);
        const host = dbUrl.hostname;
        
        // Resolve host manually using Google DNS
        const addresses = await dns.promises.resolve4(host);
        if (!addresses || addresses.length === 0) throw new Error("Could not resolve " + host);
        const resolvedIp = addresses[0];
        
        return new Pool({
            user: dbUrl.username,
            password: dbUrl.password,
            host: resolvedIp,
            port: dbUrl.port || 5432,
            database: dbUrl.pathname.slice(1),
            ssl: { 
                rejectUnauthorized: false,
                servername: host // SNI is required by Neon!
            }
        });
    } catch (err) {
        console.warn('⚠️ Custom DNS resolution failed, falling back to connectionString:', err.message);
        return new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        });
    }
}

class QueryBuilder {
    constructor(table, poolPromise) {
        this.table = table;
        this.poolPromise = poolPromise;
        this._select = '*';
        this._where = [];
        this._params = [];
        this._order = null;
        this._limit = null;
        this._single = false;
        this._insert = null;
        this._countOnly = false;
    }

    select(cols = '*', options = {}) {
        if (cols === 'count' && options.count === 'exact') {
            this._countOnly = true;
            this._select = 'COUNT(*) as count';
        } else {
            this._select = cols;
            if (options.count === 'exact') {
                this._includeCount = true;
                // Use a window function to get total count in Postgres
                this._select += ', COUNT(*) OVER() as _total_count';
            }
        }
        return this;
    }

    eq(col, val) {
        this._params.push(val);
        this._where.push(`"${col}" = $${this._params.length}`);
        return this;
    }

    gte(col, val) {
        this._params.push(val);
        this._where.push(`"${col}" >= $${this._params.length}`);
        return this;
    }

    single() {
        this._single = true;
        this._limit = 1;
        return this;
    }

    order(col, options = { ascending: true }) {
        this._order = `"${col}" ${options.ascending ? 'ASC' : 'DESC'}`;
        return this;
    }

    limit(n) {
        this._limit = n;
        return this;
    }

    insert(data) {
        this._insert = Array.isArray(data) ? data : [data];
        return this;
    }

    async then(resolve, reject) {
        try {
            const pool = await this.poolPromise;
            let text = '';
            let isInsert = !!this._insert;

            if (isInsert) {
                const keys = Object.keys(this._insert[0]);
                const cols = keys.map(k => `"${k}"`).join(', ');
                
                const vals = [];
                for (let i = 0; i < keys.length; i++) {
                    let val = this._insert[0][keys[i]];
                    // PostgreSQL JSONB columns need stringified JSON
                    if (val !== null && typeof val === 'object') {
                        val = JSON.stringify(val);
                    }
                    this._params.push(val);
                    vals.push(`$${this._params.length}`);
                }
                text = `INSERT INTO "${this.table}" (${cols}) VALUES (${vals.join(', ')}) RETURNING ${this._select.replace(', COUNT(*) OVER() as _total_count', '')}`;
            } else {
                text = `SELECT ${this._select} FROM "${this.table}"`;
                if (this._where.length > 0) {
                    text += ` WHERE ${this._where.join(' AND ')}`;
                }
                if (this._order) {
                    text += ` ORDER BY ${this._order}`;
                }
                if (this._limit) {
                    text += ` LIMIT ${this._limit}`;
                }
            }

            const res = await pool.query(text, this._params);

            if (this._countOnly) {
                return resolve({ count: parseInt(res.rows[0]?.count || 0, 10), data: null, error: null });
            }

            let finalData = res.rows;
            let count = null;

            if (this._includeCount && finalData.length > 0) {
                count = parseInt(finalData[0]._total_count, 10);
                // Remove the internal property from results
                finalData.forEach(row => delete row._total_count);
            } else if (this._includeCount) {
                count = 0;
            }

            if (this._single) {
                if (finalData.length === 0) {
                    return resolve({ data: null, error: new Error('No rows found') });
                }
                finalData = finalData[0];
            }

            resolve({ data: finalData, error: null, count });
        } catch (err) {
            resolve({ data: null, error: err, count: null });
        }
    }
}

const db = {
    from: (table) => new QueryBuilder(table, poolPromise)
};

module.exports = db;
