import { FastifyInstance } from 'fastify/types/instance';
import {
	createEventAddressController,
	deleteEventAddressController,
	findEventAddressByEventIdController,
	findEventAddressByIdController,
	getEventsAddressesController,
	updateEventAddressController,
} from '../controllers/event-address.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

export default async function eventAddressRoutes(
	fastify: FastifyInstance
): Promise<void> {
	fastify.addHook('preHandler', authMiddleware);
	fastify.post('/events-address/event/:eventId', createEventAddressController);
	fastify.get('/events-address/events/:eventId', getEventsAddressesController);
	fastify.get(
		'/events-address/:id/event/:eventId',
		findEventAddressByIdController
	);
	fastify.get(
		'/events-address/event/:eventId',
		findEventAddressByEventIdController
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
