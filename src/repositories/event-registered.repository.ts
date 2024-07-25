import pool from '../database/db';
import { RegisteredEventModel } from '../models/event-registered.model';
import { parseUUID } from '../utils/uuidgenerator.utils';

export async function findAllRegisteredEventsByUser(
	userId: string
): Promise<RegisteredEventModel[]> {
	const userUuid = parseUUID(userId);
	const query = `
    SELECT
        at.attendee_name,
        at.status,
        e.id,
        e.title,
        e.description,
        e.start_time,
        e.end_time,
        e.location,
        a.street,
        a.city_suburb,
        a.state,
        a.country,
        a.postal_code
    FROM 
        event_attendees at
        LEFT JOIN events e ON e.id = at.event_id
        LEFT JOIN event_addresses a ON a.event_id = at.event_id
    WHERE
        at.user_id = $1     
`;

	const result = await pool.query(query, [userUuid]);
	return result.rows;
}
