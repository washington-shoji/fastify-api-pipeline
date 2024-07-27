export interface EventAttendeeEntityModel {
	attendee_id?: string;
	event_id: string;
	user_id: string;
	registration_name: string;
	attendee_status: ATTENDEE_STATUS;
	created_at?: Date;
	updated_at?: Date;
}

export interface EventAttendeeModelRequest {
	registration_name: string;
	attendee_status: ATTENDEE_STATUS;
}

export interface EventAttendeeModelResponse {
	attendee_id: string;
	registration_name: string;
	attendee_status: ATTENDEE_STATUS;
}

export type ATTENDEE_STATUS = 'ATTENDING' | 'TENTATIVE' | 'NOT-ATTENDING';
