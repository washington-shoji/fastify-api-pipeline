import { FastifyReply, FastifyRequest } from 'fastify';
import { EventAttendeeModelRequest } from '../models/event-atendeed.model';
import logger from '../utils/logger.utils';
import {
	createEventAttendeeService,
	deleteEventAttendeeService,
	findEventAttendeeByIdService,
	findEventAttendeesService,
	updateEventAttendeesService,
} from '../services/event-attendees.service';
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
		logger.error(error, 'Error handling createEventAttendeeController');
	}
}

export async function findEventAttendeeByIdController(
	request: FastifyRequest<{
		Params: {
			id: string;
			eventId: string;
		};
	}>,
	reply: FastifyReply
) {
	try {
		const id = request.params.id;
		const eventId = request.params.eventId;
		const userId = getUserIdFromToken(request);

		if (!userId) {
			return reply.code(401).send({ message: 'Unauthorized' });
		}

		const eventAttendee = await findEventAttendeeByIdService(
			id,
			eventId,
			userId
		);
		reply.code(200).send(eventAttendee);
	} catch (error) {
		reply.code(500).send({ message: 'Error creating event attendee' });
		logger.error(error, 'Error handling createEventAttendeeController');
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
		logger.error(error, 'Error handling getEventAttendeesController');
	}
}

export async function updateEventAttendeeController(
	request: FastifyRequest<{
		Params: {
			id: string;
			eventId: string;
		};
		Body: EventAttendeeModelRequest;
	}>,
	reply: FastifyReply
) {
	try {
		const id = request.params.id;
		const eventId = request.params.eventId;
		const userId = getUserIdFromToken(request);

		if (!userId) {
			return reply.code(401).send({ message: 'Unauthorized' });
		}

		const updatedEventAttendee = await updateEventAttendeesService(
			id,
			eventId,
			userId,
			request.body
		);
		reply.code(200).send(updatedEventAttendee);
	} catch (error) {
		reply.code(500).send({ message: 'Error creating event attendee' });
		logger.error(error, 'Error handling updateEventAttendeeController');
	}
}

export async function deleteEventAttendeeController(
	request: FastifyRequest<{
		Params: {
			id: string;
			eventId: string;
		};
	}>,
	reply: FastifyReply
) {
	try {
		const id = request.params.id;
		const eventId = request.params.eventId;
		const userId = getUserIdFromToken(request);

		if (!userId) {
			return reply.code(401).send({ message: 'Unauthorized' });
		}

		const eventAttendee = await deleteEventAttendeeService(id, eventId, userId);
		reply.code(200).send(eventAttendee);
	} catch (error) {
		reply.code(500).send({ message: 'Error deleting event attendee' });
		logger.error(error, 'Error handling deleteEventAttendeeController');
	}
}
