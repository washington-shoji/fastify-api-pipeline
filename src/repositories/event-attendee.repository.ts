import pool from '../database/db';
import { generateUUIDv7, parseUUID } from '../utils/uuidgenerator.utils';
import { EventAttendeeModel } from './../models/event-atendeed.model';

export async function createEventAttendee(
	attendeeData: EventAttendeeModel
): Promise<EventAttendeeModel> {
	const { eventId, userId, attendee_name, status } = attendeeData;
	const uuid = generateUUIDv7();
	const eventUuid = parseUUID(eventId);
	const userUuid = parseUUID(userId);

	const query = `INSERT INTO event_attendees (id, event_id, user_id, attendee_name, status)
    VALUES ($1, $2, $3, $4, $5) returning *
    `;
	const result = await pool.query(query, [
		uuid,
		eventUuid,
		userUuid,
		attendee_name,
		status,
	]);

	return result.rows[0];
}

export async function updateEventAttendee(
	attendeeData: EventAttendeeModel
): Promise<EventAttendeeModel> {
	const { id, eventId, userId, attendee_name, status } = attendeeData;
	const uuid = parseUUID(id as string);
	const eventUuid = parseUUID(eventId);
	const userUuid = parseUUID(userId);

	const query = `UPDATE event_attendees SET attendee_name = COALESCE($1, attendee_name), status = COALESCE($2, status), updated_at = NOW() WHERE id = $3 AND event_id = $4 AND user_id = $5 returning * `;
	const result = await pool.query(query, [
		attendee_name,
		status,
		uuid,
		eventUuid,
		userUuid,
	]);

	return result.rows[0];
}

export async function deleteEventAttendee(
	id: string,
	eventId: string,
	userId: string
): Promise<void> {
	const uuid = parseUUID(id as string);
	const eventUuid = parseUUID(eventId);
	const userUuid = parseUUID(userId);

	const query = `DELETE FROM event_attendees 
    WHERE id = $1 AND event_id = $2 AND user_id = $3 
    RETURNING *`;
	const result = await pool.query(query, [uuid, eventUuid, userUuid]);
	return result.rows[0];
}

export async function findEventAttendeeById(
	id: string,
	eventId: string,
	userId: string
): Promise<EventAttendeeModel> {
	const uuid = parseUUID(id as string);
	const eventUuid = parseUUID(eventId);
	const userUuid = parseUUID(userId);

	const query = `SELECT * FROM event_attendees 
    WHERE id = $1 AND event_id = $2 AND user_id = $3`;
	const result = await pool.query(query, [uuid, eventUuid, userUuid]);
	return result.rows[0];
}

export async function getEventAttendees(
	eventId: string
): Promise<EventAttendeeModel[]> {
	const eventUuid = parseUUID(eventId);

	const query = `SELECT * FROM event_attendees WHERE event_id = $1`;
	const result = await pool.query(query, [eventUuid]);
	return result.rows;
}
