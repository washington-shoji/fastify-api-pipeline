import {
	EventEntityModel,
	EventRegistrationEntityModel,
	EventRegistrationResponseModel,
	EventRequestModel,
	EventResponseModel,
} from '../models/event-model';
import {
	createEvent,
	deleteEvent,
	findEventById,
	getEvents,
	getOtherUsersEvents,
	getUserEvents,
	updateEvent,
} from '../repositories/event.repository';
import logger from '../utils/logger.utils';

export async function createEventService(
	userId: string,
	eventData: EventRequestModel
) {
	try {
		// Additional business logic can go here
		const eventEntityData = { ...eventData, user_id: userId };
		const result: EventEntityModel = await createEvent(eventEntityData);
		return responseDataTransformer(result);
	} catch (error) {
		// Log the error for debugging purposes
		logger.error(error, 'Error creating event');

		// Here, you can decide how to handle the error.
		// For example, you can throw a custom error with a more user-friendly message:
		throw new Error('Failed to create event. Please try again later.');
	}
}

export async function findEventByIdService(eventId: string, userId: string) {
	try {
		// Additional processing or business logic can go here
		const result: EventEntityModel = await findEventById(eventId, userId);
		return responseDataTransformer(result);
	} catch (error) {
		// Log the error for debugging purposes
		logger.error(error, 'Error could not find event');

		// Here, you can decide how to handle the error.
		// For example, you can throw a custom error with a more user-friendly message:
		throw new Error('Failed to find event. Please try again later.');
	}
}

export async function getUserEventsService(userId: string) {
	try {
		// Additional processing or business logic can go here
		const result: EventEntityModel[] = await getUserEvents(userId);
		return responseDataTransformerArray(result);
	} catch (error) {
		// Log the error for debugging purposes
		logger.error(error, 'Error could not find events');

		// Here, you can decide how to handle the error.
		// For example, you can throw a custom error with a more user-friendly message:
		throw new Error('Failed to find events. Please try again later.');
	}
}

export async function getOtherUsersEventsService(userId: string) {
	try {
		// Additional processing or business logic can go here
		const result: EventRegistrationEntityModel[] = await getOtherUsersEvents(
			userId
		);
		return responseRegistrationDataTransformerArray(result);
	} catch (error) {
		// Log the error for debugging purposes
		logger.error(error, 'Error could not find events');

		// Here, you can decide how to handle the error.
		// For example, you can throw a custom error with a more user-friendly message:
		throw new Error('Failed to find events. Please try again later.');
	}
}

export async function getEventsService() {
	try {
		// Additional processing or business logic can go here
		const result: EventEntityModel[] = await getEvents();
		return responseDataTransformerArray(result);
	} catch (error) {
		// Log the error for debugging purposes
		logger.error(error, 'Error could not find events');

		// Here, you can decide how to handle the error.
		// For example, you can throw a custom error with a more user-friendly message:
		throw new Error('Failed to find events. Please try again later.');
	}
}

export async function updateEventService(
	eventId: string,
	userId: string,
	eventData: EventRequestModel
) {
	try {
		// Additional processing or validations can go here
		const eventEntityData = {
			...eventData,
			event_id: eventId,
			user_id: userId,
		};
		const result: EventEntityModel = await updateEvent(eventEntityData);
		return responseDataTransformer(result);
	} catch (error) {
		// Log the error for debugging purposes
		logger.error(error, 'Error could not update event');

		// Here, you can decide how to handle the error.
		// For example, you can throw a custom error with a more user-friendly message:
		throw new Error('Failed to update event. Please try again later.');
	}
}

export async function deleteEventService(eventId: string, userId: string) {
	try {
		// Business logic before deleting an event can go here
		const result: EventEntityModel = await deleteEvent(eventId, userId);
		return responseDataTransformer(result);
	} catch (error) {
		// Log the error for debugging purposes
		logger.error(error, 'Error could not delete event');

		// Here, you can decide how to handle the error.
		// For example, you can throw a custom error with a more user-friendly message:
		throw new Error('Failed to delete event. Please try again later.');
	}
}

function responseDataTransformer(input: EventEntityModel): EventResponseModel {
	return <EventResponseModel>{
		event_id: input?.event_id ?? null,
		title: input?.title ?? null,
		description: input?.description ?? null,
		registration_open: input?.registration_open ?? null,
		registration_close: input?.registration_close ?? null,
		event_date: input?.event_date ?? null,
		location_type: input?.location_type ?? null,
	};
}

function responseDataTransformerArray(
	inputItems: EventEntityModel[]
): EventResponseModel[] {
	return inputItems.map(
		(input) =>
			<EventResponseModel>{
				event_id: input?.event_id ?? null,
				title: input?.title ?? null,
				description: input?.description ?? null,
				registration_open: input?.registration_open ?? null,
				registration_close: input?.registration_close ?? null,
				event_date: input?.event_date ?? null,
				location_type: input?.location_type ?? null,
			}
	);
}

function responseRegistrationDataTransformerArray(
	inputItems: EventRegistrationEntityModel[]
): EventRegistrationResponseModel[] {
	return inputItems.map(
		(input) =>
			<EventRegistrationResponseModel>{
				event_id: input?.event_id ?? null,
				title: input?.title ?? null,
				description: input?.description ?? null,
				registration_open: input?.registration_open ?? null,
				registration_close: input?.registration_close ?? null,
				event_date: input?.event_date ?? null,
				location_type: input?.location_type ?? null,
				attendee_status: input?.attendee_status ?? null,
			}
	);
}
