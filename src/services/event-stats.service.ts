import { EventStats } from '../models/event-stats.model';
import {
	totalAttendingEvents,
	totalOthersAttendingMyEvents,
	totalPersonalClosedEvents,
	totalPersonalEvents,
} from '../repositories/event-stats.repository';

export async function getEventStats(userId: string): Promise<EventStats> {
	try {
		const personalEventsResult = await totalPersonalEvents(userId);
		const personalEventsClosed = await totalPersonalClosedEvents(userId);
		const attendingEvents = await totalAttendingEvents(userId);
		const othersAttendingEvents = await totalOthersAttendingMyEvents(userId);

		const eventsStats = <EventStats>{
			totalPersonalEvents: personalEventsResult,
			totalPersonalClosedEvents: personalEventsClosed,
			totalAttendingEvents: attendingEvents,
			totalOthersAttendingMyEvents: othersAttendingEvents,
		};

		return eventsStats;
	} catch (error) {
		throw error;
	}
}
