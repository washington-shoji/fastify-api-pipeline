import {
	RegisteredEventModel,
	RegisteredEventResponseModel,
} from '../models/event-registered.model';
import { findAllRegisteredEventsByUser } from '../repositories/event-registered.repository';

export async function getAllRegisteredEvents(
	userId: string
): Promise<RegisteredEventResponseModel[]> {
	try {
		const result = await findAllRegisteredEventsByUser(userId);

		return responseDataTransformerArray(result);
	} catch (error) {
		// Log the error for debugging purposes
		console.log(error, 'Error could not find registered events');

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
			registration_name: input?.registration_name ?? null,
			attendee_status: input?.attendee_status ?? null,
		},
		event: {
			event_id: input?.event_id ?? null,
			title: input?.title ?? null,
			description: input?.description ?? null,
			registration_open: input?.registration_open ?? null,
			registration_close: input?.registration_close ?? null,
			event_date: input?.event_date ?? null,
			location_type: input?.location_type ?? null,
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
					registration_name: input?.registration_name ?? null,
					attendee_status: input?.attendee_status ?? null,
				},
				event: {
					event_id: input?.event_id ?? null,
					title: input?.title ?? null,
					description: input?.description ?? null,
					registration_open: input?.registration_open ?? null,
					registration_close: input?.registration_close ?? null,
					event_date: input?.event_date ?? null,
					location_type: input?.location_type ?? null,
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
