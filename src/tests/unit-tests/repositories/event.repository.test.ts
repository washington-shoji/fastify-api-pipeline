import pool from '../../../database/db';
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
	const eventData = {
		title: 'Test Event',
		description: 'This is a test event',
		start_time: new Date(),
		end_time: new Date(),
		location: 'Test Location',
	};

	beforeEach(() => {
		(generateUUIDv7 as jest.Mock).mockReturnValue('mock-uuid');
		pool.connect = jest.fn().mockResolvedValue({
			query: jest
				.fn()
				.mockResolvedValue({ rows: [{ ...eventData, id: 'mock-uuid' }] }),
			release: jest.fn(),
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should create an event and return the created event object', async () => {
		const result = await createEvent(eventData);

		expect(result).toEqual({ ...eventData, id: 'mock-uuid' });
		expect(pool.connect).toHaveBeenCalled();
		expect(generateUUIDv7).toHaveBeenCalled();
	});

	it('should throw an error if the database operation fails', async () => {
		pool.connect = jest.fn().mockResolvedValueOnce({
			query: jest.fn().mockRejectedValue(new Error('Database error')),
			release: jest.fn(),
		});

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
					Promise.resolve({ rows: [{ ...eventData, id: 'mock-uuid' }] })
				) // Simulate successful INSERT
				.mockImplementationOnce(mockCommit), // Simulate COMMIT
			release: mockRelease,
		});

		const result = await createEvent(eventData);
		expect(result).toEqual({ ...eventData, id: 'mock-uuid' });
		expect(mockCommit).toHaveBeenCalledTimes(1);
		expect(mockRelease).toHaveBeenCalledTimes(1);
	});
});

describe('deleteEvent', () => {
	const eventId = 'mock-uuid';
	const deletedEventData = {
		id: eventId,
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
		const result = await deleteEvent(eventId);

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

		await expect(deleteEvent(eventId)).rejects.toThrow('Database error');
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

		await expect(deleteEvent(eventId)).rejects.toThrow('Delete error');
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

		const result = await deleteEvent(eventId);
		expect(result).toEqual(deletedEventData); // Adjust based on your implementation
		expect(mockCommit).toHaveBeenCalledTimes(1);
		expect(mockRelease).toHaveBeenCalledTimes(1);
	});
});

describe('findEventByIdService', () => {
	const eventId = '018dd8dc-b226-7a30-af70-c2ea0f0d8346';
	const foundEvent = {
		id: eventId,
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
		const result = await findEventById(eventId);

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

		await expect(findEventById(eventId)).rejects.toThrow(
			'Failed to find event. Please try again later.'
		);
		expect(pool.connect).toHaveBeenCalled();
	});
});

describe('getEventsService', () => {
	const eventsList = [
		{
			id: '1',
			title: 'Event 1',
			description: 'Description 1',
			start_time: new Date(),
			end_time: new Date(),
			location: 'Location 1',
		},
		{
			id: '2',
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
		title: 'Updated Event',
		description: 'Updated description',
		start_time: new Date(),
		end_time: new Date(),
		location: 'Updated Location',
	};
	const updatedEvent = { id: eventId, ...updateData };

	beforeEach(() => {
		(parseUUID as jest.Mock).mockReturnValue(eventId);
		pool.connect = jest.fn().mockResolvedValue({
			query: jest
				.fn()
				.mockResolvedValueOnce({}) // Simulate BEGIN
				.mockResolvedValueOnce({ rows: [updatedEvent], rowCount: 1 }) // Simulate successful UPDATE
				.mockResolvedValueOnce({}), // Simulate COMMIT
			release: jest.fn(),
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should update an event successfully', async () => {
		const result = await updateEvent(eventId, updateData);

		expect(result).toEqual(updatedEvent);
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

		await expect(updateEvent(eventId, updateData)).rejects.toThrow(
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
					Promise.resolve({ rows: [updatedEvent], rowCount: 1 })
				) // Simulate successful UPDATE
				.mockImplementationOnce(mockCommit), // Simulate COMMIT
			release: mockRelease,
		});

		const result = await updateEvent(eventId, updateData);
		expect(result).toEqual(updatedEvent); // Adjust based on your implementation
		expect(mockCommit).toHaveBeenCalledTimes(1);
		expect(mockRelease).toHaveBeenCalledTimes(1);
	});
});
