import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
	user: process.env.DB_USER,
	database: process.env.DB_NAME,
	port: parseInt(process.env.DB_PORT as string),
	host: process.env.DB_HOST,
	password: process.env.DB_PASSWORD,
	ssl:
		process.env.NODE_ENV === 'production'
			? { rejectUnauthorized: false }
			: false,
});

export default pool;
