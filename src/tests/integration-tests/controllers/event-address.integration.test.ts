import fastify, { FastifyInstance } from 'fastify';
import { authMiddleware } from '../../../middlewares/auth.middleware';
import { EventAddressModelRequest } from '../../../models/event-address-model';
import { createEventAddressController } from '../../../controllers/event-address.controller';
import { registerUserService, testDeleteUserService } from '../../../services/auth.service';
import { testToken } from '../../unit-tests/utils/test-jwt-token';
import { deleteEventAddressService } from '../../../services/event-address.service';
import { EventResponseModel, LOCATION_TYPE } from '../../../models/event-model';
import { createEventService, deleteEventService } from '../../../services/event.service';



describe('Event Address Controllers - createEventAddressController', () => {
	let app: FastifyInstance;
	let userId: string;
    let eventId: string;
	let createdEventAddressId: string;
    let testEvent: EventResponseModel;
	let token: string;

    beforeEach(async () => {
		app = fastify();
		app.addHook('preHandler', authMiddleware);
		app.post<{Params: { eventId: string }; Body: EventAddressModelRequest; }>('/events-address/event/:eventId', createEventAddressController);

		const result = await registerUserService(
			`${Math.random().toString()}`,
			`${Math.random().toString()}@email.com`,
			'test-pass-disabled'
		);

		userId = result.user_id;
		token = testToken(userId);

        const eventData = {
			title: 'TEST Event to Update',
			description: 'This event will be updated in the test',
			registration_open: new Date(),
			registration_close: new Date(),
			event_date: new Date(),
			location_type: <LOCATION_TYPE>'ONLINE',
		};

		// Create a test event to fetch later
		testEvent = await createEventService(userId, eventData);
        eventId = testEvent.event_id;
        
	});

    afterEach(async () => {
		// Teardown: Delete all created events to clean up the database
        await deleteEventService(testEvent.event_id, userId);
		await deleteEventAddressService(createdEventAddressId, eventId);
		await testDeleteUserService(userId);
		await app.close();
	});


    it('should create an event address and return 201 status', async () => {

        const testEventAddressRequestData = {
            street: '1 Sydney St',
            city_suburb: 'Sydney',
            state: 'NSW',
            country: 'Australia',
            postal_code: '2000'
        };

        const response = await app.inject({
			method: 'POST',
			url: `/events-address/event/${eventId}`,
			headers: {
				authorization: `Bearer ${token}`,
			},
			payload: testEventAddressRequestData,
		});

        expect(response.statusCode).toBe(201);
		const createdAddressEvent = JSON.parse(response.body);
		createdEventAddressId = createdAddressEvent.address_id;

        const testEventAddressResponseData = {
            address_id: createdAddressEvent.address_id,
            street: '1 Sydney St',
            city_suburb: 'Sydney',
            state: 'NSW',
            country: 'Australia',
            postal_code: '2000'
        };

        expect(createdAddressEvent).toStrictEqual(testEventAddressResponseData);
    });

});