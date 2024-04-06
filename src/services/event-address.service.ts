import { EventAddressModel } from '../models/event-address-model';
import {
	createEventAddress,
	deleteEventAddress,
	findEventAddressById,
	getEventsAddresses,
	updateEventAddress,
} from '../repositories/event-address.repository';
import logger from '../utils/logger.utils';

export async function createEventAddressService(
	addressData: EventAddressModel
) {
	try {
		return await createEventAddress(addressData);
	} catch (error) {
		logger.error(error, 'Error creating event address');
		throw new Error('Failed to create event address. Please try again later.');
	}
}

export async function findEventAddressByIdService(id: string) {
	try {
		return await findEventAddressById(id);
	} catch (error) {
		logger.error(error, 'Error finding event address');
		throw new Error('Failed to find event address. Please try again later.');
	}
}

export async function findEventAddressesService() {
	try {
		return await getEventsAddresses();
	} catch (error) {
		logger.error(error, 'Error finding event addresses');
		throw new Error('Failed to find event addresses. Please try again later.');
	}
}

export async function updateEventAddressService(
	id: string,
	addressData: EventAddressModel
) {
	try {
		return await updateEventAddress(id, addressData);
	} catch (error) {
		logger.error(error, 'Error could not update event address');
		throw new Error('Failed to update event. Please try again later.');
	}
}

export async function deleteEventAddressService(id: string) {
	try {
		return await deleteEventAddress(id);
	} catch (error) {
		logger.error(error, 'Error could not delete event address');
		throw new Error('Failed to delete event address. Please try again later.');
	}
}
