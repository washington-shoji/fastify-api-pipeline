import { FastifyInstance } from 'fastify';
import {
	createEventController,
	findEventByIdController,
	getEventsController,
	updateEventController,
	deleteEventController,
	getUserEventsController,
	getOtherUsersEventsController,
	createEventAllInfoController,
	findEventAllInfoByIdController,
} from '../controllers/event.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const bodyJsonSchema = {
	type: 'object',
	required: [
		'title',
		'description',
		'registration_open',
		'registration_close',
		'event_date',
		'location_type',
	],
	properties: {
		title: { type: 'string' },
		description: { type: 'string' },
		registration_open: { type: 'string' },
		registration_close: { type: 'string' },
		event_date: { type: 'string' },
		location_type: { type: 'string' },
	},
};

const paramsJsonSchema = {
	type: 'object',
	properties: {
		eventId: { type: 'string' },
	},
};

const schemaBody = {
	body: bodyJsonSchema,
	params: paramsJsonSchema,
};

const schemaParams = {
	params: paramsJsonSchema,
};

export default async function eventRoutes(fastify: FastifyInstance) {
	fastify.addHook('preHandler', authMiddleware);

	// Create Event
	fastify.post('/events', { schema: schemaBody }, createEventController);

	// Create Event All Info
	fastify.post('/event-all-info', createEventAllInfoController);

	// Get All Events
	fastify.get('/user-events', getUserEventsController);

	// Get Other Users Event Except Logged in User
	fastify.get('/others-events', getOtherUsersEventsController);

	// Get All Events
	fastify.get('/events', getEventsController);

	// Get Single Event by ID
	fastify.get(
		'/events/:eventId',
		{ schema: schemaParams },
		findEventByIdController
	);

	// Get Event All Info by ID
	fastify.get('/event-all-info/:eventId', findEventAllInfoByIdController);

	// Update Event by ID
	fastify.put(
		'/events/:eventId',
		{ schema: schemaBody },
		updateEventController
	);

	// Delete Event by ID
	fastify.delete(
		'/events/:eventId',
		{ schema: schemaParams },
		deleteEventController
	);
}
