import pool from '../database/db';
import { EventAddressModel } from '../models/event-address-model';
import { generateUUIDv7, parseUUID } from '../utils/uuidgenerator.utils';

export async function createEventAddress(
	addressData: EventAddressModel
): Promise<EventAddressModel> {
	const { eventId, street, city_suburb, state, country, postal_code } =
		addressData;
	const uuid = generateUUIDv7();
	const eventUuid = parseUUID(eventId);
	const query = `INSERT INTO event_addresses (id, event_id, street, city_suburb, state, country, postal_code)
    VALUES ($1, $2, $3, $4, $5, $6, $7) Returning *`;
	const result = await pool.query(query, [
		uuid,
		eventUuid,
		street,
		city_suburb,
		state,
		country,
		postal_code,
	]);

	return result.rows[0];
}

export async function updateEventAddress(
	id: string,
	eventId: string,
	addressData: EventAddressModel
): Promise<EventAddressModel> {
	const { street, city_suburb, state, country, postal_code } = addressData;
	const uuid = parseUUID(id);
	const eventUuid = parseUUID(eventId);
	const query = `UPDATE event_addresses SET street = COALESCE($1, street), city_suburb = COALESCE($2, city_suburb), state = COALESCE($3, state), country = COALESCE($4, country), postal_code = COALESCE($5, postal_code), updated_at = NOW() WHERE id = $6 AND event_id = $7 RETURNING *`;
	const result = await pool.query(query, [
		street,
		city_suburb,
		state,
		country,
		postal_code,
		uuid,
		eventUuid,
	]);

	return result.rows[0];
}

export async function deleteEventAddress(
	id: string,
	eventId: string
): Promise<void> {
	const uuid = parseUUID(id);
	const eventUuid = parseUUID(eventId);
	const query = `DELETE FROM event_addresses WHERE id = $1 AND event_id = $2 RETURNING *`;
	const result = await pool.query(query, [uuid, eventUuid]);
	return result.rows[0];
}

export async function findEventAddressById(
	id: string,
	eventId: string
): Promise<EventAddressModel> {
	const uuid = parseUUID(id);
	const eventUuid = parseUUID(eventId);
	const query = `SELECT * FROM event_addresses WHERE id = $1 AND event_id = $2`;
	const result = await pool.query(query, [uuid, eventUuid]);
	return result.rows[0];
}

export async function findEventAddressByEventId(
	eventId: string
): Promise<EventAddressModel> {
	const eventUuid = parseUUID(eventId);
	const query = `SELECT * FROM event_addresses WHERE event_id = $1`;
	const result = await pool.query(query, [eventUuid]);
	return result.rows[0];
}

export async function getEventsAddresses(
	eventId: string
): Promise<EventAddressModel[]> {
	const eventUuid = parseUUID(eventId);
	const query = `SELECT * FROM event_addresses WHERE event_id = $1`;
	const result = await pool.query(query, [eventUuid]);
	return result.rows;
}
