import {
	createEventService,
	deleteEventService,
	findEventByIdService,
	getEventsService,
	updateEventService,
} from '../../../services/event.service';
import * as eventRepo from '../../../repositories/event.repository';
import { LOCATION_TYPE } from '../../../models/event-model';

jest.mock('../../../repositories/event.repository');
jest.mock('../../../utils/logger.utils', () => ({
	error: jest.fn(),
}));

describe('Event Service', () => {
	const userId = 'mock-userUuid-1';
	const mockRequestEvent = {
		event_id: 'mock-uuid',
		title: 'Test Event',
		description: 'Test description',
		registration_open: new Date(),
		registration_close: new Date(),
		event_date: new Date(),
		location_type: <LOCATION_TYPE>'VENUE',
	};
	const mockEventEntity = {
		event_id: 'mock-uuid',
		user_id: 'mock-userUuid-1',
		title: 'Test Event',
		description: 'Test description',
		registration_open: new Date(),
		registration_close: new Date(),
		event_date: new Date(),
		location_type: <LOCATION_TYPE>'VENUE',
	};

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('createEventService', () => {
		it('should create an event successfully', async () => {
			(eventRepo.createEvent as jest.Mock).mockResolvedValue(mockEventEntity);

			const result = await createEventService(userId, mockRequestEvent);

			expect(result).toEqual(mockRequestEvent);
			expect(eventRepo.createEvent).toHaveBeenCalledWith(mockEventEntity);
		});

		it('should log an error and throw a custom error when creation fails', async () => {
			const error = new Error('Failed to create event');
			(eventRepo.createEvent as jest.Mock).mockRejectedValue(error);

			await expect(createEventService(userId, mockEventEntity)).rejects.toThrow(
				'Failed to create event. Please try again later.'
			);
		});
	});

	describe('findEventByIdService', () => {
		const eventId = 'mock-uuid';
		const mockResponseEvent = {
			event_id: eventId,
			title: 'Test Event',
			description: 'Test description',
			registration_open: new Date(),
			registration_close: new Date(),
			event_date: new Date(),
			location_type: <LOCATION_TYPE>'ONLINE',
		}; // Add other necessary properties

		it('should find an event by ID successfully', async () => {
			(eventRepo.findEventById as jest.Mock).mockResolvedValue(
				mockResponseEvent
			);

			const result = await findEventByIdService(eventId, userId);

			expect(result).toEqual(mockResponseEvent);
			expect(eventRepo.findEventById).toHaveBeenCalledWith(eventId, userId);
		});

		it('should log an error and throw a custom error when finding by ID fails', async () => {
			const error = new Error('Failed to find event');
			(eventRepo.findEventById as jest.Mock).mockRejectedValue(error);

			await expect(findEventByIdService(eventId, userId)).rejects.toThrow(
				'Failed to find event. Please try again later.'
			);
		});
	});

	describe('getEventsService', () => {
		const mockResponseEvents = [
			{
				event_id: 'mock-uuid-1',
				title: 'Event 1',
				description: 'Test description',
				registration_open: new Date(),
				registration_close: new Date(),
				event_date: new Date(),
				location_type: <LOCATION_TYPE>'VENUE',
			},
			{
				event_id: 'mock-uuid-2',
				title: 'Event 2',
				description: 'Test description',
				registration_open: new Date(),
				registration_close: new Date(),
				event_date: new Date(),
				location_type: <LOCATION_TYPE>'VENUE',
			},
		]; // Add other properties as needed

		it('should retrieve all events successfully', async () => {
			(eventRepo.getEvents as jest.Mock).mockResolvedValue(mockResponseEvents);

			const result = await getEventsService();

			expect(result).toEqual(mockResponseEvents);
			expect(eventRepo.getEvents).toHaveBeenCalled();
		});

		it('should log an error and throw a custom error when retrieval fails', async () => {
			const error = new Error('Failed to retrieve events');
			(eventRepo.getEvents as jest.Mock).mockRejectedValue(error);

			await expect(getEventsService()).rejects.toThrow(
				'Failed to find events. Please try again later.'
			);
		});
	});

	describe('updateEventService', () => {
		const eventId = 'mock-uuid';
		const mockEventResponseData = {
			event_id: eventId,
			title: 'Updated Event Title',
			description: 'Event description',
			registration_open: new Date(),
			registration_close: new Date(),
			event_date: new Date(),
			location_type: <LOCATION_TYPE>'VENUE',
		}; // Add other necessary properties
		const mockEventData = {
			event_id: eventId,
			user_id: 'mock-userUuid-1',
			title: 'Event Title',
			description: 'Event description',
			registration_open: new Date(),
			registration_close: new Date(),
			event_date: new Date(),
			location_type: <LOCATION_TYPE>'VENUE',
		}; // Add other necessary properties

		it('should update an event successfully', async () => {
			(eventRepo.updateEvent as jest.Mock).mockResolvedValue(
				mockEventResponseData
			);

			const result = await updateEventService(eventId, userId, mockEventData);

			expect(result).toEqual(mockEventResponseData);
			expect(eventRepo.updateEvent).toHaveBeenCalledWith(mockEventData);
		});

		it('should log an error and throw a custom error when update fails', async () => {
			const error = new Error('Failed to update event');
			(eventRepo.updateEvent as jest.Mock).mockRejectedValue(error);

			await expect(
				updateEventService(eventId, userId, mockEventData)
			).rejects.toThrow('Failed to update event. Please try again later.');
		});
	});

	describe('deleteEventService', () => {
		const eventId = 'mock-uuid';

		it('should delete an event successfully', async () => {
			(eventRepo.deleteEvent as jest.Mock).mockResolvedValue(undefined); // Assuming deleteEvent returns nothing on success

			await deleteEventService(eventId, userId);

			expect(eventRepo.deleteEvent).toHaveBeenCalledWith(eventId, userId);
		});

		it('should log an error and throw a custom error when deletion fails', async () => {
			const error = new Error('Failed to delete event');
			(eventRepo.deleteEvent as jest.Mock).mockRejectedValue(error);

			await expect(deleteEventService(eventId, userId)).rejects.toThrow(
				'Failed to delete event. Please try again later.'
			);
		});
	});
});
