import {
	EventAddressEntityModel,
	EventAddressModelResponse,
} from '../models/event-address-model';
import {
	EventAllInfoRequestModel,
	EventAllInfoResponseModel,
} from '../models/event-all-info.model';
import { createEventAddress } from '../repositories/event-address.repository';
import { createEvent } from '../repositories/event.repository';
import { EventEntityModel, EventResponseModel } from './../models/event-model';
import { EventImageResponseModel } from '../models/event-image-model';
import { createEventPreSignedImageService } from './event-image.service';
import { findEventAllInfoById } from '../repositories/event-all-info.repository';

export async function createEventAllInfoService(
	userId: string,
	eventAllData: EventAllInfoRequestModel
): Promise<EventAllInfoResponseModel> {
	try {
		const eventEntityData: EventEntityModel = {
			user_id: userId,
			title: eventAllData.eventModel.title,
			description: eventAllData.eventModel.description,
			registration_open: eventAllData.eventModel.registration_open,
			registration_close: eventAllData.eventModel.registration_close,
			event_date: eventAllData.eventModel.event_date,
			location_type: eventAllData.eventModel.location_type,
		};

		const eventResult: EventEntityModel = await createEvent(eventEntityData);

		const eventId = eventResult.event_id as string;

		const eventAddressEntity: EventAddressEntityModel = {
			event_id: eventId,
			street: eventAllData.eventAddressModel.street,
			city_suburb: eventAllData.eventAddressModel.city_suburb,
			state: eventAllData.eventAddressModel.state,
			country: eventAllData.eventAddressModel.country,
			postal_code: eventAllData.eventAddressModel.postal_code,
		};

		const eventAddressResult: EventAddressEntityModel =
			await createEventAddress(eventAddressEntity);

		const eventPreSignedImage = await createEventPreSignedImageService(
			eventId,
			userId
		);

		const eventAllInfoData: EventAllInfoResponseModel = {
			eventModel: <EventResponseModel>{
				event_id: eventId,
				title: eventResult.title,
				description: eventResult.description,
				registration_open: eventResult.registration_open,
				registration_close: eventResult.registration_close,
				event_date: eventResult.event_date,
				location_type: eventResult.location_type,
			},
			eventAddressModel: <EventAddressModelResponse>{
				address_id: eventAddressResult.address_id,
				street: eventAddressResult.street,
				city_suburb: eventAddressResult.city_suburb,
				state: eventAddressResult.state,
				country: eventAddressResult.country,
				postal_code: eventAddressResult.postal_code,
			},
			eventImageModel: <EventImageResponseModel>{
				presignedUrl: eventPreSignedImage.presignedUrl,
				fileUrl: eventPreSignedImage.fileUrl,
			},
		};

		return eventAllInfoData;
	} catch (error) {
		console.log(error, 'Error creating all data event');
		throw new Error('Failed to create all data event. Please try again later.');
	}
}

export async function findEventAllInfoByIdService(
	eventId: string,
	userId: string
) {
	try {
		const eventResult = await findEventAllInfoById(eventId, userId);

		const eventAllInfoData: EventAllInfoResponseModel = {
			eventModel: <EventResponseModel>{
				event_id: eventResult.event_id,
				title: eventResult.title,
				description: eventResult.description,
				registration_open: eventResult.registration_open,
				registration_close: eventResult.registration_close,
				event_date: eventResult.event_date,
				location_type: eventResult.location_type,
			},
			eventAddressModel: <EventAddressModelResponse>{
				address_id: eventResult.address_id,
				street: eventResult.street,
				city_suburb: eventResult.city_suburb,
				state: eventResult.state,
				country: eventResult.country,
				postal_code: eventResult.postal_code,
			},
			eventImageModel: <EventImageResponseModel>{
				fileUrl: eventResult.file_url,
			},
		};

		return eventAllInfoData;
	} catch (error) {
		console.log(error, 'Error could not find event');
		throw new Error('Failed to find event. Please try again later.');
	}
}
