export interface EventAddressModel {
	id?: string;
	eventId: string;
	street: string;
	city_suburb: string;
	state: string;
	country: string;
	postal_code: string;
	created_at?: Date;
	updated_at?: Date;
}

export interface EventAddressModelRequest {
	id?: string;
	street: string;
	city_suburb: string;
	state: string;
	country: string;
	postal_code: string;
}

export interface EventAddressModelResponse {
	id: string;
	street: string;
	city_suburb: string;
	state: string;
	country: string;
	postal_code: string;
}
