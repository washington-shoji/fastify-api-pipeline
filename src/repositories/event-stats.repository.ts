import pool from '../database/db';
import { parseUUID } from '../utils/uuidgenerator.utils';

export async function totalPersonalEvents(userId: string) {
	const userUuid = parseUUID(userId);
	const query = `
    SELECT COUNT(event_id) 
    FROM events 
    WHERE user_id = $1;
    `;

	const client = await pool.connect();

	try {
		const result = await client.query(query, [userUuid]);
		return result.rows[0].count;
	} catch (error) {
		throw error;
	} finally {
		client.release();
	}
}

export async function totalPersonalClosedEvents(userId: string) {
	const userUuid = parseUUID(userId);
	const query = `
    SELECT COUNT(event_id) 
    FROM events 
    WHERE user_id = $1 AND event_date < NOW();
    `;

	const client = await pool.connect();

	try {
		const result = await client.query(query, [userUuid]);
		return result.rows[0].count;
	} catch (error) {
		throw error;
	} finally {
		client.release();
	}
}

export async function totalAttendingEvents(userId: string) {
	const userUuid = parseUUID(userId);
	const query = `
    SELECT COUNT(event_id) 
    FROM event_attendees 
    WHERE user_id = $1 AND attendee_status = 'ATTENDING';
    `;

	const client = await pool.connect();

	try {
		const result = await client.query(query, [userUuid]);
		return result.rows[0].count;
	} catch (error) {
		throw error;
	} finally {
		client.release();
	}
}

export async function totalOthersAttendingMyEvents(userId: string) {
	const userUuid = parseUUID(userId);
	const query = `
    SELECT COUNT(e.event_id) 
    FROM events AS e
    LEFT JOIN event_attendees AS et
        ON e.user_id = et.user_id
    WHERE e.user_id = $1 AND et.user_id != $1 AND et.attendee_status = 'ATTENDING';`;

	const client = await pool.connect();

	try {
		const result = await client.query(query, [userUuid]);
		return result.rows[0].count;
	} catch (error) {
		throw error;
	} finally {
		client.release();
	}
}
