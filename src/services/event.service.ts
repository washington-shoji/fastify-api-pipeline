import { EventModel } from '../models/event-model';
import {
	createEvent,
	deleteEvent,
	findEventById,
	getEvents,
	updateEvent,
} from '../repositories/event.repository';
import logger from '../utils/logger.utils';

export async function createEventService(eventData: EventModel) {
	try {
		// Additional business logic can go here
		return await createEvent(eventData);
	} catch (error) {
		// Log the error for debugging purposes
		logger.error(error, 'Error creating event');

		// Here, you can decide how to handle the error.
		// For example, you can throw a custom error with a more user-friendly message:
		throw new Error('Failed to create event. Please try again later.');
	}
}

export async function findEventByIdService(id: string) {
	try {
		// Additional processing or business logic can go here
		return await findEventById(id);
	} catch (error) {
		// Log the error for debugging purposes
		logger.error(error, 'Error could not find event');

		// Here, you can decide how to handle the error.
		// For example, you can throw a custom error with a more user-friendly message:
		throw new Error('Failed to find event. Please try again later.');
	}
}

export async function getEventsService() {
	try {
		// Additional processing or business logic can go here
		return await getEvents();
	} catch (error) {
		// Log the error for debugging purposes
		logger.error(error, 'Error could not find events');

		// Here, you can decide how to handle the error.
		// For example, you can throw a custom error with a more user-friendly message:
		throw new Error('Failed to find events. Please try again later.');
	}
}

export async function updateEventService(id: string, eventData: EventModel) {
	try {
		// Additional processing or validations can go here
		return await updateEvent(id, eventData);
	} catch (error) {
		// Log the error for debugging purposes
		logger.error(error, 'Error could not update event');

		// Here, you can decide how to handle the error.
		// For example, you can throw a custom error with a more user-friendly message:
		throw new Error('Failed to update event. Please try again later.');
	}
}

export async function deleteEventService(id: string) {
	try {
		// Business logic before deleting an event can go here
		return await deleteEvent(id);
	} catch (error) {
		// Log the error for debugging purposes
		logger.error(error, 'Error could not delete event');

		// Here, you can decide how to handle the error.
		// For example, you can throw a custom error with a more user-friendly message:
		throw new Error('Failed to delete event. Please try again later.');
	}
}
