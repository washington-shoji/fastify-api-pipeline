import {
	EventAttendeeModel,
	EventAttendeeModelRequest,
	EventAttendeeModelResponse,
} from '../models/event-attendee.model';
import {
	createEventAttendee,
	deleteEventAttendee,
	findEventAttendeeByUserIdAndEventId,
	getEventAttendees,
	updateEventAttendee,
} from '../repositories/event-attendee.repository';
import logger from '../utils/logger.utils';

export async function createEventAttendeeService(
	eventId: string,
	userId: string,
	attendeeData: EventAttendeeModelRequest
): Promise<EventAttendeeModelResponse> {
	try {
		const eventAttendeeEntity: EventAttendeeModel = {
			...attendeeData,
			eventId: eventId,
			userId: userId,
			attendee_name: attendeeData.attendeeName,
		};

		const result: EventAttendeeModel = await createEventAttendee(
			eventAttendeeEntity
		);

		return responseDataTransformer(result);
	} catch (error) {
		logger.error(error, 'Error creating event attendee');
		throw new Error('Failed to create event attendee. Please try again later.');
	}
}

export async function findEventAttendeeByIdService(
	eventId: string,
	userId: string
): Promise<EventAttendeeModelResponse> {
	try {
		const result: EventAttendeeModel =
			await findEventAttendeeByUserIdAndEventId(eventId, userId);
		return responseDataTransformer(result);
	} catch (error) {
		logger.error(error, 'Error finding event attendee');
		throw new Error('Failed to find event attendee. Please try again later.');
	}
}

export async function findEventAttendeesService(
	eventId: string
): Promise<EventAttendeeModelResponse[]> {
	try {
		const result: EventAttendeeModel[] = await getEventAttendees(eventId);
		return responseDataTransformerArray(result);
	} catch (error) {
		logger.error(error, 'Error finding event attendees');
		throw new Error('Failed to find event attendees. Please try again later.');
	}
}

export async function updateEventAttendeesService(
	eventId: string,
	userId: string,
	attendeeData: EventAttendeeModelRequest
): Promise<EventAttendeeModelResponse> {
	try {
		const eventAttendee = await findEventAttendeeByUserIdAndEventId(
			eventId,
			userId
		);

		const eventAttendeeEntity: EventAttendeeModel = {
			...attendeeData,
			id: eventAttendee.id,
			eventId: eventId,
			userId: userId,
			attendee_name: attendeeData.attendeeName,
		};

		const result: EventAttendeeModel = await updateEventAttendee(
			eventAttendeeEntity
		);

		return responseDataTransformer(result);
	} catch (error) {
		logger.error(error, 'Error updating event attendee');
		throw new Error('Failed to update event attendee. Please try again later.');
	}
}

export async function deleteEventAttendeeService(
	eventId: string,
	userId: string
): Promise<string> {
	try {
		await deleteEventAttendee(eventId, userId);
		return 'Deleted successfully';
	} catch (error) {
		logger.error(error, 'Error deleting event attendees');
		throw new Error(
			'Failed to delete event attendees. Please try again later.'
		);
	}
}

function responseDataTransformer(
	input: EventAttendeeModel
): EventAttendeeModelResponse {
	return <EventAttendeeModelResponse>{
		id: input.id,
		attendeeName: input.attendee_name,
		status: input.status,
	};
}

function responseDataTransformerArray(
	inputItems: EventAttendeeModel[]
): EventAttendeeModelResponse[] {
	return inputItems.map(
		(input) =>
			<EventAttendeeModelResponse>{
				id: input.id,
				attendeeName: input.attendee_name,
				status: input.status,
			}
	);
}
