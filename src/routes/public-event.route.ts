import { FastifyInstance } from 'fastify/types/instance';
import { getPublicEventsController } from '../controllers/public-event.controller';

export default async function publicEventRoutes(fastify: FastifyInstance) {
	// Get All Events
	fastify.get('/public-events', getPublicEventsController);
}
