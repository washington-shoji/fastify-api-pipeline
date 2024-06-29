import fs from 'fs';
import path from 'path';
import pool from './db';

async function runMigrations() {
	const migrationFiles = ['users.sql', 'events.sql', 'refresh_token.sql']; // Add more files as needed

	for (const file of migrationFiles) {
		const filePath = path.join(__dirname, 'sql', file);
		const sql = fs.readFileSync(filePath, { encoding: 'utf-8' });
		await pool.query(sql);
	}

	console.log('Database migrations run successfully');
}

export default runMigrations;
