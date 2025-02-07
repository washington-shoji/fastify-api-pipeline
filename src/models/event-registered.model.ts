import { ATTENDEE_STATUS } from './event-attendee.model';
import { LOCATION_TYPE } from './event-model';

export interface RegisteredEventModel {
	registration_name: string;
	attendee_status: ATTENDEE_STATUS;
	event_id: string;
	title: string;
	description: string;
	registration_open: Date;
	registration_close: Date;
	event_date: Date;
	location_type: LOCATION_TYPE;
	street: string;
	city_suburb: string;
	state: string;
	country: string;
	postal_code: string;
	file_url: string;
}

export interface RegisteredEventResponseModel {
	attendee: {
		registration_name: string;
		attendee_status: ATTENDEE_STATUS;
	};
	event: {
		event_id: string;
		title: string;
		description: string;
		registration_open: Date;
		registration_close: Date;
		event_date: Date;
		location_type: LOCATION_TYPE;
	};
	address: {
		street: string;
		city_suburb: string;
		state: string;
		country: string;
		postal_code: string;
	};
	image: {
		file_url: string;
	};
}
