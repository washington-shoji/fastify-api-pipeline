import { FastifyInstance } from 'fastify/types/instance';
import {
	createEventAttendeeController,
	deleteEventAttendeeController,
	findEventAttendeeByEventIdController,
	getEventAttendeesController,
	updateEventAttendeeController,
} from '../controllers/event-attendee.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

export default async function eventAttendeeRoutes(fastify: FastifyInstance) {
	fastify.addHook('preHandler', authMiddleware);
	fastify.post('/event-attendee/event/:eventId', createEventAttendeeController);
	fastify.get('/event-attendee/event', getEventAttendeesController);
	fastify.get(
		'/event-attendee/event/:eventId',
		findEventAttendeeByEventIdController
	);
	fastify.put('/event-attendee/event/:eventId', updateEventAttendeeController);
	fastify.delete(
		'/event-attendee/event/:eventId',
		deleteEventAttendeeController
	);
}
