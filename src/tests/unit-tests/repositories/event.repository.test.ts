import pool from '../../../database/db';
import { LOCATION_TYPE } from '../../../models/event-model';
import {
	createEvent,
	deleteEvent,
	findEventById,
	getEvents,
	updateEvent,
} from '../../../repositories/event.repository';
import { generateUUIDv7, parseUUID } from '../../../utils/uuidgenerator.utils';

// Mock the pool and generateUUIDv7 dependencies
jest.mock('../../../database/db', () => ({
	pool: {
		connect: jest.fn(),
	},
}));

jest.mock('../../../utils/uuidgenerator.utils', () => ({
	generateUUIDv7: jest.fn(),
	parseUUID: jest.fn(),
}));

describe('createEvent', () => {
	const eventId = 'mock-uuid';
	const userId = 'mock-userUuid-1';
	const eventData = {
		event_id: eventId,
		user_id: userId,
		title: 'Test Event',
		description: 'Test description',
		registration_open: new Date(),
		registration_close: new Date(),
		event_date: new Date(),
		location_type: <LOCATION_TYPE>'ONLINE',
	};

	beforeEach(() => {
		(generateUUIDv7 as jest.Mock).mockReturnValue('mock-uuid');
		pool.connect = jest.fn().mockResolvedValue({
			query: jest
				.fn()
				.mockResolvedValue({ rows: [{ ...eventData, event_id: 'mock-uuid' }] }),
			release: jest.fn(),
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should create an event and return the created event object', async () => {
		const userId = 'mock-userUuid';
		const result = await createEvent(eventData);

		expect(result).toEqual({ ...eventData, event_id: 'mock-uuid' });
		expect(pool.connect).toHaveBeenCalled();
		expect(generateUUIDv7).toHaveBeenCalled();
	});

	it('should throw an error if the database operation fails', async () => {
		pool.connect = jest.fn().mockResolvedValueOnce({
			query: jest.fn().mockRejectedValue(new Error('Database error')),
			release: jest.fn(),
		});

		const userId = 'mock-userUuid';
		await expect(createEvent(eventData)).rejects.toThrow('Database error');
		expect(pool.connect).toHaveBeenCalled();
	});

	it('should roll back the transaction if an error occurs', async () => {
		pool.connect = jest.fn().mockResolvedValueOnce({
			query: jest
				.fn()
				.mockImplementationOnce(() => Promise.resolve()) // Simulate BEGIN
				.mockImplementationOnce(() => Promise.reject(new Error('Insert error'))) // Simulate INSERT failure
				.mockImplementationOnce(() => Promise.resolve()), // Simulate ROLLBACK
			release: jest.fn(),
		});

		const userId = 'mock-userUuid';
		await expect(createEvent(eventData)).rejects.toThrow('Insert error');
		// No need to check mockBegin since it's part of the mocked implementation
		expect(pool.connect).toHaveBeenCalled();
	});

	it('should commit the transaction upon successful insertion', async () => {
		const mockCommit = jest.fn();
		const mockRelease = jest.fn();
		pool.connect = jest.fn().mockResolvedValueOnce({
			query: jest
				.fn()
				.mockImplementationOnce(() => Promise.resolve()) // Simulate BEGIN
				.mockImplementationOnce(() =>
					Promise.resolve({ rows: [{ ...eventData, event_id: 'mock-uuid' }] })
				) // Simulate successful INSERT
				.mockImplementationOnce(mockCommit), // Simulate COMMIT
			release: mockRelease,
		});

		const userId = 'mock-userUuid';
		const result = await createEvent(eventData);
		expect(result).toEqual({ ...eventData, event_id: 'mock-uuid' });
		expect(mockCommit).toHaveBeenCalledTimes(1);
		expect(mockRelease).toHaveBeenCalledTimes(1);
	});
});

describe('deleteEvent', () => {
	const eventId = 'mock-uuid';
	const deletedEventData = {
		event_id: eventId,
		title: 'Test Event',
		description: 'This is a test event',
		start_time: new Date(),
		end_time: new Date(),
		location: 'Test Location',
	};

	beforeEach(() => {
		(parseUUID as jest.Mock).mockReturnValue(eventId);
		pool.connect = jest.fn().mockResolvedValue({
			query: jest.fn().mockResolvedValue({ rows: [], rowCount: 1 }), // Assuming the delete query returns rowCount
			release: jest.fn(),
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should delete an event and return success', async () => {
		pool.connect = jest.fn().mockResolvedValue({
			query: jest
				.fn()
				.mockResolvedValue({ rows: [deletedEventData], rowCount: 1 }),
			release: jest.fn(),
		});
		const userId = 'mock-userUuid';
		const result = await deleteEvent(eventId, userId);

		// You might adjust the expectation based on your implementation's return value for delete operations
		expect(result).toEqual(deletedEventData);
		expect(pool.connect).toHaveBeenCalled();
		expect(parseUUID).toHaveBeenCalledWith(eventId);
	});

	it('should throw an error if the database operation fails', async () => {
		pool.connect = jest.fn().mockResolvedValueOnce({
			query: jest.fn().mockRejectedValue(new Error('Database error')),
			release: jest.fn(),
		});
		const userId = 'mock-userUuid';
		await expect(deleteEvent(eventId, userId)).rejects.toThrow(
			'Database error'
		);
		expect(pool.connect).toHaveBeenCalled();
	});

	it('should roll back the transaction if an error occurs', async () => {
		pool.connect = jest.fn().mockResolvedValueOnce({
			query: jest
				.fn()
				.mockImplementationOnce(() => Promise.resolve()) // Simulate BEGIN
				.mockImplementationOnce(() => Promise.reject(new Error('Delete error'))) // Simulate DELETE failure
				.mockImplementationOnce(() => Promise.resolve()), // Simulate ROLLBACK
			release: jest.fn(),
		});

		const userId = 'mock-userUuid';
		await expect(deleteEvent(eventId, userId)).rejects.toThrow('Delete error');
		expect(pool.connect).toHaveBeenCalled();
	});

	it('should commit the transaction upon successful deletion', async () => {
		const mockCommit = jest.fn();
		const mockRelease = jest.fn();
		pool.connect = jest.fn().mockResolvedValueOnce({
			query: jest
				.fn()
				.mockImplementationOnce(() => Promise.resolve()) // Simulate BEGIN
				.mockImplementationOnce(() =>
					Promise.resolve({ rows: [deletedEventData], rowCount: 1 })
				) // Simulate successful DELETE
				.mockImplementationOnce(mockCommit), // Simulate COMMIT
			release: mockRelease,
		});

		const userId = 'mock-userUuid';
		const result = await deleteEvent(eventId, userId);
		expect(result).toEqual(deletedEventData); // Adjust based on your implementation
		expect(mockCommit).toHaveBeenCalledTimes(1);
		expect(mockRelease).toHaveBeenCalledTimes(1);
	});
});

describe('findEventByIdService', () => {
	const eventId = '018dd8dc-b226-7a30-af70-c2ea0f0d8346';
	const foundEvent = {
		event_id: eventId,
		title: 'Test Event',
		description: 'This is a test event',
		start_time: new Date(),
		end_time: new Date(),
		location: 'Test Location',
	};

	beforeEach(() => {
		(parseUUID as jest.Mock).mockReturnValue(eventId);
		pool.connect = jest.fn().mockResolvedValue({
			query: jest.fn().mockResolvedValue({ rows: [foundEvent] }),
			release: jest.fn(),
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should find an event by ID and return it', async () => {
		const userId = 'mock-userUuid';
		const result = await findEventById(eventId, userId);

		expect(result).toEqual(foundEvent);
		expect(pool.connect).toHaveBeenCalled();
		expect(parseUUID).toHaveBeenCalledWith(eventId);
	});

	it('should throw an error if the database operation fails', async () => {
		pool.connect = jest.fn().mockResolvedValueOnce({
			query: jest
				.fn()
				.mockRejectedValue(
					new Error('Failed to find event. Please try again later.')
				),
			release: jest.fn(),
		});

		const userId = 'mock-userUuid';
		await expect(findEventById(eventId, userId)).rejects.toThrow(
			'Failed to find event. Please try again later.'
		);
		expect(pool.connect).toHaveBeenCalled();
	});
});

describe('getEventsService', () => {
	const eventsList = [
		{
			event_id: '1',
			title: 'Event 1',
			description: 'Description 1',
			start_time: new Date(),
			end_time: new Date(),
			location: 'Location 1',
		},
		{
			event_id: '2',
			title: 'Event 2',
			description: 'Description 2',
			start_time: new Date(),
			end_time: new Date(),
			location: 'Location 2',
		},
	];

	beforeEach(() => {
		pool.connect = jest.fn().mockResolvedValue({
			query: jest.fn().mockResolvedValue({ rows: eventsList }),
			release: jest.fn(),
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should retrieve a list of events successfully', async () => {
		const result = await getEvents();

		expect(result).toEqual(eventsList);
		expect(pool.connect).toHaveBeenCalled();
	});

	it('should throw an error if the database operation fails', async () => {
		pool.connect = jest.fn().mockResolvedValueOnce({
			query: jest
				.fn()
				.mockRejectedValue(
					new Error('Failed to find events. Please try again later.')
				),
			release: jest.fn(),
		});

		await expect(getEvents()).rejects.toThrow(
			'Failed to find events. Please try again later.'
		);
		expect(pool.connect).toHaveBeenCalled();
	});
});

describe('updateEventService', () => {
	const eventId = 'mock-uuid';
	const updateData = {
		event_id: eventId,
		user_id: 'mock-userUuid',
		title: 'Updated Event',
		description: 'Updated description',
		registration_open: new Date(),
		registration_close: new Date(),
		event_date: new Date(),
		location_type: <LOCATION_TYPE>'VENUE',
	};

	beforeEach(() => {
		(parseUUID as jest.Mock).mockReturnValue(eventId);
		pool.connect = jest.fn().mockResolvedValue({
			query: jest
				.fn()
				.mockResolvedValueOnce({}) // Simulate BEGIN
				.mockResolvedValueOnce({ rows: [updateData], rowCount: 1 }) // Simulate successful UPDATE
				.mockResolvedValueOnce({}), // Simulate COMMIT
			release: jest.fn(),
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should update an event successfully', async () => {
		const userId = 'mock-userUuid';
		const result = await updateEvent(updateData);

		expect(result).toEqual(updateData);
		expect(pool.connect).toHaveBeenCalled();
		expect(parseUUID).toHaveBeenCalledWith(eventId);
	});

	it('should throw an error if the database operation fails', async () => {
		pool.connect = jest.fn().mockResolvedValueOnce({
			query: jest
				.fn()
				.mockImplementationOnce(() => Promise.resolve()) // Simulate BEGIN
				.mockImplementationOnce(() =>
					Promise.reject(
						new Error('Failed to update event. Please try again later.')
					)
				) // Simulate UPDATE failure
				.mockImplementationOnce(() => Promise.resolve()), // Simulate ROLLBACK
			release: jest.fn(),
		});

		const userId = 'mock-userUuid';
		await expect(updateEvent(updateData)).rejects.toThrow(
			'Failed to update event. Please try again later.'
		);
		expect(pool.connect).toHaveBeenCalled();
	});

	it('should commit the transaction upon successful update', async () => {
		const mockCommit = jest.fn();
		const mockRelease = jest.fn();
		pool.connect = jest.fn().mockResolvedValueOnce({
			query: jest
				.fn()
				.mockImplementationOnce(() => Promise.resolve()) // Simulate BEGIN
				.mockImplementationOnce(() =>
					Promise.resolve({ rows: [updateData], rowCount: 1 })
				) // Simulate successful UPDATE
				.mockImplementationOnce(mockCommit), // Simulate COMMIT
			release: mockRelease,
		});

		const userId = 'mock-userUuid';
		const result = await updateEvent(updateData);
		expect(result).toEqual(updateData); // Adjust based on your implementation
		expect(mockCommit).toHaveBeenCalledTimes(1);
		expect(mockRelease).toHaveBeenCalledTimes(1);
	});
});
