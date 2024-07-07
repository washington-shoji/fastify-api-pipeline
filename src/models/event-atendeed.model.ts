export interface EventAttendeeModel {
	id?: string;
	eventId: string;
	userId: string;
	attendee_name: string;
	status: string;
	created_at?: Date;
	updated_at?: Date;
}

export interface EventAttendeeModelRequest {
	attendeeName: string;
	status: string;
}

export interface EventAttendeeModelResponse {
	id: string;
	attendeeName: string;
	status: string;
}
