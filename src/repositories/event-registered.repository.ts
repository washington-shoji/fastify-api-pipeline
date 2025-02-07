import pool from '../database/db';
import { RegisteredEventModel } from '../models/event-registered.model';
import { parseUUID } from '../utils/uuidgenerator.utils';

export async function findAllRegisteredEventsByUser(
	userId: string
): Promise<RegisteredEventModel[]> {
	const userUuid = parseUUID(userId);
	const query = `
    SELECT
        at.registration_name,
        at.attendee_status,
        e.event_id,
        e.title,
        e.description,
        e.registration_open,
        e.registration_close,
        e.event_date,
        e.location_type,
        a.street,
        a.city_suburb,
        a.state,
        a.country,
        a.postal_code,
        i.file_url
    FROM 
        event_attendees at
        LEFT JOIN events e ON e.event_id = at.event_id
        LEFT JOIN event_addresses a ON a.event_id = at.event_id
        LEFT JOIN event_images i ON i.event_id = at.event_id
    WHERE
        at.user_id = $1     
`;

	const result = await pool.query(query, [userUuid]);
	return result.rows;
}
