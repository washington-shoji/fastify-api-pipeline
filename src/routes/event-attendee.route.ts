import { FastifyInstance } from 'fastify/types/instance';
import {
	createEventAttendeeController,
	deleteEventAttendeeController,
	findEventAttendeeByIdController,
	getEventAttendeesController,
	updateEventAttendeeController,
} from '../controllers/event-attendee.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

export default async function eventAttendeeRoutes(fastify: FastifyInstance) {
	fastify.addHook('preHandler', authMiddleware);
	fastify.post('/event-attendee/event/:eventId', createEventAttendeeController);
	fastify.get('/event-attendee/event/:eventId', getEventAttendeesController);
	fastify.get(
		'/event-attendee/:id/event/:eventId',
		findEventAttendeeByIdController
	);
	fastify.put(
		'/event-attendee/:id/event/:eventId',
		updateEventAttendeeController
	);
	fastify.delete(
		'/event-attendee/:id/event/:eventId',
		deleteEventAttendeeController
	);
}
