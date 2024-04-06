import pool from '../database/db';
import { EventModel } from '../models/event-model';
import { generateUUIDv7, parseUUID } from '../utils/uuidgenerator.utils';

export async function createEvent(eventData: EventModel) {
	const { title, description, start_time, end_time, location } = eventData;
	const uuid = generateUUIDv7();
	const query = `INSERT INTO events (id, title, description, start_time, end_time, location) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;

	const client = await pool.connect();

	try {
		await client.query('BEGIN');
		const result = await client.query(query, [
			uuid,
			title,
			description,
			start_time,
			end_time,
			location,
		]);

		await client.query('COMMIT');
		return result.rows[0];
	} catch (error) {
		await client.query('ROLLBACK');
		throw error;
	} finally {
		client.release();
	}
}

export async function updateEvent(id: string, eventData: EventModel) {
	const { title, description, start_time, end_time, location } = eventData;
	const uuid = parseUUID(id);
	const query = `UPDATE events SET title = COALESCE($1, title), description = COALESCE($2, description), start_time = COALESCE($3, start_time), end_time = COALESCE($4, end_time), location = COALESCE($5, location), updated_at = NOW() WHERE id = $6 RETURNING *`;

	const client = await pool.connect();

	try {
		await client.query('BEGIN');
		const result = await client.query(query, [
			title,
			description,
			start_time,
			end_time,
			location,
			uuid,
		]);

		await client.query('COMMIT');
		return result.rows[0];
	} catch (error) {
		await client.query('ROLLBACK');
		throw error;
	} finally {
		client.release();
	}
}

export async function deleteEvent(id: string) {
	const uuid = parseUUID(id);
	const query = `DELETE FROM events WHERE id = $1 RETURNING *`;

	const client = await pool.connect();

	try {
		await client.query('BEGIN');
		const result = await client.query(query, [uuid]);

		//console.log('result', result);

		await client.query('COMMIT');
		return result.rows[0];
	} catch (error) {
		await client.query('ROLLBACK');
		throw error;
	} finally {
		client.release();
	}
}

export async function findEventById(id: string) {
	const uuid = parseUUID(id);
	const query = `SELECT * FROM events WHERE id = $1`;
	const client = await pool.connect();
	const result = await client.query(query, [uuid]);
	return result.rows[0];
}

export async function getEvents() {
	const query = `SELECT * FROM events`;
	const client = await pool.connect();
	const result = await client.query(query);
	return result.rows;
}
