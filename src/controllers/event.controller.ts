import { FastifyRequest, FastifyReply } from 'fastify';

import {
	createEventService,
	findEventByIdService,
	getEventsService,
	updateEventService,
	deleteEventService,
} from '../services/event.service';
import { EventModel } from '../models/event-model';
import logger from '../utils/logger.utils';

export async function createEventController(
	request: FastifyRequest<{
		Body: EventModel;
	}>,
	reply: FastifyReply
) {
	try {
		const newEvent = await createEventService(request.body);
		reply.code(201).send(newEvent);
	} catch (error) {
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
		const event = await findEventByIdService(request.params.id);
		if (!event) {
			return reply.code(404).send({ message: 'Event not found' });
		}
		reply.send(event);
	} catch (error) {
		reply.code(500).send({ message: 'Error retrieving event' });
		logger.error(error, 'Error handling findEventByIdController');
	}
}

export async function getEventsController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	try {
		const events = await getEventsService();
		reply.send(events);
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
		const updatedEvent = await updateEventService(
			request.params.id,
			request.body
		);
		if (!updatedEvent) {
			return reply.code(404).send({ message: 'Event not found' });
		}
		reply.send(updatedEvent);
	} catch (error) {
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
		const deletedEvent = await deleteEventService(request.params.id);
		if (!deletedEvent) {
			return reply.code(404).send({ message: 'Event not found' });
		}

		// No Content
		reply.code(204).send();
	} catch (error) {
		reply.code(500).send({ message: 'Error deleting event' });
		logger.error(error, 'Error handling deleteEventController');
	}
}
