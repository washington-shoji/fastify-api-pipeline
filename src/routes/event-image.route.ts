import { FastifyInstance } from 'fastify/types/instance';
import {
	createEventImageController,
	deleteEventImageController,
	findByIdEventImageController,
	updateEventImageController,
} from '../controllers/event-image.controller';

export default async function eventImageRoutes(fastify: FastifyInstance) {
	// Create Event
	fastify.post('/event-image', createEventImageController as any);
	fastify.put('/event-image/:id', updateEventImageController as any);
	fastify.get('/event-image/:id', findByIdEventImageController as any);
	fastify.delete('/event-image/:id', deleteEventImageController as any);
}
