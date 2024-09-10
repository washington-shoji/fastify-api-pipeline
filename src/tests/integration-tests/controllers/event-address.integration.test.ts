import fastify, { FastifyInstance } from "fastify";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import {
  EventAddressModelRequest,
  EventAddressModelResponse,
} from "../../../models/event-address-model";
import {
  createEventAddressController,
  deleteEventAddressController,
  findEventAddressByEventIdController,
  findEventAddressByIdController,
  updateEventAddressController,
} from "../../../controllers/event-address.controller";
import {
  registerUserService,
  testDeleteUserService,
} from "../../../services/auth.service";
import { testToken } from "../../unit-tests/utils/test-jwt-token";
import {
  createEventAddressService,
  deleteEventAddressService,
} from "../../../services/event-address.service";
import { EventResponseModel, LOCATION_TYPE } from "../../../models/event-model";
import {
  createEventService,
  deleteEventService,
} from "../../../services/event.service";

describe("Event Address Controllers - createEventAddressController", () => {
  let app: FastifyInstance;
  let userId: string;
  let eventId: string;
  let createdEventAddressId: string;
  let testEvent: EventResponseModel;
  let token: string;

  beforeEach(async () => {
    app = fastify();
    app.addHook("preHandler", authMiddleware);
    app.post<{ Params: { eventId: string }; Body: EventAddressModelRequest }>(
      "/events-address/event/:eventId",
      createEventAddressController
    );

    const result = await registerUserService(
      `${Math.random().toString()}`,
      `${Math.random().toString()}@email.com`,
      "test-pass-disabled"
    );

    userId = result.user_id;
    token = testToken(userId);

    const eventData = {
      title: "TEST Event to Update",
      description: "This event will be updated in the test",
      registration_open: new Date(),
      registration_close: new Date(),
      event_date: new Date(),
      location_type: <LOCATION_TYPE>"VENUE",
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

  it("should create an event address and return 201 status", async () => {
    const testEventAddressRequestData = {
      street: "1 Sydney St",
      city_suburb: "Sydney",
      state: "NSW",
      country: "Australia",
      postal_code: "2000",
    };

    const response = await app.inject({
      method: "POST",
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
      street: "1 Sydney St",
      city_suburb: "Sydney",
      state: "NSW",
      country: "Australia",
      postal_code: "2000",
    };

    expect(createdAddressEvent).toStrictEqual(testEventAddressResponseData);
  });

  it("should return 500 status on service failure", async () => {
    const response = await app.inject({
      method: "POST",
      url: `/events-address/event/${eventId}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {}, // Incomplete or invalid event data to trigger error
    });

    expect(response.statusCode).toBe(500);
  });
});

describe("Event Address Controllers - updateEventAddressController", () => {
  let app: FastifyInstance;
  let userId: string;
  let eventId: string;
  let createdEventAddressId: string;
  let testEvent: EventResponseModel;
  let testAddressEvent: EventAddressModelResponse;
  let token: string;

  beforeEach(async () => {
    app = fastify();
    app.addHook("preHandler", authMiddleware);
    app.put<{
      Params: { id: string; eventId: string };
      Body: EventAddressModelRequest;
    }>("/events-address/:id/event/:eventId", updateEventAddressController);

    const result = await registerUserService(
      `${Math.random().toString()}`,
      `${Math.random().toString()}@email.com`,
      "test-pass-disabled"
    );

    userId = result.user_id;
    token = testToken(userId);

    const eventData = {
      title: "TEST Event to Update",
      description: "This event will be updated in the test",
      registration_open: new Date(),
      registration_close: new Date(),
      event_date: new Date(),
      location_type: <LOCATION_TYPE>"VENUE",
    };

    const eventAddressData = {
      street: "1 Sydney St",
      city_suburb: "Sydney",
      state: "NSW",
      country: "Australia",
      postal_code: "2000",
    };

    // Create a test event to fetch later
    testEvent = await createEventService(userId, eventData);
    eventId = testEvent.event_id;

    testAddressEvent = await createEventAddressService(
      eventId,
      eventAddressData
    );

    createdEventAddressId = testAddressEvent.address_id;
  });

  afterEach(async () => {
    // Teardown: Delete all created events to clean up the database
    await deleteEventService(testEvent.event_id, userId);
    await deleteEventAddressService(createdEventAddressId, eventId);
    await testDeleteUserService(userId);
    await app.close();
  });

  it("should update an event address and return 200 status", async () => {
    const updateEventAddressRequestData = {
      street: "1 Melbourne St",
      city_suburb: "Melbourne",
      state: "VIC",
      country: "Australia",
      postal_code: "3000",
    };

    const response = await app.inject({
      method: "PUT",
      url: `/events-address/${createdEventAddressId}/event/${eventId}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: updateEventAddressRequestData,
    });

    expect(response.statusCode).toBe(200);

    const updatedEventAddress = JSON.parse(response.body);
    expect(updatedEventAddress.street).toBe(
      updateEventAddressRequestData.street
    );
    expect(updatedEventAddress.city_suburb).toBe(
      updateEventAddressRequestData.city_suburb
    );
    expect(updatedEventAddress.state).toBe(updateEventAddressRequestData.state);
    expect(updatedEventAddress.country).toBe(
      updateEventAddressRequestData.country
    );
    expect(updatedEventAddress.postal_code).toBe(
      updateEventAddressRequestData.postal_code
    );
  });

  it("should return 500 status on service failure", async () => {
    const response = await app.inject({
      method: "PUT",
      url: `/events-address/non-existent-id/event/non-existent-id`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {},
    });

    expect(response.statusCode).toBe(500);
  });
});

describe("Event Address Controllers - deleteEventAddressController", () => {
    let app: FastifyInstance;
    let userId: string;
    let eventId: string;
    let createdEventAddressId: string;
    let testEvent: EventResponseModel;
    let testAddressEvent: EventAddressModelResponse;
    let token: string;

    beforeEach(async () => {
        app = fastify();
        app.addHook("preHandler", authMiddleware);
        app.delete<{
          Params: { id: string; eventId: string };
        }>('/events-address/:id/event/:eventId', deleteEventAddressController);
    
        const result = await registerUserService(
          `${Math.random().toString()}`,
          `${Math.random().toString()}@email.com`,
          "test-pass-disabled"
        );
    
        userId = result.user_id;
        token = testToken(userId);
    
        const eventData = {
          title: "TEST Event to Delete",
          description: "This event will be deleted in the test",
          registration_open: new Date(),
          registration_close: new Date(),
          event_date: new Date(),
          location_type: <LOCATION_TYPE>"VENUE",
        };
    
        const eventAddressData = {
          street: "1 Sydney St",
          city_suburb: "Sydney",
          state: "NSW",
          country: "Australia",
          postal_code: "2000",
        };
    
        // Create a test event to fetch later
        testEvent = await createEventService(userId, eventData);
        eventId = testEvent.event_id;
    
        testAddressEvent = await createEventAddressService(
          eventId,
          eventAddressData
        );
    
        createdEventAddressId = testAddressEvent.address_id;
      });
    
      afterEach(async () => {
        // Teardown: Delete all created events to clean up the database
        await deleteEventService(testEvent.event_id, userId);
        await testDeleteUserService(userId);
        await app.close();
      });


      it('should delete an event address and return 200 status', async () => {
        const response = await app.inject({
			method: 'DELETE',
            url: `/events-address/${createdEventAddressId}/event/${eventId}`,
			headers: {
				authorization: `Bearer ${token}`,
			},
		});

        expect(response.statusCode).toBe(200);

        // Optionally, verify that the event no longer exists in the database
		const verifyResponse = await app.inject({
			method: 'GET',
            url: `/events-address/${createdEventAddressId}/event/${eventId}`,
			headers: {
				authorization: `Bearer ${token}`,
			},
		});
		expect(verifyResponse.statusCode).toBe(404);
      });


      it('should return 500 status when trying to delete a non-existent event address', async () => {
		const response = await app.inject({
			method: 'DELETE',
            url: `/events-address/non-existent-id/event/${eventId}`,
			headers: {
				authorization: `Bearer ${token}`,
			},
		});

		expect(response.statusCode).toBe(500);
	});
  
});

describe("Event Address Controllers - findEventAddressByIdController", () => {
    let app: FastifyInstance;
    let userId: string;
    let eventId: string;
    let createdEventAddressId: string;
    let testEvent: EventResponseModel;
    let testAddressEvent: EventAddressModelResponse;
    let token: string;
  
    beforeEach(async () => {
      app = fastify();
      app.addHook("preHandler", authMiddleware);
      app.get<{
        Params: { id: string; eventId: string };
      }>("/events-address/:id/event/:eventId", findEventAddressByIdController);
  
      const result = await registerUserService(
        `${Math.random().toString()}`,
        `${Math.random().toString()}@email.com`,
        "test-pass-disabled"
      );
  
      userId = result.user_id;
      token = testToken(userId);
  
      const eventData = {
        title: "TEST Event to Find",
        description: "This event will be found in the test",
        registration_open: new Date(),
        registration_close: new Date(),
        event_date: new Date(),
        location_type: <LOCATION_TYPE>"VENUE",
      };
  
      const eventAddressData = {
        street: "1 Sydney St",
        city_suburb: "Sydney",
        state: "NSW",
        country: "Australia",
        postal_code: "2000",
      };
  
      // Create a test event to fetch later
      testEvent = await createEventService(userId, eventData);
      eventId = testEvent.event_id;
  
      testAddressEvent = await createEventAddressService(
        eventId,
        eventAddressData
      );
  
      createdEventAddressId = testAddressEvent.address_id;
    });
  
    afterEach(async () => {
      // Teardown: Delete all created events to clean up the database
      await deleteEventAddressService(createdEventAddressId, eventId);
      await deleteEventService(testEvent.event_id, userId);
      await testDeleteUserService(userId);
      await app.close();
    });
  
    it("should find an event address and return 200 status", async () => {
  
      const response = await app.inject({
        method: "GET",
        url: `/events-address/${createdEventAddressId}/event/${eventId}`,
        headers: {
          authorization: `Bearer ${token}`,
        }
      });
  
      expect(response.statusCode).toBe(200);
  
      expect(response.statusCode).toBe(200);
      const responseBody = JSON.parse(response.body);
      expect(responseBody.address_id).toBe(createdEventAddressId);
      expect(responseBody.street).toBe(testAddressEvent.street);
      expect(responseBody.city_suburb).toBe(testAddressEvent.city_suburb);
      expect(responseBody.postal_code).toBe(testAddressEvent.postal_code);
      expect(responseBody.state).toBe(testAddressEvent.state);
      expect(responseBody.country).toBe(testAddressEvent.country);
    });
  
    it("should return 500 status on event not found", async () => {
      const response = await app.inject({
        method: "GET",
        url: `/events-address/non-existent-id/event/${eventId}`,
        headers: {
          authorization: `Bearer ${token}`,
        }
      });
  
      expect(response.statusCode).toBe(500);
    });
  });


  describe("Event Address Controllers - findEventAddressByEventIdController", () => {
    let app: FastifyInstance;
    let userId: string;
    let eventId: string;
    let createdEventAddressId: string;
    let testEvent: EventResponseModel;
    let testAddressEvent: EventAddressModelResponse;
    let token: string;
  
    beforeEach(async () => {
      app = fastify();
      app.addHook("preHandler", authMiddleware);
      app.get<{
        Params: { eventId: string };
      }>("/events-address/:id/event/:eventId", findEventAddressByEventIdController);
  
      const result = await registerUserService(
        `${Math.random().toString()}`,
        `${Math.random().toString()}@email.com`,
        "test-pass-disabled"
      );
  
      userId = result.user_id;
      token = testToken(userId);
  
      const eventData = {
        title: "TEST Event to Find",
        description: "This event will be found in the test",
        registration_open: new Date(),
        registration_close: new Date(),
        event_date: new Date(),
        location_type: <LOCATION_TYPE>"VENUE",
      };
  
      const eventAddressData = {
        street: "1 Sydney St",
        city_suburb: "Sydney",
        state: "NSW",
        country: "Australia",
        postal_code: "2000",
      };
  
      // Create a test event to fetch later
      testEvent = await createEventService(userId, eventData);
      eventId = testEvent.event_id;
  
      testAddressEvent = await createEventAddressService(
        eventId,
        eventAddressData
      );
  
      createdEventAddressId = testAddressEvent.address_id;
    });
  
    afterEach(async () => {
      // Teardown: Delete all created events to clean up the database
      await deleteEventAddressService(createdEventAddressId, eventId);
      await deleteEventService(testEvent.event_id, userId);
      await testDeleteUserService(userId);
      await app.close();
    });
  
    it("should find an event address and return 200 status", async () => {
  
      const response = await app.inject({
        method: "GET",
        url: `/events-address//event/${eventId}`,
        headers: {
          authorization: `Bearer ${token}`,
        }
      });
  
      expect(response.statusCode).toBe(200);
  
      expect(response.statusCode).toBe(200);
      const responseBody = JSON.parse(response.body);
      expect(responseBody.address_id).toBe(createdEventAddressId);
      expect(responseBody.street).toBe(testAddressEvent.street);
      expect(responseBody.city_suburb).toBe(testAddressEvent.city_suburb);
      expect(responseBody.postal_code).toBe(testAddressEvent.postal_code);
      expect(responseBody.state).toBe(testAddressEvent.state);
      expect(responseBody.country).toBe(testAddressEvent.country);
    });
  
    it("should return 404 status on event not found", async () => {
      const response = await app.inject({
        method: "GET",
        url: `/events-address/event/non-existent-id`,
        headers: {
          authorization: `Bearer ${token}`,
        }
      });
  
      expect(response.statusCode).toBe(404);
    });
  });