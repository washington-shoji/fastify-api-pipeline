export interface EventEntityModel {
	event_id?: string;
	user_id: string;
	title: string;
	description: string;
	registration_open: Date;
	registration_close: Date;
	event_date: Date;
	location_type: LOCATION_TYPE;
	created_at?: Date;
	updated_at?: Date;
}

export interface EventRequestModel {
	title: string;
	description: string;
	registration_open: Date;
	registration_close: Date;
	event_date: Date;
	location_type: LOCATION_TYPE;
}

export interface EventResponseModel {
	event_id: string;
	title: string;
	description: string;
	registration_open: Date;
	registration_close: Date;
	event_date: Date;
	location_type: LOCATION_TYPE;
}

export type LOCATION_TYPE = 'VENUE' | 'ONLINE';
