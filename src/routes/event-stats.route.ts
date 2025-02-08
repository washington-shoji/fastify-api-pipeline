import { FastifyInstance } from 'fastify';
import { authMiddleware } from '../middlewares/auth.middleware';
import { getEventsStatsController } from '../controllers/event-stats.controller';

export default async function eventStatsRoutes(fastify: FastifyInstance) {
	fastify.addHook('preHandler', authMiddleware);

	fastify.get('/events-stats', getEventsStatsController);
}
