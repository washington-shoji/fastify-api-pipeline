
import pool from '../../../database/db';
import { createEventAddress, deleteEventAddress, findEventAddressByEventId, findEventAddressById, getEventsAddresses, updateEventAddress } from '../../../repositories/event-address.repository';
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

describe('Event Address Repository', () => {

    describe('createEventAddress', () => {
        const event_id = "mock-eventUuid";
        const userId = 'mock-userUuid';
    
        const eventAddressData = {
            event_id: event_id,
            street: '1 Sydney St',
            city_suburb: 'Sydney',
            state: 'NSW',
            country: 'Australia',
            postal_code: '2000'
        }
    
        beforeEach( () => {
            (generateUUIDv7 as jest.Mock).mockReturnValue('mock-uuid');
            pool.connect = jest.fn().mockResolvedValue({
                query: jest
                    .fn()
                    .mockResolvedValue({ rows: [{ ...eventAddressData, event_id: event_id }] }),
                release: jest.fn(),
            });
        });
    
        afterEach(() => {
            jest.clearAllMocks();
        });
    
        it('should create an event address and return the created event address object', async () => {
            const result = await createEventAddress(eventAddressData);
            
            expect(result).toEqual({...eventAddressData, event_id: event_id});
            expect(pool.connect).toHaveBeenCalled();
            expect(generateUUIDv7).toHaveBeenCalled();
        });
    
        it('should throw an error if the database operation created event address fails', async () => {
            pool.connect = jest.fn().mockResolvedValueOnce({
                query: jest.fn().mockRejectedValue(new Error('Database error')),
                release: jest.fn(),
            });
    
            await expect(createEventAddress(eventAddressData)).rejects.toThrow('Database error');
            expect(pool.connect).toHaveBeenCalled();
        });
    
        it('should roll back the transaction created event address if an error occurs', async () => {
            pool.connect = jest.fn().mockResolvedValueOnce({
                query: jest
                    .fn()
                    .mockImplementationOnce(() => Promise.resolve()) // Simulate BEGIN
                    .mockImplementationOnce(() => Promise.reject(new Error('Insert error'))) // Simulate INSERT failure
                    .mockImplementationOnce(() => Promise.resolve()), // Simulate ROLLBACK
                release: jest.fn(),
            });
    
            await expect(createEventAddress(eventAddressData)).rejects.toThrow('Insert error');
            expect(pool.connect).toHaveBeenCalled();
        });
    
        it('should commit the transaction created event address upon successful insertion', async () => {
            const mockCommit = jest.fn();
            const mockRelease = jest.fn();
            pool.connect = jest.fn().mockResolvedValueOnce({
                query: jest
                    .fn()
                    .mockImplementationOnce(() => Promise.resolve()) // Simulate BEGIN
                    .mockImplementationOnce(() =>
                        Promise.resolve({ rows: [{ ...eventAddressData, event_id: event_id }] })
                    ) // Simulate successful INSERT
                    .mockImplementationOnce(mockCommit), // Simulate COMMIT
                release: mockRelease,
            });
    
            const result = await createEventAddress(eventAddressData);
    
            expect(result).toEqual({...eventAddressData, event_id: event_id});
            expect(mockCommit).toHaveBeenCalledTimes(1);
            expect(mockRelease).toHaveBeenCalledTimes(1);
        });
    });
    
    
    describe('deleteEventAddress', () => {
        const address_id = 'mock-addressUuid'
        const event_id = 'mock-eventUuid';
        const deleteEventAddressData = {
            event_id: event_id,
            street: '1 Sydney St',
            city_suburb: 'Sydney',
            state: 'NSW',
            country: 'Australia',
            postal_code: '2000'
        }
    
        beforeEach(() => {
            (parseUUID as jest.Mock).mockReturnValue(event_id);
            pool.connect = jest.fn().mockResolvedValue({
                query: jest.fn().mockResolvedValue({ rows: [], rowCount: 1 }), // Assuming the delete query returns rowCount
                release: jest.fn(),
            });
        });
    
        afterEach(() => {
            jest.clearAllMocks();
        });
    
        it('should delete an event address and return success', async () => {
            pool.connect = jest.fn().mockResolvedValue({
                query: jest
                    .fn()
                    .mockResolvedValue({ rows: [deleteEventAddressData], rowCount: 1 }),
                release: jest.fn(),
            });
    
            const result = await deleteEventAddress(address_id, event_id);
            expect(result).toEqual(deleteEventAddressData);
            expect(pool.connect).toHaveBeenCalled();
            expect(parseUUID).toHaveBeenCalledWith(event_id);
        });
    
        it('should throw an error if the database operation delete event address fails', async () => {
            pool.connect = jest.fn().mockResolvedValueOnce({
                query: jest.fn().mockRejectedValue(new Error('Database error')),
                release: jest.fn(),
            });
    
            await expect(deleteEventAddress(address_id, event_id)).rejects.toThrow('Database error');
            expect(pool.connect).toHaveBeenCalled();
        });
    
        it('should roll back the transaction delete event address if an error occurs', async () => {
            pool.connect = jest.fn().mockResolvedValueOnce({
                query: jest
                    .fn()
                    .mockImplementationOnce(() => Promise.resolve()) // Simulate BEGIN
                    .mockImplementationOnce(() => Promise.reject(new Error('Database error'))) // Simulate DELETE failure
                    .mockImplementationOnce(() => Promise.resolve()), // Simulate ROLLBACK
                release: jest.fn(),
            });
    
            await expect(deleteEventAddress(address_id, event_id)).rejects.toThrow('Database error');
            expect(pool.connect).toHaveBeenCalled();
        });
    
    
        it('should commit the transaction upon successful event address deletion', async () => {
            const mockCommit = jest.fn();
            const mockRelease = jest.fn();
            pool.connect = jest.fn().mockResolvedValueOnce({
                query: jest
                    .fn()
                    .mockImplementationOnce(() => Promise.resolve()) // Simulate BEGIN
                    .mockImplementationOnce(() =>
                        Promise.resolve({ rows: [deleteEventAddressData], rowCount: 1 })
                    ) // Simulate successful DELETE
                    .mockImplementationOnce(mockCommit), // Simulate COMMIT
                release: mockRelease,
            });
    
            const result = await deleteEventAddress(address_id, event_id);
            expect(result).toEqual(deleteEventAddressData);
            expect(mockCommit).toHaveBeenCalledTimes(1);
            expect(mockRelease).toHaveBeenCalledTimes(1);
        });
    });
    
    describe('findEventAddressById', () => {
        const address_id = 'mock-addressUuid'
        const event_id = 'mock-eventUuid';
        const foundEventAddress = {
            event_id: event_id,
            street: '1 Sydney St',
            city_suburb: 'Sydney',
            state: 'NSW',
            country: 'Australia',
            postal_code: '2000'
        }
    
    
        beforeEach(() => {
            (parseUUID as jest.Mock).mockReturnValue(address_id);
            pool.connect = jest.fn().mockResolvedValue({
                query: jest.fn().mockResolvedValue({ rows: [foundEventAddress] }),
                release: jest.fn(),
            });
        });
    
        afterEach(() => {
            jest.clearAllMocks();
        });
    
        it('should find an event adress by ID and return it', async () => {
            const result = await findEventAddressById(address_id, event_id);
    
            expect(result).toEqual(foundEventAddress);
            expect(pool.connect).toHaveBeenCalledTimes(1);
            expect(parseUUID).toHaveBeenCalledWith(address_id);
        });
    
        it('should throw an error if the database find event address operation fails', async () => {
            pool.connect = jest.fn().mockResolvedValueOnce({
                query: jest
                    .fn()
                    .mockRejectedValue(
                        new Error('Failed to find event addres. Please try again later.')
                    ),
                release: jest.fn(),
            });
    
            await expect(findEventAddressById(address_id, event_id)).rejects.toThrow(
                'Failed to find event addres. Please try again later.'
            );
            expect(pool.connect).toHaveBeenCalled();
        });
    });
    
    describe('findEventAddressByEventId', () => {
        const event_id = 'mock-eventUuid';
        const foundEventAddress = {
            event_id: event_id,
            street: '1 Sydney St',
            city_suburb: 'Sydney',
            state: 'NSW',
            country: 'Australia',
            postal_code: '2000'
        }
    
        beforeEach(() => {
            (parseUUID as jest.Mock).mockReturnValue(event_id);
            pool.connect = jest.fn().mockResolvedValue({
                query: jest.fn().mockResolvedValue({ rows: [foundEventAddress] }),
                release: jest.fn(),
            });
        });
    
        afterEach(() => {
            jest.clearAllMocks();
        });
    
        it('should find an event adress by event ID and return it', async () => {
            const result = await findEventAddressByEventId(event_id);
    
            expect(result).toEqual(foundEventAddress);
            expect(pool.connect).toHaveBeenCalledTimes(1);
            expect(parseUUID).toHaveBeenCalledWith(event_id);
        });
    
    
        it('should throw an error if the database find event address by event ID operation fails', async () => {
            pool.connect = jest.fn().mockResolvedValueOnce({
                query: jest
                    .fn()
                    .mockRejectedValue(
                        new Error('Failed to find event addres. Please try again later.')
                    ),
                release: jest.fn(),
            });
    
            await expect(findEventAddressByEventId(event_id)).rejects.toThrow(
                'Failed to find event addres. Please try again later.'
            );
            expect(pool.connect).toHaveBeenCalled();
        });
    });

    describe('getEventsAddresses', () => {
        const event_id = 'mock-eventUuid';
        const foundEventAddressList =[
            {
                event_id: event_id,
                street: '1 Sydney St',
                city_suburb: 'Sydney',
                state: 'NSW',
                country: 'Australia',
                postal_code: '2000'
            },
            {
                event_id: event_id,
                street: '1 Brisbane St',
                city_suburb: 'Brisbane',
                state: 'QLD',
                country: 'Australia',
                postal_code: '4000'
            }
        ] 
    
        beforeEach(() => {
            (parseUUID as jest.Mock).mockReturnValue(event_id);
            pool.connect = jest.fn().mockResolvedValue({
                query: jest.fn().mockResolvedValue({ rows: foundEventAddressList }),
                release: jest.fn(),
            });
        });
    
        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should retrieve a list of event addresses successfully', async () => {
            const result = await getEventsAddresses(event_id);
            expect(result).toEqual(foundEventAddressList);
            expect(pool.connect).toHaveBeenCalled();
        });

        it('should throw an error if the database event address operation fails', async () => {
            pool.connect = jest.fn().mockResolvedValueOnce({
                query: jest
                    .fn()
                    .mockRejectedValue(
                        new Error('Failed to find event addresses. Please try again later.')
                    ),
                release: jest.fn(),
            });
    
            await expect(getEventsAddresses(event_id)).rejects.toThrow(
                'Failed to find event addresses. Please try again later.'
            );
            expect(pool.connect).toHaveBeenCalled();
        });
    });
    
    describe('updateEventAddress', () => {
        const address_id = 'mock-addressUuid'
        const event_id = 'mock-eventUuid';
        const eventAddressUpdatedData = {
            event_id: event_id,
            street: '1 Melbourne St',
            city_suburb: 'Melbourne',
            state: 'VIC',
            country: 'Australia',
            postal_code: '3000'
        }
    
        beforeEach(() => {
            (parseUUID as jest.Mock).mockReturnValue(event_id);
            pool.connect = jest.fn().mockResolvedValue({
                query: jest
                    .fn()
                    .mockResolvedValueOnce({}) // Simulate BEGIN
                    .mockResolvedValueOnce({ rows: [eventAddressUpdatedData], rowCount: 1 }) // Simulate successful UPDATE
                    .mockResolvedValueOnce({}), // Simulate COMMIT
                release: jest.fn(),
            });
        });
    
        afterEach(() => {
            jest.clearAllMocks();
        });
    
        it('should update an event address successfully', async () => {
            const result = await updateEventAddress(address_id, event_id, eventAddressUpdatedData);
    
            expect(result).toEqual(eventAddressUpdatedData);
            expect(pool.connect).toHaveBeenCalled();
            expect(parseUUID).toHaveBeenCalledWith(event_id);
        });
    
        it('should throw an error if the database event address operation fails', async () => {
            pool.connect = jest.fn().mockResolvedValueOnce({
                query: jest
                    .fn()
                    .mockImplementationOnce(() => Promise.resolve()) // Simulate BEGIN
                    .mockImplementationOnce(() =>
                        Promise.reject(
                            new Error('Failed to update event address. Please try again later.')
                        )
                    ) // Simulate UPDATE failure
                    .mockImplementationOnce(() => Promise.resolve()), // Simulate ROLLBACK
                release: jest.fn(),
            });
    
            await expect(updateEventAddress(address_id, event_id, eventAddressUpdatedData)).rejects.toThrow(
                'Failed to update event address. Please try again later.'
            );
            expect(pool.connect).toHaveBeenCalled();
        });
    
        it('should commit the transaction event address upon successful update', async () => {
            const mockCommit = jest.fn();
            const mockRelease = jest.fn();
            pool.connect = jest.fn().mockResolvedValueOnce({
                query: jest
                    .fn()
                    .mockImplementationOnce(() => Promise.resolve()) // Simulate BEGIN
                    .mockImplementationOnce(() =>
                        Promise.resolve({ rows: [eventAddressUpdatedData], rowCount: 1 })
                    ) // Simulate successful UPDATE
                    .mockImplementationOnce(mockCommit), // Simulate COMMIT
                release: mockRelease,
            });
    
            const result = await updateEventAddress(address_id, event_id, eventAddressUpdatedData);
            expect(result).toEqual(eventAddressUpdatedData);
            expect(mockCommit).toHaveBeenCalledTimes(1);
            expect(mockRelease).toHaveBeenCalledTimes(1);
        });
    });

});


