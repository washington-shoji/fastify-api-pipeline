import { FastifyReply, FastifyRequest } from 'fastify';
import { EventAttendeeModelRequest } from '../models/event-attendee.model';
import {
	createEventAttendeeService,
	deleteEventAttendeeService,
	findEventAttendeeByIdService,
	findEventAttendeesService,
	updateEventAttendeesService,
} from '../services/event-attendee.service';
import { getUserIdFromToken } from '../utils/get-api-user-id.utils';

export async function createEventAttendeeController(
	request: FastifyRequest<{
		Params: {
			eventId: string;
		};
		Body: EventAttendeeModelRequest;
	}>,
	reply: FastifyReply
) {
	try {
		const eventId = request.params.eventId;
		const userId = getUserIdFromToken(request);

		if (!userId) {
			return reply.code(401).send({ message: 'Unauthorized' });
		}

		const newEventAttendee = await createEventAttendeeService(
			eventId,
			userId,
			request.body
		);
		reply.code(201).send(newEventAttendee);
	} catch (error) {
		reply.code(500).send({ message: 'Error creating event attendee' });
		console.log(error, 'Error handling createEventAttendeeController');
	}
}

export async function findEventAttendeeByEventIdController(
	request: FastifyRequest<{
		Params: {
			eventId: string;
		};
	}>,
	reply: FastifyReply
) {
	try {
		const eventId = request.params.eventId;
		const userId = getUserIdFromToken(request);

		if (!userId) {
			return reply.code(401).send({ message: 'Unauthorized' });
		}

		const eventAttendee = await findEventAttendeeByIdService(eventId, userId);
		reply.code(200).send(eventAttendee);
	} catch (error) {
		reply.code(500).send({ message: 'Error creating event attendee' });
		console.log(error, 'Error handling createEventAttendeeController');
	}
}

export async function getEventAttendeesController(
	request: FastifyRequest<{
		Params: {
			eventId: string;
		};
	}>,
	reply: FastifyReply
) {
	try {
		const eventId = request.params.eventId;

		const eventAttendees = await findEventAttendeesService(eventId);
		reply.code(200).send(eventAttendees);
	} catch (error) {
		reply.code(500).send({ message: 'Error retrieving event attendee' });
		console.log(error, 'Error handling getEventAttendeesController');
	}
}

export async function updateEventAttendeeController(
	request: FastifyRequest<{
		Params: {
			eventId: string;
		};
		Body: EventAttendeeModelRequest;
	}>,
	reply: FastifyReply
) {
	try {
		const eventId = request.params.eventId;
		const userId = getUserIdFromToken(request);

		if (!userId) {
			return reply.code(401).send({ message: 'Unauthorized' });
		}

		const updatedEventAttendee = await updateEventAttendeesService(
			eventId,
			userId,
			request.body
		);
		reply.code(200).send(updatedEventAttendee);
	} catch (error) {
		reply.code(500).send({ message: 'Error creating event attendee' });
		console.log(error, 'Error handling updateEventAttendeeController');
	}
}

export async function deleteEventAttendeeController(
	request: FastifyRequest<{
		Params: {
			eventId: string;
		};
	}>,
	reply: FastifyReply
) {
	try {
		const eventId = request.params.eventId;
		const userId = getUserIdFromToken(request);

		if (!userId) {
			return reply.code(401).send({ message: 'Unauthorized' });
		}

		const eventAttendee = await deleteEventAttendeeService(eventId, userId);
		reply.code(200).send(eventAttendee);
	} catch (error) {
		reply.code(500).send({ message: 'Error deleting event attendee' });
		console.log(error, 'Error handling deleteEventAttendeeController');
	}
}
