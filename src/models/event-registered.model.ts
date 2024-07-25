export interface RegisteredEventModel {
	attendee_name: string;
	status: string;
	id: string;
	title: string;
	description: string;
	start_time: string;
	end_time: string;
	location: string;
	street: string;
	city_suburb: string;
	state: string;
	country: string;
	postal_code: string;
}

export interface RegisteredEventResponseModel {
	attendee: {
		attendee_name: string;
		status: string;
	};
	event: {
		id: string;
		title: string;
		description: string;
		start_time: string;
		end_time: string;
		location: string;
	};
	address: {
		street: string;
		city_suburb: string;
		state: string;
		country: string;
		postal_code: string;
	};
}
