import * as eventAddressRepo from '../../../repositories/event-address.repository';
import { createEventAddressService, deleteEventAddressService, findEventAddressByEventIdService, findEventAddressesService, updateEventAddressService } from '../../../services/event-address.service';

jest.mock('../../../repositories/event-address.repository');

describe('Event Address Service', () => {
    const event_id = "mock-eventUuid-1";

    const mockEventAddressEntity = {
        address_id: 'mock-uuid',
        event_id: event_id,
        street: '1 Sydney St',
        city_suburb: 'Sydney',
        state: 'NSW',
        country: 'Australia',
        postal_code: '2000'
    }

    const mockRequestEventAddress = {
        address_id: 'mock-uuid',
        street: '1 Sydney St',
        city_suburb: 'Sydney',
        state: 'NSW',
        country: 'Australia',
        postal_code: '2000'
    }

    const mockResponseEventAddress = {
        address_id: 'mock-uuid',
        street: '1 Sydney St',
        city_suburb: 'Sydney',
        state: 'NSW',
        country: 'Australia',
        postal_code: '2000'
    }

    const mockResponseEventAddressUpdated = {
        address_id: 'mock-uuid',
        street: '1 Melbourne St',
        city_suburb: 'Melbourne',
        state: 'VIC',
        country: 'Australia',
        postal_code: '3000'
    }

    const mockRequestEventAddresses = [
        {
            address_id: 'mock-uuid-1',
            street: '1 Sydney St',
            city_suburb: 'Sydney',
            state: 'NSW',
            country: 'Australia',
            postal_code: '2000'
        },
        {
            address_id: 'mock-uuid-2',
            street: '1 Brisbane St',
            city_suburb: 'Brisbane',
            state: 'QLD',
            country: 'Australia',
            postal_code: '4000'
        }
    ];

    afterEach(() => {
		jest.clearAllMocks();
	});

    describe('createEventAddressService', () => {
        it('should create an event address successfully', async () => {
            (eventAddressRepo.createEventAddress as jest.Mock).mockResolvedValue(mockEventAddressEntity);
            
            const result = await createEventAddressService(event_id, mockRequestEventAddress);
            
            expect(result).toEqual(mockRequestEventAddress);
            expect(eventAddressRepo.createEventAddress).toHaveBeenCalledWith(mockEventAddressEntity);
        });

        it('should log an error and throw a custom error when creation fails', async () => {
            const error = new Error('Error creating event address');
            (eventAddressRepo.createEventAddress as jest.Mock).mockRejectedValue(error);

            await expect(createEventAddressService(event_id, mockRequestEventAddress)).rejects.toThrow(
                'Failed to create event address. Please try again later.'
            )
        });
    });

    describe('findEventAddressByIdService', () => {

        it('should find an event address by ID successfully', async () => {
            (eventAddressRepo.findEventAddressByEventId as jest.Mock).mockResolvedValue(mockResponseEventAddress);

            const result = await findEventAddressByEventIdService(event_id);

            expect(result).toEqual(mockResponseEventAddress);
            expect(eventAddressRepo.findEventAddressByEventId).toHaveBeenCalledWith(event_id);
        });

        it('should log an error and throw a custom error when finding an event address by ID fails', async () => {
            const error = new Error('Error finding event address');
            (eventAddressRepo.findEventAddressByEventId as jest.Mock).mockRejectedValue(error);

            await expect(findEventAddressByEventIdService(event_id)).rejects.toThrow(
                'Failed to find event address. Please try again later.'
            )
        })
    });

    describe('findEventAddressesService', () => {
        
        it('should retrieve all events address successfully', async () => {
            (eventAddressRepo.getEventsAddresses as jest.Mock).mockResolvedValue(mockRequestEventAddresses);

            const result = await findEventAddressesService(event_id);

            expect(result).toEqual(mockRequestEventAddresses)
            expect(eventAddressRepo.getEventsAddresses).toHaveBeenCalled();
        });

        it('should log an error and throw a custom error when retrieving all events address fails', async () => {
            const error = new Error('Error finding event addresses');
            (eventAddressRepo.getEventsAddresses as jest.Mock).mockRejectedValue(error);

            await expect(findEventAddressesService(event_id)).rejects.toThrow(
                'Failed to find event addresses. Please try again later.'
            );
        }
        );
    });

    describe('updateEventAddressService', () => {
        const mockRequestEventAddressWithId = {...mockRequestEventAddress, event_id: event_id}

        it('should update an event address successfully', async () => {
            (eventAddressRepo.updateEventAddress as jest.Mock).mockResolvedValue(mockResponseEventAddressUpdated);

            const result = await updateEventAddressService('mock-uuid', event_id, mockRequestEventAddress);

            expect(result).toEqual(mockResponseEventAddressUpdated);
            expect(eventAddressRepo.updateEventAddress).toHaveBeenCalledWith('mock-uuid', event_id, mockRequestEventAddressWithId);
        });


        it('should log an error and throw a custom error when updating event address fails', async () => {
            const error = new Error('Error could not update event address');
            (eventAddressRepo.updateEventAddress as jest.Mock).mockRejectedValue(error);

            await expect(updateEventAddressService('mock-uuid', event_id, mockRequestEventAddressWithId)).rejects.toThrow(
                'Failed to update event. Please try again later.'
            );
        });
    

    });

    describe('deleteEventAddressService', () => {
        it('should delete an event address successfully', async () => {
            (eventAddressRepo.deleteEventAddress as jest.Mock).mockResolvedValue(undefined); // Assuming deleteEvent returns nothing on success

            await deleteEventAddressService('mock-uuid', event_id);

            expect(eventAddressRepo.deleteEventAddress).toHaveBeenCalledWith('mock-uuid', event_id);
        });

        it('should log an error and throw a custom error when deleting event address fails', async () => {
            const error = new Error('Error could not delete event address');
            (eventAddressRepo.deleteEventAddress as jest.Mock).mockRejectedValue(error);

            await expect(deleteEventAddressService('mock-uuid', event_id)).rejects.toThrow(
                'Failed to delete event address. Please try again later.'
            )
        });
    });

});