import { FastifyInstance } from 'fastify';
import { healthCheckController } from '../controllers/api-health-check.controller';

export default async function healthCheckRoutes(fastify: FastifyInstance) {
	fastify.get('/', healthCheckController);
}
