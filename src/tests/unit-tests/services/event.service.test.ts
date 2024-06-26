import {
	createEventService,
	deleteEventService,
	findEventByIdService,
	getEventsService,
	updateEventService,
} from '../../../services/event.service';
import logger from '../../../utils/logger.utils';
import * as eventRepo from '../../../repositories/event.repository';

jest.mock('../../../repositories/event.repository');
jest.mock('../../../utils/logger.utils', () => ({
	error: jest.fn(),
}));

describe('Event Service', () => {
	const mockEvent = {
		id: '1',
		title: 'Test Event',
		description: 'Test description',
		start_time: new Date(),
		end_time: new Date(),
		location: 'Test Locaton',
	};

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('createEventService', () => {
		it('should create an event successfully', async () => {
			(eventRepo.createEvent as jest.Mock).mockResolvedValue(mockEvent);

			const result = await createEventService(mockEvent);

			expect(result).toEqual(mockEvent);
			expect(eventRepo.createEvent).toHaveBeenCalledWith(mockEvent);
		});

		it('should log an error and throw a custom error when creation fails', async () => {
			const error = new Error('Failed to create event');
			(eventRepo.createEvent as jest.Mock).mockRejectedValue(error);

			await expect(createEventService(mockEvent)).rejects.toThrow(
				'Failed to create event. Please try again later.'
			);

			expect(logger.error).toHaveBeenCalledWith(error, 'Error creating event');
		});
	});

	describe('findEventByIdService', () => {
		const eventId = '1';
		const mockEvent = { id: eventId, title: 'Sample Event' }; // Add other necessary properties

		it('should find an event by ID successfully', async () => {
			(eventRepo.findEventById as jest.Mock).mockResolvedValue(mockEvent);

			const result = await findEventByIdService(eventId);

			expect(result).toEqual(mockEvent);
			expect(eventRepo.findEventById).toHaveBeenCalledWith(eventId);
		});

		it('should log an error and throw a custom error when finding by ID fails', async () => {
			const error = new Error('Failed to find event');
			(eventRepo.findEventById as jest.Mock).mockRejectedValue(error);

			await expect(findEventByIdService(eventId)).rejects.toThrow(
				'Failed to find event. Please try again later.'
			);

			expect(logger.error).toHaveBeenCalledWith(
				error,
				'Error could not find event'
			);
		});
	});

	describe('getEventsService', () => {
		const mockEvents = [
			{
				id: '1',
				title: 'Event 1',
				start_time: new Date(),
				end_time: new Date(),
				location: 'Test Locaton',
			},
			{
				id: '2',
				title: 'Event 2',
				start_time: new Date(),
				end_time: new Date(),
				location: 'Test Locaton',
			},
		]; // Add other properties as needed

		it('should retrieve all events successfully', async () => {
			(eventRepo.getEvents as jest.Mock).mockResolvedValue(mockEvents);

			const result = await getEventsService();

			expect(result).toEqual(mockEvents);
			expect(eventRepo.getEvents).toHaveBeenCalled();
		});

		it('should log an error and throw a custom error when retrieval fails', async () => {
			const error = new Error('Failed to retrieve events');
			(eventRepo.getEvents as jest.Mock).mockRejectedValue(error);

			await expect(getEventsService()).rejects.toThrow(
				'Failed to find events. Please try again later.'
			);

			expect(logger.error).toHaveBeenCalledWith(
				error,
				'Error could not find events'
			);
		});
	});

	describe('updateEventService', () => {
		const eventId = '1';
		const mockEventData = {
			title: 'Updated Event',
			description: 'Test description',
			start_time: new Date(),
			end_time: new Date(),
			location: 'Test Locaton',
		}; // Add other necessary properties
		const updatedEvent = { id: eventId, ...mockEventData };

		it('should update an event successfully', async () => {
			(eventRepo.updateEvent as jest.Mock).mockResolvedValue(updatedEvent);

			const result = await updateEventService(eventId, mockEventData);

			expect(result).toEqual(updatedEvent);
			expect(eventRepo.updateEvent).toHaveBeenCalledWith(
				eventId,
				mockEventData
			);
		});

		it('should log an error and throw a custom error when update fails', async () => {
			const error = new Error('Failed to update event');
			(eventRepo.updateEvent as jest.Mock).mockRejectedValue(error);

			await expect(updateEventService(eventId, mockEventData)).rejects.toThrow(
				'Failed to update event. Please try again later.'
			);

			expect(logger.error).toHaveBeenCalledWith(
				error,
				'Error could not update event'
			);
		});
	});

	describe('deleteEventService', () => {
		const eventId = '1';

		it('should delete an event successfully', async () => {
			(eventRepo.deleteEvent as jest.Mock).mockResolvedValue(undefined); // Assuming deleteEvent returns nothing on success

			await deleteEventService(eventId);

			expect(eventRepo.deleteEvent).toHaveBeenCalledWith(eventId);
		});

		it('should log an error and throw a custom error when deletion fails', async () => {
			const error = new Error('Failed to delete event');
			(eventRepo.deleteEvent as jest.Mock).mockRejectedValue(error);

			await expect(deleteEventService(eventId)).rejects.toThrow(
				'Failed to delete event. Please try again later.'
			);

			expect(logger.error).toHaveBeenCalledWith(
				error,
				'Error could not delete event'
			);
		});
	});
});
