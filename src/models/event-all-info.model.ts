import {
	EventAddressModelRequest,
	EventAddressModelResponse,
} from './event-address-model';
import { EventImageResponseModel } from './event-image-model';
import {
	EventRequestModel,
	EventResponseModel,
	LOCATION_TYPE,
} from './event-model';

export interface EventAllInfoRequestModel {
	eventModel: EventRequestModel;
	eventAddressModel: EventAddressModelRequest;
}

export interface EventAllInfoResponseModel {
	eventModel: EventResponseModel;
	eventAddressModel: EventAddressModelResponse;
	eventImageModel: EventImageResponseModel;
}

export interface EventAllInfoEntityModel {
	event_id: string;
	user_id: string;
	title: string;
	description: string;
	registration_open: Date;
	registration_close: Date;
	event_date: Date;
	location_type: LOCATION_TYPE;
	event_created_at: string;
	event_updated_at: string;
	address_id: string;
	street: string;
	city_suburb: string;
	state: string;
	country: string;
	postal_code: string;
	address_created_at: Date;
	address_updated_at: Date;
	image_id: string;
	presigned_url: string;
	file_url: string;
	image_created_at: Date;
	image_updated_at: Date;
}
