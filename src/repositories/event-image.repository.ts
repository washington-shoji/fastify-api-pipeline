import pool from '../database/db';
import { EventImageModel } from '../models/event-image-model';
import { generateUUIDv7, parseUUID } from '../utils/uuidgenerator.utils';

export async function createEventImage(imageData: EventImageModel) {
	const { eventId, imageUrl, imageKey } = imageData;
	const uuid = generateUUIDv7();
	const query = `INSERT INTO event_image (id, event_id, image_url, image_key)
    VALUES ($1, $2, $3, $4) Returning *`;

	const client = await pool.connect();

	try {
		await client.query('BEGIN');

		const result = await client.query(query, [
			uuid,
			eventId,
			imageUrl,
			imageKey,
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

export async function updateEventImage(id: string, imageData: EventImageModel) {
	const { imageUrl, imageKey } = imageData;
	const uuid = parseUUID(id);
	const query = `UPDATE event_image SET image_url = COALESCE($1, image_url), image_key = COALESCE($2, image_key), updated_at = NOW() WHERE id = $3 RETURNING *`;

	const client = await pool.connect();

	try {
		await client.query('BEGIN');
		const result = await client.query(query, [imageUrl, imageKey, uuid]);

		await client.query('COMMIT');
		return result.rows[0];
	} catch (error) {
		await client.query('ROLLBACK');
		throw error;
	} finally {
		client.release();
	}
}

export async function deleteEventImage(id: string) {
	const uuid = parseUUID(id);
	const query = `DELETE FROM event_image WHERE id = $1 RETURNING *`;

	const client = await pool.connect();

	try {
		await client.query('BEGIN');
		const result = await client.query(query, [uuid]);

		await client.query('COMMIT');

		return result.rows[0];
	} catch (error) {
		await client.query('ROLLBACK');
		throw error;
	} finally {
		client.release();
	}
}

export async function findEventImageById(id: string) {
	const uuid = parseUUID(id);
	const query = `SELECT * FROM event_image WHERE id = $1`;

	const result = await pool.query(query, [uuid]);

	return result.rows[0];
}

export async function getEventsImage() {
	const query = `SELECT * FROM event_image`;

	const result = await pool.query(query);

	return result.rows;
}
