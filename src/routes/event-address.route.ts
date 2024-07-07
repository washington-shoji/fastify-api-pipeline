import { FastifyInstance } from 'fastify/types/instance';
import {
	createEventAddressController,
	deleteEventAddressController,
	findEventAddressByIdController,
	getEventsAddressesController,
	updateEventAddressController,
} from '../controllers/event-address.controller';

export default async function eventAddressRoutes(
	fastify: FastifyInstance
): Promise<void> {
	fastify.post('/events-address/event/:eventId', createEventAddressController);
	fastify.get('/events-address/event/:eventId', getEventsAddressesController);
	fastify.get(
		'/events-address/:id/event/:eventId',
		findEventAddressByIdController
	);
	fastify.put(
		'/events-address/:id/event/:eventId',
		updateEventAddressController
	);
	fastify.delete(
		'/events-address/:id/event/:eventId',
		deleteEventAddressController
	);
}
