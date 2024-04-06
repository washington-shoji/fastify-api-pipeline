import { FastifyInstance } from 'fastify';
import {
	createEventController,
	findEventByIdController,
	getEventsController,
	updateEventController,
	deleteEventController,
} from '../controllers/event.controller';

export default async function eventRoutes(fastify: FastifyInstance) {
	// Create Event
	fastify.post('/events', createEventController);

	// Get All Events
	fastify.get('/events', getEventsController);

	// Get Single Event by ID
	fastify.get('/events/:id', findEventByIdController);

	// Update Event by ID
	fastify.put('/events/:id', updateEventController);

	// Delete Event by ID
	fastify.delete('/events/:id', deleteEventController);
}
