import pool from '../database/db';
import { parseUUID } from '../utils/uuidgenerator.utils';

export async function findEventAllInfoById(eventId: string, userId: string) {
	const uuid = parseUUID(eventId);
	const userUuid = parseUUID(userId);
	const query = `
SELECT
    e.event_id,
    e.user_id,
    e.title,
    e.description,
    e.registration_open,
    e.registration_close,
    e.event_date,
    e.location_type,
    e.created_at       AS event_created_at,
    e.updated_at       AS event_updated_at,
    ea.address_id,
    ea.street,
    ea.city_suburb,
    ea.state,
    ea.country,
    ea.postal_code,
    ea.created_at      AS address_created_at,
    ea.updated_at      AS address_updated_at,
    ei.image_id,
    ei.presigned_url,
    ei.file_url,
    ei.created_at      AS image_created_at,
    ei.updated_at      AS image_updated_at
FROM events AS e
LEFT JOIN event_addresses AS ea
    ON e.event_id = ea.event_id
LEFT JOIN event_images AS ei
    ON e.event_id = ei.event_id
WHERE e.event_id = $1 AND e.user_id = $2;`;

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

export async function findEventsAllInfo() {
	const query = `
SELECT
    e.event_id,
    e.user_id,
    e.title,
    e.description,
    e.registration_open,
    e.registration_close,
    e.event_date,
    e.location_type,
    e.created_at       AS event_created_at,
    e.updated_at       AS event_updated_at,
    ea.address_id,
    ea.street,
    ea.city_suburb,
    ea.state,
    ea.country,
    ea.postal_code,
    ea.created_at      AS address_created_at,
    ea.updated_at      AS address_updated_at,
    ei.image_id,
    ei.presigned_url,
    ei.file_url,
    ei.created_at      AS image_created_at,
    ei.updated_at      AS image_updated_at
FROM events AS e
LEFT JOIN event_addresses AS ea
    ON e.event_id = ea.event_id
LEFT JOIN event_images AS ei
    ON e.event_id = ei.event_id;`;

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

export async function findOtherUsersEventsAllInfo(userId: string) {
	const userUuid = parseUUID(userId);
	const query = `
SELECT
    e.event_id,
    e.user_id,
    e.title,
    e.description,
    e.registration_open,
    e.registration_close,
    e.event_date,
    e.location_type,
    e.created_at       AS event_created_at,
    e.updated_at       AS event_updated_at,
    ea.address_id,
    ea.street,
    ea.city_suburb,
    ea.state,
    ea.country,
    ea.postal_code,
    ea.created_at      AS address_created_at,
    ea.updated_at      AS address_updated_at,
    ei.image_id,
    ei.presigned_url,
    ei.file_url,
    ei.created_at      AS image_created_at,
    ei.updated_at      AS image_updated_at
FROM events AS e
LEFT JOIN event_addresses AS ea
    ON e.event_id = ea.event_id
LEFT JOIN event_images AS ei
    ON e.event_id = ei.event_id
WHERE e.user_id != $1;`;

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
