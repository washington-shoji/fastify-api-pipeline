import pool from '../database/db';
import { EventAddressEntityModel } from '../models/event-address-model';
import { generateUUIDv7, parseUUID } from '../utils/uuidgenerator.utils';

export async function createEventAddress(
	addressData: EventAddressEntityModel
): Promise<EventAddressEntityModel> {
	const { event_id, street, city_suburb, state, country, postal_code } =
		addressData;
	const uuid = generateUUIDv7();
	const eventUuid = parseUUID(event_id);
	const query = `
	INSERT INTO event_addresses (
		address_id, 
		event_id, 
		street, 
		city_suburb, 
		state, 
		country, 
		postal_code
	)
    VALUES (
		$1, 
		$2, 
		$3, 
		$4, 
		$5, 
		$6, 
		$7
	) 
	RETURNING *
	`;
	const client = await pool.connect();

	try {
		await client.query('BEGIN');
		const result = await client.query(query, [
			uuid,
			eventUuid,
			street,
			city_suburb,
			state,
			country,
			postal_code,
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

export async function updateEventAddress(
	addressId: string,
	eventId: string,
	addressData: EventAddressEntityModel
): Promise<EventAddressEntityModel> {
	const { street, city_suburb, state, country, postal_code } = addressData;
	const uuid = parseUUID(addressId);
	const eventUuid = parseUUID(eventId);
	const query = `
	UPDATE event_addresses 
	SET 
		street = COALESCE($1, street), 
		city_suburb = COALESCE($2, city_suburb), 
		state = COALESCE($3, state), 
		country = COALESCE($4, country), 
		postal_code = COALESCE($5, postal_code), 
		updated_at = NOW() 
	WHERE address_id = $6 AND event_id = $7 
	RETURNING *
	`;
	const client = await pool.connect();

	try {
		await client.query('BEGIN');
		const result = await client.query(query, [
			street,
			city_suburb,
			state,
			country,
			postal_code,
			uuid,
			eventUuid,
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

export async function deleteEventAddress(
	addressId: string,
	eventId: string
): Promise<void> {
	const uuid = parseUUID(addressId);
	const eventUuid = parseUUID(eventId);
	const query = `
	DELETE FROM event_addresses 
	WHERE address_id = $1 AND event_id = $2 
	RETURNING *
	`;

	const client = await pool.connect();

	try {
		await client.query('BEGIN');
		const result = await client.query(query, [uuid, eventUuid]);
		await client.query('COMMIT');
		return result.rows[0];
	} catch (error) {
		await client.query('ROLLBACK');
		throw error;
	} finally {
		client.release();
	}
}

export async function findEventAddressById(
	addressId: string,
	eventId: string
): Promise<EventAddressEntityModel> {
	const uuid = parseUUID(addressId);
	const eventUuid = parseUUID(eventId);
	const query = `
	SELECT * FROM event_addresses 
	WHERE address_id = $1 AND event_id = $2
	`;
	const client = await pool.connect();

	try {
		const result = await client.query(query, [uuid, eventUuid]);
		return result.rows[0];
	} catch (error) {
		throw error;
	} finally {
		client.release();
	}
}

export async function findEventAddressByEventId(
	eventId: string
): Promise<EventAddressEntityModel> {
	const eventUuid = parseUUID(eventId);
	const query = `
	SELECT * FROM event_addresses 
	WHERE event_id = $1
	`;
	const client = await pool.connect();

	try {
		const result = await client.query(query, [eventUuid]);
		return result.rows[0];
	} catch (error) {
		throw error;
	} finally {
		client.release();
	}
}

export async function getEventsAddresses(
	eventId: string
): Promise<EventAddressEntityModel[]> {
	const eventUuid = parseUUID(eventId);
	const query = `
	SELECT * FROM event_addresses 
	WHERE event_id = $1
	`;
	const client = await pool.connect();

	try {
		const result = await client.query(query, [eventUuid]);
		return result.rows;
	} catch (error) {
		throw error;
	} finally {
		client.release();
	}
}
