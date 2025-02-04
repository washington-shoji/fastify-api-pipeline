import pool from '../database/db';
import { EventEntityModel } from '../models/event-model';
import { generateUUIDv7, parseUUID } from '../utils/uuidgenerator.utils';

export async function createEvent(eventData: EventEntityModel) {
	const {
		user_id,
		title,
		description,
		registration_open,
		registration_close,
		event_date,
		location_type,
	} = eventData;
	const userUuid = parseUUID(user_id);
	const uuid = generateUUIDv7();
	const query = `
	INSERT INTO 
	events (
		event_id, 
		user_id, 
		title, 
		description, 
		registration_open, 
		registration_close, 
		event_date,
		location_type
	) 
	VALUES (
		$1, 
		$2, 
		$3, 
		$4, 
		$5, 
		$6, 
		$7,
		$8
	) 
	RETURNING *`;

	const client = await pool.connect();

	try {
		await client.query('BEGIN');
		const result = await client.query(query, [
			uuid,
			userUuid,
			title,
			description,
			registration_open,
			registration_close,
			event_date,
			location_type,
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

export async function updateEvent(eventData: EventEntityModel) {
	const {
		event_id,
		user_id,
		title,
		description,
		registration_open,
		registration_close,
		event_date,
		location_type,
	} = eventData;
	const uuid = parseUUID(event_id as string);
	const userUuid = parseUUID(user_id);
	const query = `
	UPDATE events 
	SET 
		title = COALESCE($1, title), 
		description = COALESCE($2, description), 
		registration_open = COALESCE($3, registration_open), 
		registration_close = COALESCE($4, registration_close),
		event_date = COALESCE($5, event_date),  
		location_type = COALESCE($6, location_type), 
		updated_at = NOW() 
	WHERE 
		event_id = $7 AND user_id = $8  
	RETURNING *`;

	const client = await pool.connect();

	try {
		await client.query('BEGIN');
		const result = await client.query(query, [
			title,
			description,
			registration_open,
			registration_close,
			event_date,
			location_type,
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

export async function deleteEvent(eventId: string, userId: string) {
	const uuid = parseUUID(eventId);
	const userUuid = parseUUID(userId);
	const query = `DELETE FROM events WHERE event_id = $1 AND user_id = $2 RETURNING *`;

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

export async function findEventById(eventId: string, userId: string) {
	const uuid = parseUUID(eventId);
	const userUuid = parseUUID(userId);
	const query = `SELECT * FROM events WHERE event_id = $1 AND user_id = $2`;
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

export async function getOtherUsersEvents(userId: string) {
	const userUuid = parseUUID(userId);
	const query = `
	SELECT * FROM events WHERE user_id != $1`;
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
