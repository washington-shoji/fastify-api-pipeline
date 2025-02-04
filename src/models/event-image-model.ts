export interface EventImageModel {
	id?: string;
	eventId: string;
	presignedUrl: string;
	fileUrl?: string;
	created_at?: Date;
	updated_at?: Date;
}

export interface EventImageResponseModel {
	id?: string;
	presignedUrl: string;
	fileUrl: string;
}
