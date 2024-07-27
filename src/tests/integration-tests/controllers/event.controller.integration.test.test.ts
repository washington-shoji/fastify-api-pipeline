import fastify, { FastifyInstance } from 'fastify';
import {
	EventEntityModel,
	EventRequestModel,
	EventResponseModel,
	LOCATION_TYPE,
} from '../../../models/event-model';
import {
	createEventController,
	deleteEventController,
	findEventByIdController,
	getEventsController,
	updateEventController,
} from '../../../controllers/event.controller';
import {
	createEventService,
	deleteEventService,
} from '../../../services/event.service';
import { authMiddleware } from '../../../middlewares/auth.middleware';
import { testToken } from '../../unit-tests/utils/test-jwt-token';
import {
	registerUserService,
	testDeleteUserService,
} from '../../../services/auth.service';

describe('Event Controllers - createEventController', () => {
	let app: FastifyInstance;
	let userId: string;
	let createdEventId: string;
	let token: string;

	beforeEach(async () => {
		app = fastify();
		app.addHook('preHandler', authMiddleware);
		app.post<{ Body: EventRequestModel }>('/events', createEventController);

		const result = await registerUserService(
			`${Math.random().toString()}`,
			`${Math.random().toString()}@email.com`,
			'test-pass-disabled'
		);

		userId = result.user_id;
		token = testToken(userId);
	});

	afterEach(async () => {
		// Teardown: Delete all created events to clean up the database
		await deleteEventService(createdEventId, userId);
		await testDeleteUserService(userId);
		await app.close();
	});

	it('should create an event and return 201 status', async () => {
		const testRequestEventData: EventRequestModel = {
			title: 'TEST Event',
			description: 'Test Description',
			registration_open: new Date(),
			registration_close: new Date(),
			event_date: new Date(),
			location_type: <LOCATION_TYPE>'ONLINE',
		};

		const response = await app.inject({
			method: 'POST',
			url: '/events',
			headers: {
				authorization: `Bearer ${token}`,
			},
			payload: testRequestEventData,
		});

		expect(response.statusCode).toBe(201);
		const createdEvent = JSON.parse(response.body);
		createdEventId = createdEvent.event_id;
		// Further assertions can be made on the response body if necessary

		const testResponseEventData: EventResponseModel = {
			event_id: createdEventId,
			title: 'TEST Event',
			description: 'Test Description',
			registration_open: createdEvent.registration_open,
			registration_close: createdEvent.registration_close,
			event_date: createdEvent.event_date,
			location_type: <LOCATION_TYPE>'ONLINE',
		};

		expect(createdEvent).toStrictEqual(testResponseEventData);
	});

	// Additional test to simulate a failure scenario
	it('should return 500 status on service failure', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/events',
			headers: {
				authorization: `Bearer ${token}`,
			},
			payload: {}, // Incomplete or invalid event data to trigger error
		});

		expect(response.statusCode).toBe(500);
	});
});

