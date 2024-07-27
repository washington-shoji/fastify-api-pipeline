import {
	EventAddressEntityModel,
	EventAddressModelRequest,
	EventAddressModelResponse,
} from '../models/event-address-model';
import {
	createEventAddress,
	deleteEventAddress,
	findEventAddressByEventId,
	findEventAddressById,
	getEventsAddresses,
	updateEventAddress,
} from '../repositories/event-address.repository';
import logger from '../utils/logger.utils';

export async function createEventAddressService(
	eventId: string,
	addressData: EventAddressModelRequest
): Promise<EventAddressModelResponse> {
	try {
		const eventAddressEntity: EventAddressEntityModel = {
			...addressData,
			event_id: eventId,
		};

		const result: EventAddressEntityModel = await createEventAddress(
			eventAddressEntity
		);

		return responseDataTransformer(result);
	} catch (error) {
		logger.error(error, 'Error creating event address');
		throw new Error('Failed to create event address. Please try again later.');
	}
}

export async function findEventAddressByIdService(
	id: string,
	eventId: string
): Promise<EventAddressModelResponse> {
	try {
		const result: EventAddressEntityModel = await findEventAddressById(
			id,
			eventId
		);

		return responseDataTransformer(result);
	} catch (error) {
		logger.error(error, 'Error finding event address');
		throw new Error('Failed to find event address. Please try again later.');
	}
}

export async function findEventAddressByEventIdService(
	eventId: string
): Promise<EventAddressModelResponse> {
	try {
		const result: EventAddressEntityModel = await findEventAddressByEventId(
			eventId
		);

		return responseDataTransformer(result);
	} catch (error) {
		logger.error(error, 'Error finding event address');
		throw new Error('Failed to find event address. Please try again later.');
	}
}

export async function findEventAddressesService(
	eventId: string
): Promise<EventAddressModelResponse[]> {
	try {
		const result: EventAddressEntityModel[] = await getEventsAddresses(eventId);

		return responseDataTransformerArray(result);
	} catch (error) {
		logger.error(error, 'Error finding event addresses');
		throw new Error('Failed to find event addresses. Please try again later.');
	}
}

export async function updateEventAddressService(
	id: string,
	eventId: string,
	addressData: EventAddressModelRequest
): Promise<EventAddressModelResponse> {
	try {
		const eventAddressEntity: EventAddressEntityModel = {
			...addressData,
			event_id: eventId,
		};
		const result: EventAddressEntityModel = await updateEventAddress(
			id,
			eventId,
			eventAddressEntity
		);

		return responseDataTransformer(result);
	} catch (error) {
		logger.error(error, 'Error could not update event address');
		throw new Error('Failed to update event. Please try again later.');
	}
}

export async function deleteEventAddressService(
	id: string,
	eventId: string
): Promise<string> {
	try {
		await deleteEventAddress(id, eventId);
		return 'Deleted successfully';
	} catch (error) {
		logger.error(error, 'Error could not delete event address');
		throw new Error('Failed to delete event address. Please try again later.');
	}
}

function responseDataTransformer(
	input: EventAddressEntityModel
): EventAddressModelResponse {
	return <EventAddressModelResponse>{
		address_id: input?.address_id ?? null,
		street: input?.street ?? null,
		city_suburb: input?.city_suburb ?? null,
		state: input?.state ?? null,
		country: input?.country ?? null,
		postal_code: input?.postal_code ?? null,
	};
}

function responseDataTransformerArray(
	inputItems: EventAddressEntityModel[]
): EventAddressModelResponse[] {
	return inputItems.map(
		(input) =>
			<EventAddressModelResponse>{
				address_id: input.address_id,
				street: input.street,
				city_suburb: input.city_suburb,
				state: input.state,
				country: input.country,
				postal_code: input.postal_code,
			}
	);
}
