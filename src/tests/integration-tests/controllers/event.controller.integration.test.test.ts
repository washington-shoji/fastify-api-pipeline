import fastify, { FastifyInstance } from 'fastify';
import { EventModel } from '../../../models/event-model';
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

describe('Event Controllers - createEventController', () => {
	let app: FastifyInstance;
	let createdEventId: string;

	beforeEach(() => {
		app = fastify();
		app.post<{ Body: EventModel }>('/events', createEventController);
	});

	afterEach(async () => {
		// Teardown: Delete all created events to clean up the database
		await deleteEventService(createdEventId);
		await app.close();
	});

	it('should create an event and return 201 status', async () => {
		const testEventData: EventModel = {
			title: 'TEST Event',
			description: 'Test Description',
			start_time: new Date(),
			end_time: new Date(),
			location: 'Test Location',
		};

		const response = await app.inject({
			method: 'POST',
			url: '/events',
			payload: testEventData,
		});

		expect(response.statusCode).toBe(201);
		const createdEvent = JSON.parse(response.body);
		createdEventId = createdEvent.id;
		// Further assertions can be made on the response body if necessary
	});

	// Additional test to simulate a failure scenario
	it('should return 500 status on service failure', async () => {
		const response = await app.inject({
			method: 'POST',
			url: '/events',
			payload: {}, // Incomplete or invalid event data to trigger error
		});

		expect(response.statusCode).toBe(500);
	});
});

describe('Event Controllers - updateEventController', () => {
	let app: FastifyInstance;
	let testEvent: EventModel;

	beforeEach(async () => {
		app = fastify();
		app.put<{ Params: { id: string }; Body: EventModel }>(
			'/events/:id',
			updateEventController
		);

		// Create a test event to fetch later
		testEvent = await createEventService({
			title: 'TEST Event to Update',
			description: 'This event will be updated in the test',
			start_time: new Date(),
			end_time: new Date(),
			location: 'Test Location',
		});
	});

	afterEach(async () => {
		// Teardown: Delete all created/updated events to clean up the database
		await deleteEventService(testEvent.id as string);
		await app.close();
	});

	it('should update an event and return the updated event', async () => {
		const updateEventData: EventModel = {
			title: 'TEST Updated Event',
			description: testEvent.description,
			start_time: testEvent.start_time,
			end_time: testEvent.end_time,
			location: 'Updated Location',
		};

		const response = await app.inject({
			method: 'PUT',
			url: `/events/${testEvent.id}`,
			payload: updateEventData,
		});

		expect(response.statusCode).toBe(200);
		const updatedEvent = JSON.parse(response.body);
		expect(updatedEvent.title).toBe(updateEventData.title);
		expect(updatedEvent.description).toBe(updateEventData.description);
		expect(updatedEvent.location).toBe(updateEventData.location);
		// Further assertions as needed
	});

	it('should return 500 for a non-existent event ID', async () => {
		const response = await app.inject({
			method: 'PUT',
			url: '/events/non-existent-id',
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
	let testEventId: string;

	beforeEach(async () => {
		app = fastify();
		app.delete<{ Params: { id: string } }>(
			'/events/:id',
			deleteEventController
		);

		// Create an event to delete later
		const testEvent = await createEventService({
			title: 'TEST Event to Delete',
			description: 'This event will be deleted in the tests',
			start_time: new Date(),
			end_time: new Date(),
			location: 'Test Location',
		});
		testEventId = testEvent.id;
	});

	afterEach(async () => {
		// Clean up: Ensure the test event is deleted (in case the test failed to delete it)
		await deleteEventService(testEventId);
		await app.close();
	});

	it('should delete an event and return 204 status', async () => {
		const response = await app.inject({
			method: 'DELETE',
			url: `/events/${testEventId}`,
		});

		expect(response.statusCode).toBe(204);

		// Optionally, verify that the event no longer exists in the database
		const verifyResponse = await app.inject({
			method: 'GET',
			url: `/events/${testEventId}`,
		});
		expect(verifyResponse.statusCode).toBe(404);
	});

	it('should return 500 status when trying to delete a non-existent event', async () => {
		const response = await app.inject({
			method: 'DELETE',
			url: '/events/non-existent-id',
		});

		expect(response.statusCode).toBe(500);
	});

	// Additional tests for other scenarios can be added here
});

describe('Event Controllers - findEventByIdController', () => {
	let app: FastifyInstance;
	let testEvent: EventModel;

	beforeEach(async () => {
		app = fastify();
		app.get<{ Params: { id: string } }>('/events/:id', findEventByIdController);

		// Create a test event to fetch later
		testEvent = await createEventService({
			title: 'TEST Event to Find',
			description: 'This event will be fetched in the tests',
			start_time: new Date(),
			end_time: new Date(),
			location: 'Test Location',
		});
	});

	afterEach(async () => {
		// Clean up: Delete the test event
		await deleteEventService(testEvent.id as string);
		await app.close();
	});

	it('should return the event for an existing event ID', async () => {
		const response = await app.inject({
			method: 'GET',
			url: `/events/${testEvent.id}`,
		});

		expect(response.statusCode).toBe(200);
		const responseBody = JSON.parse(response.body);
		expect(responseBody.id).toBe(testEvent.id);
		expect(responseBody.title).toBe(testEvent.title);
		// Further assertions as needed based on the event structure
	});

	it('should return 500 for a non-existent event ID', async () => {
		const response = await app.inject({
			method: 'GET',
			url: '/events/non-existent-id',
		});

		expect(response.statusCode).toBe(500);
		expect(response.body).toContain('Error retrieving event');
	});

	// Additional tests for error scenarios can be added here
});

describe('Event Controllers - getEventsController', () => {
	let app: FastifyInstance;
	const createdEventIds: string[] = [];

	beforeEach(async () => {
		app = fastify();
		app.get('/events', getEventsController);

		// Create a couple of test events to be fetched later
		const event1 = await createEventService({
			title: 'TEST Event 1',
			description: 'Description 1',
			start_time: new Date(),
			end_time: new Date(),
			location: 'Location 1',
		});
		createdEventIds.push(event1.id);

		const event2 = await createEventService({
			title: 'TEST Event 2',
			description: 'Description 2',
			start_time: new Date(),
			end_time: new Date(),
			location: 'Location 2',
		});
		createdEventIds.push(event2.id);
	});

	afterEach(async () => {
		// Clean up: Delete all created events
		createdEventIds.forEach(async (eventId) => {
			await deleteEventService(eventId);
		});
		// for (const eventId of createdEventIds) {
		// 	await deleteEventService(eventId);
		// }
		await app.close();
	});

	it('should return all existing events', async () => {
		const response = await app.inject({
			method: 'GET',
			url: '/events',
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
		});

		expect(response.statusCode).toBe(404);
	});
});
