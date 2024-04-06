import { FastifyInstance } from 'fastify/types/instance';
import {
	createEventAddressController,
	deleteEventAddressController,
	findEventAddressByIdController,
	getEventsAddressesController,
	updateEventAddressController,
} from '../controllers/event-address.controller';

export default async function eventAddressRoutes(fastify: FastifyInstance) {
	fastify.post('/events-address', createEventAddressController);
	fastify.get('/events-address', getEventsAddressesController);
	fastify.get('/events-address/:id', findEventAddressByIdController);
	fastify.put('/events-address/:id', updateEventAddressController);
	fastify.delete('/events-address/:id', deleteEventAddressController);
}
