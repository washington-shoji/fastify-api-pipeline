import { FastifyRequest, FastifyReply } from 'fastify';
import {
	createEventService,
	findEventByIdService,
	getEventsService,
	updateEventService,
	deleteEventService,
	getUserEventsService,
	getOtherUsersEventsService,
} from '../services/event.service';
import { EventRequestModel } from '../models/event-model';
import { decodeToken } from '../tests/unit-tests/utils/decode-token';
import { TokenExpiredError } from 'jsonwebtoken';

export async function createEventController(
	request: FastifyRequest<{
		Body: EventRequestModel;
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
		console.log(error, 'Error handling createEventController');
	}
}

export async function findEventByIdController(
	request: FastifyRequest<{
		Params: {
			eventId: string;
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
		const event = await findEventByIdService(request.params.eventId, userId);
		if (!event) {
			return reply.code(404).send({ message: 'Event not found' });
		}
		reply.code(200).send(event);
	} catch (error) {
		if (error instanceof TokenExpiredError) {
			return reply.code(401).send({ message: 'Unauthorized' });
		}

		reply.code(500).send({ message: 'Error retrieving event' });
		console.log(error, 'Error handling findEventByIdController');
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
		console.log(error, 'Error handling getEventsController');
	}
}

export async function getOtherUsersEventsController(
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

		const events = await getOtherUsersEventsService(userId);
		reply.code(200).send(events);
	} catch (error) {
		if (error instanceof TokenExpiredError) {
			return reply.code(401).send({ message: 'Unauthorized' });
		}

		reply.code(500).send({ message: 'Error retrieving events' });
		console.log(error, 'Error handling getEventsController');
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
		console.log(error, 'Error handling getEventsController');
	}
}

export async function updateEventController(
	request: FastifyRequest<{
		Params: {
			eventId: string;
		};
		Body: EventRequestModel;
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
		const event = await findEventByIdService(request.params.eventId, userId);
		if (!event) {
			return reply.code(404).send({ message: 'Event not found' });
		}
		const updatedEvent = await updateEventService(
			request.params.eventId,
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
		console.log(error, 'Error handling updateEventController');
	}
}

export async function deleteEventController(
	request: FastifyRequest<{
		Params: {
			eventId: string;
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
		const event = await findEventByIdService(request.params.eventId, userId);
		if (!event) {
			return reply.code(404).send({ message: 'Event not found' });
		}
		const deletedEvent = await deleteEventService(
			request.params.eventId,
			userId
		);
		if (!deletedEvent) {
			return reply.code(404).send({ message: 'Event not found' });
		}

		reply.code(200).send({ message: 'Deleted successfully' });
	} catch (error) {
		if (error instanceof TokenExpiredError) {
			return reply.code(401).send({ message: 'Unauthorized' });
		}

		reply.code(500).send({ message: 'Error deleting event' });
		console.log(error, 'Error handling deleteEventController');
	}
}
