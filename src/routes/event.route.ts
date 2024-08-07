import { FastifyInstance } from 'fastify';
import {
	createEventController,
	findEventByIdController,
	getEventsController,
	updateEventController,
	deleteEventController,
	getUserEventsController,
	getOtherUsersEventsController,
} from '../controllers/event.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

export default async function eventRoutes(fastify: FastifyInstance) {
	fastify.addHook('preHandler', authMiddleware);

	// Create Event
	fastify.post('/events', createEventController);

	// Get All Events
	fastify.get('/user-events', getUserEventsController);

	// Get Other Users Event Except Logged in User
	fastify.get('/others-events', getOtherUsersEventsController);

	// Get All Events
	fastify.get('/events', getEventsController);

	// Get Single Event by ID
	fastify.get('/events/:eventId', findEventByIdController);

	// Update Event by ID
	fastify.put('/events/:eventId', updateEventController);

	// Delete Event by ID
	fastify.delete('/events/:eventId', deleteEventController);
}
