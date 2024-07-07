import { FastifyRequest, FastifyReply } from 'fastify';
import {
	createEventService,
	findEventByIdService,
	getEventsService,
	updateEventService,
	deleteEventService,
	getUserEventsService,
} from '../services/event.service';
import { EventModel } from '../models/event-model';
import logger from '../utils/logger.utils';
import { decodeToken } from '../tests/unit-tests/utils/decode-token';
import { TokenExpiredError } from 'jsonwebtoken';

export async function createEventController(
	request: FastifyRequest<{
		Body: EventModel;
	}>,
	reply: FastifyReply
) {
	try {
		const token = request.headers.authorization?.split(' ')[1]; // Bearer TOKEN
		const decoded = decodeToken(token);
		const userId = decoded?.userId;
		if (!userId) {
			return reply.code(401).send({ message: 'Unauthorized' });
		}

		const newEvent = await createEventService(userId, request.body);
		reply.code(201).send(newEvent);
	} catch (error) {
		if (error instanceof TokenExpiredError) {
			return reply.code(401).send({ message: 'Unauthorized' });
		}

		reply.code(500).send({ message: 'Error creating event' });
		logger.error(error, 'Error handling createEventController');
	}
}

export async function findEventByIdController(
	request: FastifyRequest<{
		Params: {
			id: string;
		};
	}>,
	reply: FastifyReply
) {
	try {
		const token = request.headers.authorization?.split(' ')[1]; // Bearer TOKEN
		const decoded = decodeToken(token);
		const userId = decoded?.userId;
		if (!userId) {
			return reply.code(401).send({ message: 'Unauthorized' });
		}
		const event = await findEventByIdService(request.params.id, userId);
		if (!event) {
			return reply.code(404).send({ message: 'Event not found' });
		}
		reply.code(200).send(event);
	} catch (error) {
		if (error instanceof TokenExpiredError) {
			return reply.code(401).send({ message: 'Unauthorized' });
		}

		reply.code(500).send({ message: 'Error retrieving event' });
		logger.error(error, 'Error handling findEventByIdController');
	}
}

export async function getUserEventsController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	try {
		const token = request.headers.authorization?.split(' ')[1]; // Bearer TOKEN
		const decoded = decodeToken(token);
		const userId = decoded?.userId;
		if (!userId) {
			return reply.code(401).send({ message: 'Unauthorized' });
		}

		const events = await getUserEventsService(userId);
		reply.code(200).send(events);
	} catch (error) {
		if (error instanceof TokenExpiredError) {
			return reply.code(401).send({ message: 'Unauthorized' });
		}

		reply.code(500).send({ message: 'Error retrieving events' });
		logger.error(error, 'Error handling getEventsController');
	}
}

export async function getEventsController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	try {
		const events = await getEventsService();
		reply.code(200).send(events);
	} catch (error) {
		reply.code(500).send({ message: 'Error retrieving events' });
		logger.error(error, 'Error handling getEventsController');
	}
}

export async function updateEventController(
	request: FastifyRequest<{
		Params: {
			id: string;
		};
		Body: EventModel;
	}>,
	reply: FastifyReply
) {
	try {
		const token = request.headers.authorization?.split(' ')[1]; // Bearer TOKEN
		const decoded = decodeToken(token);
		const userId = decoded?.userId;
		if (!userId) {
			return reply.code(401).send({ message: 'Unauthorized' });
		}
		const event = await findEventByIdService(request.params.id, userId);
		if (!event) {
			return reply.code(404).send({ message: 'Event not found' });
		}
		const updatedEvent = await updateEventService(
			request.params.id,
			userId,
			request.body
		);
		if (!updatedEvent) {
			return reply.code(404).send({ message: 'Event not found' });
		}
		reply.code(200).send(updatedEvent);
	} catch (error) {
		if (error instanceof TokenExpiredError) {
			return reply.code(401).send({ message: 'Unauthorized' });
		}

		reply.code(500).send({ message: 'Error updating event' });
		logger.error(error, 'Error handling updateEventController');
	}
}

export async function deleteEventController(
	request: FastifyRequest<{
		Params: {
			id: string;
		};
	}>,
	reply: FastifyReply
) {
	try {
		const token = request.headers.authorization?.split(' ')[1]; // Bearer TOKEN
		const decoded = decodeToken(token);
		const userId = decoded?.userId;
		if (!userId) {
			return reply.code(401).send({ message: 'Unauthorized' });
		}
		const event = await findEventByIdService(request.params.id, userId);
		if (!event) {
			return reply.code(404).send({ message: 'Event not found' });
		}
		const deletedEvent = await deleteEventService(request.params.id, userId);
		if (!deletedEvent) {
			return reply.code(404).send({ message: 'Event not found' });
		}

		reply.code(200).send({ message: 'Deleted successfully' });
	} catch (error) {
		if (error instanceof TokenExpiredError) {
			return reply.code(401).send({ message: 'Unauthorized' });
		}

		reply.code(500).send({ message: 'Error deleting event' });
		logger.error(error, 'Error handling deleteEventController');
	}
}
