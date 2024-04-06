export interface EventAddressModel {
	id?: string;
	eventId: string;
	street: string;
	city: string;
	state: string;
	country: string;
	postal_code: string;
	created_at?: Date;
	updated_at?: Date;
}
