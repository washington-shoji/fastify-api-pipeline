export interface EventImageModel {
	id?: string;
	eventId: string;
	imageUrl: string;
	imageKey?: string;
	created_at?: Date;
	updated_at?: Date;
}

export interface EventImageResponseModel {
	id?: string;
	imageUrl: string;
}

export interface EventPreSignedImageResponseModel {
	imageUrl: string;
}
