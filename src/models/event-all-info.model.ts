import {
	EventAddressModelRequest,
	EventAddressModelResponse,
} from './event-address-model';
import { EventImageResponseModel } from './event-image-model';
import { EventRequestModel, EventResponseModel } from './event-model';

export interface EventAllInfoRequestModel {
	eventModel: EventRequestModel;
	eventAddressModel: EventAddressModelRequest;
}

export interface EventAllInfoResponseModel {
	eventModel: EventResponseModel;
	eventAddressModel: EventAddressModelResponse;
	eventImageModel: EventImageResponseModel;
}
