export interface EventAddressEntityModel {
	address_id?: string;
	event_id: string;
	street: string;
	city_suburb: string;
	state: string;
	country: string;
	postal_code: string;
	created_at?: Date;
	updated_at?: Date;
}

export interface EventAddressModelRequest {
	address_id?: string;
	street: string;
	city_suburb: string;
	state: string;
	country: string;
	postal_code: string;
}

export interface EventAddressModelResponse {
	address_id: string;
	street: string;
	city_suburb: string;
	state: string;
	country: string;
	postal_code: string;
}
