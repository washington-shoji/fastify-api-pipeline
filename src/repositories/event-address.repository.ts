import pool from '../database/db';
import { EventAddressModel } from '../models/event-address-model';
import { generateUUIDv7, parseUUID } from '../utils/uuidgenerator.utils';

export async function createEventAddress(addressData: EventAddressModel) {
	const { eventId, street, city, state, country, postal_code } = addressData;
	const uuid = generateUUIDv7();
	const query = `INSERT INTO event_addresses (id, event_id, street, city, state, country, postal_code)
    VALUES ($1, $2, $3, $4, $5, $6, $7) Returning *`;
	const result = await pool.query(query, [
		uuid,
		eventId,
		street,
		city,
		state,
		country,
		postal_code,
	]);

	return result.rows[0];
}

export async function updateEventAddress(
	id: string,
	addressData: EventAddressModel
) {
	const { street, city, state, country, postal_code } = addressData;
	const uuid = parseUUID(id);
	const query = `UPDATE event_addresses SET street = COALESCE($1, street), city = COALESCE($2, city), state = COALESCE($3, state), country = COALESCE($4, country), postal_code = COALESCE($5, postal_code), updated_at = NOW() WHERE id = $6 RETURNING *`;
	const result = await pool.query(query, [
		street,
		city,
		state,
		country,
		postal_code,
		uuid,
	]);

	return result.rows[0];
}

export async function deleteEventAddress(id: string) {
	const uuid = parseUUID(id);
	const query = `DELETE FROM event_addresses WHERE id = $1 RETURNING *`;
	const result = await pool.query(query, [uuid]);
	return result.rows[0];
}

export async function findEventAddressById(id: string) {
	const uuid = parseUUID(id);
	const query = `SELECT * FROM event_addresses WHERE id = $1`;
	const result = await pool.query(query, [uuid]);
	return result.rows[0];
}

export async function getEventsAddresses() {
	const query = `SELECT * FROM event_addresses`;
	const result = await pool.query(query);
	return result.rows;
}