describe('Event Controllers - updateEventController', () => {
	let app: FastifyInstance;
	let testEvent: EventResponseModel;
	let userId: string;
	let token: string;

	beforeEach(async () => {
		app = fastify();
		app.addHook('preHandler', authMiddleware);
		app.put<{ Params: { eventId: string }; Body: EventRequestModel }>(
			'/events/:eventId',
			updateEventController
		);

		const result = await registerUserService(
			`${Math.random().toString()}`,
			`${Math.random().toString()}@email.com`,
			'test-pass-disabled'
		);

		userId = result.user_id;
		token = testToken(userId);

		const eventData = {
			user_id: userId,
			title: 'TEST Event to Update',
			description: 'This event will be updated in the test',
			registration_open: new Date(),
			registration_close: new Date(),
			event_date: new Date(),
			location_type: <LOCATION_TYPE>'ONLINE',
		};

		// Create a test event to fetch later
		testEvent = await createEventService(userId, eventData);
	});

	afterEach(async () => {
		// Teardown: Delete all created/updated events to clean up the database
		await deleteEventService(testEvent.event_id, userId);
		await testDeleteUserService(userId);
		await app.close();
	});

	it('should update an event and return the updated event', async () => {
		const updateEventData: EventEntityModel = {
			user_id: userId,
			title: 'TEST Updated Event',
			description: testEvent.description,
			registration_open: testEvent.registration_open,
			registration_close: testEvent.registration_close,
			event_date: testEvent.event_date,
			location_type: <LOCATION_TYPE>'ONLINE',
		};

		const response = await app.inject({
			method: 'PUT',
			url: `/events/${testEvent.event_id}`,
			headers: {
				authorization: `Bearer ${token}`,
			},
			payload: updateEventData,
		});

		expect(response.statusCode).toBe(200);
		const updatedEvent = JSON.parse(response.body);
		expect(updatedEvent.title).toBe(updateEventData.title);
		expect(updatedEvent.description).toBe(updateEventData.description);
		expect(updatedEvent.location_type).toBe(updateEventData.location_type);
		// Further assertions as needed
	});

	it('should return 500 for a non-existent event ID', async () => {
		const response = await app.inject({
			method: 'PUT',
			url: '/events/non-existent-id',
			headers: {
				authorization: `Bearer ${token}`,
			},
			payload: {
				title: 'Non-existent Event',
			},
		});

		expect(response.statusCode).toBe(500);
	});

	// Additional tests for different scenarios, e.g., invalid data, can be added here
});

describe('Event Controllers - deleteEventController', () => {
	let app: FastifyInstance;
	let userId: string;
	let token: string;
	let testEvent: EventResponseModel;

	beforeEach(async () => {
		app = fastify();
		app.addHook('preHandler', authMiddleware);
		app.delete<{ Params: { eventId: string } }>(
			'/events/:eventId',
			deleteEventController
		);

		const result = await registerUserService(
			`${Math.random().toString()}`,
			`${Math.random().toString()}@email.com`,
			'test-pass-disabled'
		);

		userId = result.user_id;
		token = testToken(userId);

		const eventData = {
			user_id: userId,
			title: 'TEST Event to Delete',
			description: 'This event will be deleted in the tests',
			registration_open: new Date(),
			registration_close: new Date(),
			event_date: new Date(),
			location_type: <LOCATION_TYPE>'ONLINE',
		};
		// Create an event to delete later
		testEvent = await createEventService(userId, eventData);
	});

	afterEach(async () => {
		// Teardown: Delete all created/updated events to clean up the database
		await deleteEventService(testEvent.event_id, userId);
		await testDeleteUserService(userId);
		await app.close();
	});

	it('should delete an event and return 204 status', async () => {
		const response = await app.inject({
			method: 'DELETE',
			url: `/events/${testEvent.event_id}`,
			headers: {
				authorization: `Bearer ${token}`,
			},
		});

		expect(response.statusCode).toBe(200);

		// Optionally, verify that the event no longer exists in the database
		const verifyResponse = await app.inject({
			method: 'GET',
			url: `/events/${testEvent.event_id}`,
			headers: {
				authorization: `Bearer ${token}`,
			},
		});
		expect(verifyResponse.statusCode).toBe(404);
	});

	it('should return 500 status when trying to delete a non-existent event', async () => {
		const response = await app.inject({
			method: 'DELETE',
			url: '/events/non-existent-id',
			headers: {
				authorization: `Bearer ${token}`,
			},
		});

		expect(response.statusCode).toBe(500);
	});

	// Additional tests for other scenarios can be added here
});

