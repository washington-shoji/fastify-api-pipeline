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


const bodyJsonSchema = {
	type: 'object',
	required: ['street', 'city_suburb', 'state', 'country', 'postal_code'],
	properties: {
		address_id: { type: 'string' },
		street: { type: 'string' },
		city_suburb: { type: 'string' },
		state: { type: 'string' },
		country: { type: 'string' },
		postal_code: { type: 'string' },
	}
  }

  const paramsJsonSchema = {
	type: 'object',
	properties: {
		id: { type: 'string' },
		eventId: { type: 'string' },
	}
  }

  const schema = {
	body: bodyJsonSchema,
	params: paramsJsonSchema,
  }


export default async function eventAddressRoutes(
	fastify: FastifyInstance
): Promise<void> {
	fastify.addHook('preHandler', authMiddleware);
	fastify.post('/events-address/event/:eventId', {schema}, createEventAddressController);
	fastify.get('/events-address/events/:eventId', {schema}, getEventsAddressesController);
	fastify.get(
		'/events-address/:id/event/:eventId',
		{schema},
		findEventAddressByIdController
	);
	fastify.get(
		'/events-address/event/:eventId',
		{schema}, 
		findEventAddressByEventIdController
	);
	fastify.put(
		'/events-address/:id/event/:eventId', 
		{schema}, 
		updateEventAddressController
	);
	fastify.delete(
		'/events-address/:id/event/:eventId',
		{schema},
		deleteEventAddressController
	);
}
