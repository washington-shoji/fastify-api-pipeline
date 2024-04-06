import fastify, { FastifyInstance } from 'fastify';
import { EventModel } from '../../models/event-model';
import { createEventController } from '../../controllers/event.controller';

describe('Event Controllers', () => {
	let app: FastifyInstance;

	beforeAll(() => {
		app = fastify();
		app.post<{ Body: EventModel }>('/events', createEventController);
	});

	afterAll(() => {
		app.close();
	});

	describe('createEventController', () => {
		it('should create an event and return 201 status', async () => {
			const mockEvent: EventModel = {
				title: 'Test Event',
				description: 'Test Description',
				start_time: new Date(),
				end_time: new Date(),
				location: 'Test Location',
			};

			const response = await app.inject({
				method: 'POST',
				url: '/events',
				payload: mockEvent,
			});

			expect(response.statusCode).toBe(201);
			// Further assertions can be made on the response body if necessary
		});

		// Additional test to simulate a failure scenario
		it('should return 500 status on service failure', async () => {
			// Mock the createEventService to throw an error
			jest.mock('../../services/event.service', () => ({
				createEventService: jest
					.fn()
					.mockRejectedValue(new Error('Service Error')),
			}));

			const response = await app.inject({
				method: 'POST',
				url: '/events',
				payload: {}, // Incomplete or invalid event data to trigger error
			});

			expect(response.statusCode).toBe(500);
		});
	});
});
