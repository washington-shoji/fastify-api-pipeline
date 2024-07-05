export interface EventModel {
	id?: string; //TODO: Refactor to have UUID type
	userId: string; //TODO: Refactor to have UUID type
	title: string;
	description: string;
	start_time: Date;
	end_time: Date;
	location: string;
}

export interface EventRequestModel {
	title: string;
	description: string;
	start_time: Date;
	end_time: Date;
	location: string;
}

export interface EventResponseModel {
	id: string; //TODO: Refactor to have UUID type
	title: string;
	description: string;
	start_time: Date;
	end_time: Date;
	location: string;
}
