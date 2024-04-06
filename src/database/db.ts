import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
	user: process.env.DB_USER || 'testuser',
	database: process.env.DB_NAME || 'testdb',
	port: parseInt(process.env.DB_PORT as string) || 5432,
	host: process.env.DB_HOST || 'localhost',
	password: process.env.DB_PASSWORD || 'testpass',
	ssl:
		process.env.NODE_ENV === 'production'
			? { rejectUnauthorized: false }
			: false,
});

export default pool;
