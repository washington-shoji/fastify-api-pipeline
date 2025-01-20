import pool from '../database/db';
import { EventImageModel } from '../models/event-image-model';
import { generateUUIDv7, parseUUID } from '../utils/uuidgenerator.utils';

export async function createEventImage(imageData: EventImageModel) {
	const { eventId, presignedUrl, fileUrl } = imageData;
	const uuid = generateUUIDv7();
	const query = `INSERT INTO event_images (image_id, event_id, presigned_url, file_url)
    VALUES ($1, $2, $3, $4) Returning *`;

	const client = await pool.connect();

	try {
		await client.query('BEGIN');

		const result = await client.query(query, [
			uuid,
			eventId,
			presignedUrl,
			fileUrl,
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
	const { presignedUrl, fileUrl } = imageData;
	const uuid = parseUUID(id);
	const query = `UPDATE event_image SET presigned_url = COALESCE($1, presigned_url), file_url = COALESCE($2, file_url), updated_at = NOW() WHERE image_id = $3 RETURNING *`;

	const client = await pool.connect();

	try {
		await client.query('BEGIN');
		const result = await client.query(query, [presignedUrl, fileUrl, uuid]);

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
	const query = `DELETE FROM event_image WHERE image_id = $1 RETURNING *`;

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
	const query = `SELECT * FROM event_image WHERE image_id = $1`;

	const result = await pool.query(query, [uuid]);

	return result.rows[0];
}

export async function getEventsImage() {
	const query = `SELECT * FROM event_image`;

	const result = await pool.query(query);

	return result.rows;
}

export async function findEventImageByEventId(eventId: string) {
	const uuid = parseUUID(eventId);
	const query = `SELECT * FROM event_images WHERE event_id = $1`;

	const result = await pool.query(query, [uuid]);

	return result.rows[0];
}
