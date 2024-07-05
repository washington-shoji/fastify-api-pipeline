import { FastifyInstance } from 'fastify';
import {
	createEventController,
	findEventByIdController,
	getEventsController,
	updateEventController,
	deleteEventController,
	getUserEventsController,
} from '../controllers/event.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

export default async function eventRoutes(fastify: FastifyInstance) {
	fastify.addHook('preHandler', authMiddleware);
	// Create Event
	fastify.post('/events', createEventController);

	// Get All Events
	fastify.get('/user-events', getUserEventsController);

	// Get All Events
	fastify.get('/events', getEventsController);

	// Get Single Event by ID
	fastify.get('/events/:id', findEventByIdController);

	// Update Event by ID
	fastify.put('/events/:id', updateEventController);

	// Delete Event by ID
	fastify.delete('/events/:id', deleteEventController);
}