describe('Event Controllers - findEventByIdController', () => {
	let app: FastifyInstance;
	let userId: string;
	let token: string;
	let testEvent: EventResponseModel;

	beforeEach(async () => {
		app = fastify();
		app.addHook('preHandler', authMiddleware);
		app.get<{ Params: { eventId: string } }>(
			'/events/:eventId',
			findEventByIdController
		);

		const result = await registerUserService(
			`${Math.random().toString()}`,
			`${Math.random().toString()}@email.com`,
			'test-pass-disabled'
		);

		userId = result.user_id;
		token = testToken(userId);
		// Create a test event to fetch later
		const eventData = {
			user_id: userId,
			title: 'TEST Event to Find',
			description: 'This event will be fetched in the tests',
			registration_open: new Date(),
			registration_close: new Date(),
			event_date: new Date(),
			location_type: <LOCATION_TYPE>'ONLINE',
		};
		testEvent = await createEventService(userId, eventData);
	});

	afterEach(async () => {
		// Clean up: Delete the test event
		await deleteEventService(testEvent.event_id, userId);
		await testDeleteUserService(userId);
		await app.close();
	});

	it('should return the event for an existing event ID', async () => {
		const response = await app.inject({
			method: 'GET',
			url: `/events/${testEvent.event_id}`,
			headers: {
				authorization: `Bearer ${token}`,
			},
		});

		expect(response.statusCode).toBe(200);
		const responseBody = JSON.parse(response.body);
		expect(responseBody.event_id).toBe(testEvent.event_id);
		expect(responseBody.title).toBe(testEvent.title);
		// Further assertions as needed based on the event structure
	});

	it('should return 500 for a non-existent event ID', async () => {
		const response = await app.inject({
			method: 'GET',
			url: '/events/non-existent-id',
			headers: {
				authorization: `Bearer ${token}`,
			},
		});

		expect(response.statusCode).toBe(500);
		expect(response.body).toContain('Error retrieving event');
	});

	// Additional tests for error scenarios can be added here
});

describe('Event Controllers - getEventsController', () => {
	let app: FastifyInstance;
	let userId: string;
	let token: string;
	let testEvent1: EventResponseModel;
	let testEvent2: EventResponseModel;

	beforeEach(async () => {
		app = fastify();
		app.addHook('preHandler', authMiddleware);
		app.get('/events', getEventsController);

		const result = await registerUserService(
			`${Math.random().toString()}`,
			`${Math.random().toString()}@email.com`,
			'test-pass-disabled'
		);

		userId = result.user_id;
		token = testToken(userId);
		// Create a couple of test events to be fetched later
		testEvent1 = await createEventService(userId, {
			title: 'TEST Delete Event 1',
			description: 'Description 1',
			registration_open: new Date(),
			registration_close: new Date(),
			event_date: new Date(),
			location_type: <LOCATION_TYPE>'VENUE',
		});

		testEvent2 = await createEventService(userId, {
			title: 'TEST Delete Event 2',
			description: 'Description 2',
			registration_open: new Date(),
			registration_close: new Date(),
			event_date: new Date(),
			location_type: <LOCATION_TYPE>'ONLINE',
		});
	});

	afterEach(async () => {
		// Clean up: Delete all created events
		await deleteEventService(testEvent1.event_id, userId);
		await deleteEventService(testEvent2.event_id, userId);
		await testDeleteUserService(userId);
		await app.close();
	});

	it('should return all existing events', async () => {
		const response = await app.inject({
			method: 'GET',
			url: '/events',
			headers: {
				authorization: `Bearer ${token}`,
			},
		});

		expect(response.statusCode).toBe(200);
		const responseBody = JSON.parse(response.body);
		expect(Array.isArray(responseBody)).toBe(true);
		expect(responseBody.length).toBeGreaterThanOrEqual(2); // Ensure at least the 2 created events are returned
		// Additional assertions to check if the created events are in the response
	});

	// Additional test to simulate a failure scenario
	it('should return 404 status on route service failure', async () => {
		const response = await app.inject({
			method: 'GET',
			url: '/events-invalid',
			headers: {
				authorization: `Bearer ${token}`,
			},
		});

		expect(response.statusCode).toBe(404);
	});
});
