import { FastifyRequest, FastifyReply } from 'fastify';
import logger from '../utils/logger.utils';
import { EventAddressModel } from '../models/event-address-model';
import {
	createEventAddressService,
	deleteEventAddressService,
	findEventAddressByIdService,
	findEventAddressesService,
	updateEventAddressService,
} from '../services/event-address.service';

export async function createEventAddressController(
	request: FastifyRequest<{
		Body: EventAddressModel;
	}>,
	reply: FastifyReply
) {
	try {
		const newEventAddress = await createEventAddressService(request.body);
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
		};
	}>,
	reply: FastifyReply
) {
	try {
		const event = await findEventAddressByIdService(request.params.id);
		if (!event) {
			return reply.code(404).send({ message: 'Event address not found' });
		}
		reply.send(event);
	} catch (error) {
		reply.code(500).send({ message: 'Error retrieving event address' });
		logger.error(error, 'Error handling findEventAddressByIdController');
	}
}

export async function getEventsAddressesController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	try {
		const events = await findEventAddressesService();
		reply.send(events);
	} catch (error) {
		reply.code(500).send({ message: 'Error retrieving events' });
		logger.error(error, 'Error handling getEventsAddressController');
	}
}

export async function updateEventAddressController(
	request: FastifyRequest<{
		Params: {
			id: string;
		};
		Body: EventAddressModel;
	}>,
	reply: FastifyReply
) {
	try {
		const updatedEvent = await updateEventAddressService(
			request.params.id,
			request.body
		);
		if (!updatedEvent) {
			return reply.code(404).send({ message: 'Event address not found' });
		}
		reply.send(updatedEvent);
	} catch (error) {
		reply.code(500).send({ message: 'Error updating event address' });
		logger.error(error, 'Error handling updateEventAddressController');
	}
}

export async function deleteEventAddressController(
	request: FastifyRequest<{
		Params: {
			id: string;
		};
	}>,
	reply: FastifyReply
) {
	try {
		const deletedEvent = await deleteEventAddressService(request.params.id);
		if (!deletedEvent) {
			return reply.code(404).send({ message: 'Event address not found' });
		}
		reply.code(204).send();
	} catch (error) {
		reply.code(500).send({ message: 'Error deleting event address' });
		logger.error(error, 'Error handling deleteEventAddressService');
	}
}
