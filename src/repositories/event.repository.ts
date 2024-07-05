import pool from '../database/db';
import { EventModel, EventRequestModel } from '../models/event-model';
import { generateUUIDv7, parseUUID } from '../utils/uuidgenerator.utils';

export async function createEvent(
	userId: string,
	eventData: EventRequestModel
) {
	const { title, description, start_time, end_time, location } = eventData;
	const userUuid = parseUUID(userId);
	const uuid = generateUUIDv7();
	const query = `INSERT INTO events (id, user_id, title, description, start_time, end_time, location) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;

	const client = await pool.connect();

	try {
		await client.query('BEGIN');
		const result = await client.query(query, [
			uuid,
			userUuid,
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

export async function updateEvent(
	id: string,
	userId: string,
	eventData: EventModel
) {
	const { title, description, start_time, end_time, location } = eventData;
	const uuid = parseUUID(id);
	const userUuid = parseUUID(userId);
	const query = `UPDATE events SET title = COALESCE($1, title), description = COALESCE($2, description), start_time = COALESCE($3, start_time), end_time = COALESCE($4, end_time), location = COALESCE($5, location), updated_at = NOW() WHERE id = $6 AND user_id = $7  RETURNING *`;

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
			userUuid,
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

export async function deleteEvent(id: string, userId: string) {
	const uuid = parseUUID(id);
	const userUuid = parseUUID(userId);
	const query = `DELETE FROM events WHERE id = $1 AND user_id = $2 RETURNING *`;

	const client = await pool.connect();

	try {
		await client.query('BEGIN');
		const result = await client.query(query, [uuid, userUuid]);

		await client.query('COMMIT');
		return result.rows[0];
	} catch (error) {
		await client.query('ROLLBACK');
		throw error;
	} finally {
		client.release();
	}
}

export async function findEventById(id: string, userId: string) {
	const uuid = parseUUID(id);
	const userUuid = parseUUID(userId);
	const query = `SELECT * FROM events WHERE id = $1 AND user_id = $2`;
	const client = await pool.connect();

	try {
		const result = await client.query(query, [uuid, userUuid]);
		return result.rows[0];
	} catch (error) {
		throw error;
	} finally {
		client.release();
	}
}

export async function getUserEvents(userId: string) {
	const userUuid = parseUUID(userId);
	const query = `SELECT * FROM events WHERE user_id = $1`;
	const client = await pool.connect();

	try {
		const result = await client.query(query, [userUuid]);
		return result.rows;
	} catch (error) {
		throw error;
	} finally {
		client.release();
	}
}

export async function getEvents() {
	const query = `SELECT * FROM events`;
	const client = await pool.connect();

	try {
		const result = await client.query(query);
		return result.rows;
	} catch (error) {
		throw error;
	} finally {
		client.release();
	}
}
