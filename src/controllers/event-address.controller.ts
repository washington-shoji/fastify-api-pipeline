import { FastifyRequest, FastifyReply } from 'fastify';
import logger from '../utils/logger.utils';
import { EventAddressModelRequest } from '../models/event-address-model';
import {
	createEventAddressService,
	deleteEventAddressService,
	findEventAddressByIdService,
	findEventAddressesService,
	updateEventAddressService,
} from '../services/event-address.service';

export async function createEventAddressController(
	request: FastifyRequest<{
		Params: {
			eventId: string;
		};
		Body: EventAddressModelRequest;
	}>,
	reply: FastifyReply
) {
	try {
		const eventId = request.params.eventId;
		const newEventAddress = await createEventAddressService(
			eventId,
			request.body
		);
		reply.code(201).send(newEventAddress);
	} catch (error) {
		reply.code(500).send({ message: 'Error creating event address' });
		logger.error(error, 'Error handling createEventAddressController');
	}
}

export async function findEventAddressByIdController(
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
		const event = await findEventAddressByIdService(id, eventId);
		if (!event) {
			return reply.code(404).send({ message: 'Event address not found' });
		}
		reply.code(200).send(event);
	} catch (error) {
		reply.code(500).send({ message: 'Error retrieving event address' });
		logger.error(error, 'Error handling findEventAddressByIdController');
	}
}

export async function getEventsAddressesController(
	request: FastifyRequest<{
		Params: {
			id: string;
			eventId: string;
		};
	}>,
	reply: FastifyReply
) {
	try {
		const eventId = request.params.eventId;
		const events = await findEventAddressesService(eventId);
		reply.code(200).send(events);
	} catch (error) {
		reply.code(500).send({ message: 'Error retrieving events' });
		logger.error(error, 'Error handling getEventsAddressController');
	}
}

export async function updateEventAddressController(
	request: FastifyRequest<{
		Params: {
			id: string;
			eventId: string;
		};
		Body: EventAddressModelRequest;
	}>,
	reply: FastifyReply
) {
	try {
		const id = request.params.id;
		const eventId = request.params.eventId;
		const updatedEvent = await updateEventAddressService(
			id,
			eventId,
			request.body
		);
		if (!updatedEvent) {
			return reply.code(404).send({ message: 'Event address not found' });
		}
		reply.code(200).send(updatedEvent);
	} catch (error) {
		reply.code(500).send({ message: 'Error updating event address' });
		logger.error(error, 'Error handling updateEventAddressController');
	}
}

export async function deleteEventAddressController(
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
		const deletedEvent = await deleteEventAddressService(id, eventId);
		if (!deletedEvent) {
			return reply.code(404).send({ message: 'Event address not found' });
		}
		reply.code(200).send({ message: deletedEvent });
	} catch (error) {
		reply.code(500).send({ message: 'Error deleting event address' });
		logger.error(error, 'Error handling deleteEventAddressController');
	}
}
