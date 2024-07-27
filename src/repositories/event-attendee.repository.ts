import pool from '../database/db';
import { generateUUIDv7, parseUUID } from '../utils/uuidgenerator.utils';
import { EventAttendeeEntityModel } from '../models/event-attendee.model';

export async function createEventAttendee(
	attendeeData: EventAttendeeEntityModel
): Promise<EventAttendeeEntityModel> {
	const { event_id, user_id, registration_name, attendee_status } =
		attendeeData;
	const uuid = generateUUIDv7();
	const eventUuid = parseUUID(event_id);
	const userUuid = parseUUID(user_id);

	const query = `
	INSERT INTO 
	event_attendees (
		attendee_id, 
		event_id, 
		user_id, 
		registration_name, 
		attendee_status
	)
    VALUES (
		$1, $2, $3, $4, $5) 
	RETURNING *
    `;
	const result = await pool.query(query, [
		uuid,
		eventUuid,
		userUuid,
		registration_name,
		attendee_status,
	]);

	return result.rows[0];
}

export async function updateEventAttendee(
	attendeeData: EventAttendeeEntityModel
): Promise<EventAttendeeEntityModel> {
	const { attendee_id, event_id, user_id, registration_name, attendee_status } =
		attendeeData;
	const uuid = parseUUID(attendee_id as string);
	const eventUuid = parseUUID(event_id);
	const userUuid = parseUUID(user_id);

	const query = `
	UPDATE event_attendees 
	SET 
		attendee_name = COALESCE($1, attendee_name), 
		status = COALESCE($2, status), 
		updated_at = NOW() 
	WHERE 
		attendee_id = $3 AND event_id = $4 AND user_id = $5 
	RETURNING * `;
	const result = await pool.query(query, [
		registration_name,
		attendee_status,
		uuid,
		eventUuid,
		userUuid,
	]);

	return result.rows[0];
}

export async function deleteEventAttendee(
	eventId: string,
	userId: string
): Promise<void> {
	const eventUuid = parseUUID(eventId);
	const userUuid = parseUUID(userId);

	const query = `
	DELETE FROM event_attendees 
    WHERE event_id = $1 AND user_id = $2 
    RETURNING *`;
	const result = await pool.query(query, [eventUuid, userUuid]);
	return result.rows[0];
}

export async function findEventAttendeeByUserIdAndEventId(
	eventId: string,
	userId: string
): Promise<EventAttendeeEntityModel> {
	const eventUuid = parseUUID(eventId);
	const userUuid = parseUUID(userId);

	const query = `
	SELECT * FROM event_attendees 
    WHERE event_id = $1 AND user_id = $2`;
	const result = await pool.query(query, [eventUuid, userUuid]);
	return result.rows[0];
}

export async function getEventAttendees(
	eventId: string
): Promise<EventAttendeeEntityModel[]> {
	const eventUuid = parseUUID(eventId);

	const query = `
	SELECT * FROM event_attendees WHERE event_id = $1`;
	const result = await pool.query(query, [eventUuid]);
	return result.rows;
}
