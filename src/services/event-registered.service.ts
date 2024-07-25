import {
	RegisteredEventModel,
	RegisteredEventResponseModel,
} from '../models/event-registered.model';
import { findAllRegisteredEventsByUser } from '../repositories/event-registered.repository';
import logger from '../utils/logger.utils';

export async function getAllRegisteredEvents(
	userId: string
): Promise<RegisteredEventResponseModel[]> {
	try {
		const result = await findAllRegisteredEventsByUser(userId);

		return responseDataTransformerArray(result);
	} catch (error) {
		// Log the error for debugging purposes
		logger.error(error, 'Error could not find registered events');

		throw new Error(
			'Failed to find registered events. Please try again later.'
		);
	}
}

function responseDataTransformer(
	input: RegisteredEventModel
): RegisteredEventResponseModel {
	return <RegisteredEventResponseModel>{
		attendee: {
			attendee_name: input?.attendee_name ?? null,
			status: input?.status ?? null,
		},
		event: {
			id: input?.id ?? null,
			title: input?.title ?? null,
			description: input?.description ?? null,
			start_time: input?.start_time ?? null,
			end_time: input?.end_time ?? null,
			location: input?.location ?? null,
		},
		address: {
			street: input?.street ?? null,
			city_suburb: input?.city_suburb ?? null,
			state: input?.state ?? null,
			country: input?.country ?? null,
			postal_code: input?.postal_code ?? null,
		},
	};
}

function responseDataTransformerArray(
	inputItems: RegisteredEventModel[]
): RegisteredEventResponseModel[] {
	return inputItems.map(
		(input) =>
			<RegisteredEventResponseModel>{
				attendee: {
					attendee_name: input?.attendee_name ?? null,
					status: input?.status ?? null,
				},
				event: {
					id: input?.id ?? null,
					title: input?.title ?? null,
					description: input?.description ?? null,
					start_time: input?.start_time ?? null,
					end_time: input?.end_time ?? null,
					location: input?.location ?? null,
				},
				address: {
					street: input?.street ?? null,
					city_suburb: input?.city_suburb ?? null,
					state: input?.state ?? null,
					country: input?.country ?? null,
					postal_code: input?.postal_code ?? null,
				},
			}
	);
}
