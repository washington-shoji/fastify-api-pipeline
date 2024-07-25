import { FastifyInstance } from 'fastify';
import { getAllRegisteredEventsController } from '../controllers/event-registered.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
export default async function eventRegisteredRoutes(fastify: FastifyInstance) {
	fastify.addHook('preHandler', authMiddleware);
	fastify.get('/registered-events', getAllRegisteredEventsController);
}
