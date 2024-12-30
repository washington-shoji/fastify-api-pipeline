import { MultipartFile } from '@fastify/multipart';
import { EventImageModel } from '../models/event-image-model';
import {
	createEventImage,
	deleteEventImage,
	findEventImageById,
	getEventsImage,
	updateEventImage,
} from '../repositories/event-image.repository';
import {
	createPresignedUrlWithClient,
	deleteFileFromS3,
	uploadImageFileToS3,
} from './s3.service';
import { findEventById } from '../repositories/event.repository';

export async function createEventImageService(
	eventId: string,
	userId: string,
	file: MultipartFile
) {
	try {
		const data = file;
		const buffer = await data.toBuffer();
		const fileName = data?.filename;
		const bucketName = process.env.S3_BUCKET as string;

		const existingEvent = await findEventById(eventId, userId);

		if (!existingEvent) {
			throw new Error('Event does not exists');
		}

		const imageResponse = await uploadImageFileToS3(
			buffer,
			fileName,
			bucketName
		);

		if (imageResponse && imageResponse.Location && imageResponse.Key) {
			const imageData: EventImageModel = {
				eventId: existingEvent.id,
				imageUrl: imageResponse.Location,
				imageKey: imageResponse.Key,
			};

			const repositoryResponse = await createEventImage(imageData);
			return <EventImageModel>{
				id: repositoryResponse.id,
				eventId: repositoryResponse.event_id,
				imageUrl: repositoryResponse.image_url,
				imageKey: repositoryResponse.image_key,
			};
		}
	} catch (error) {
		console.log(error, 'Error creating event image');
		throw new Error('Failed to create event image. Please try again later.');
	}
}

export async function findEventImageByIdService(id: string) {
	try {
		const repositoryResponse = await findEventImageById(id);
		return <EventImageModel>{
			id: repositoryResponse.id,
			eventId: repositoryResponse.event_id,
			imageUrl: repositoryResponse.image_url,
			imageKey: repositoryResponse.image_key,
		};
	} catch (error) {
		console.log(error, 'Error finding event image');
		throw new Error('Failed to find event image. Please try again later.');
	}
}

export async function findEventImagesService() {
	try {
		return await getEventsImage();
	} catch (error) {
		console.log(error, 'Error finding event images');
		throw new Error('Failed to find event images. Please try again later.');
	}
}

export async function updateEventImageService(
	imageId: string,
	file: MultipartFile
) {
	try {
		const data = file;
		const buffer = await data?.toBuffer();
		const fileName = data?.filename;
		const bucketName = process.env.S3_BUCKET as string;

		const existingImage = await findEventImageByIdService(imageId);

		if (!existingImage) {
			throw new Error('Event image does not exists');
		}

		await deleteFileFromS3(existingImage.imageKey as string, bucketName);

		const imageResponse = await uploadImageFileToS3(
			buffer,
			fileName,
			bucketName
		);

		if (imageResponse && imageResponse.Location && imageResponse.Key) {
			const imageData: EventImageModel = {
				eventId: existingImage.eventId,
				imageUrl: imageResponse.Location,
				imageKey: imageResponse.Key,
			};
			const repositoryResponse = await updateEventImage(imageId, imageData);
			return <EventImageModel>{
				id: repositoryResponse.id,
				eventId: repositoryResponse.event_id,
				imageUrl: repositoryResponse.image_url,
				imageKey: repositoryResponse.image_key,
			};
		}
	} catch (error) {
		console.log(error, 'Error updating event images');
		throw new Error('Failed to update event images. Please try again later.');
	}
}

export async function deleteEventImageService(imageId: string) {
	try {
		const bucketName = process.env.S3_BUCKET as string;

		const existingImage = await findEventImageByIdService(imageId);

		if (!existingImage) {
			throw new Error('Event image does not exists');
		}

		const deleteImageResponse = await deleteFileFromS3(
			existingImage.imageKey as string,
			bucketName
		);
		if (deleteImageResponse) {
			return await deleteEventImage(imageId);
		}
	} catch (error) {
		console.log(error, 'Error deleting event images');
		throw new Error('Failed to delete event images. Please try again later.');
	}
}

export async function createEventPreSignedImageService(
	eventId: string,
	userId: string
): Promise<string> {
	try {
		const existingEvent = await findEventById(eventId, userId);

		if (!existingEvent) {
			throw new Error('Event does not exists');
		}

		const preSignedImageUrlResponse = await createPresignedUrlWithClient();

		if (preSignedImageUrlResponse) {
			const imageData: EventImageModel = {
				eventId: existingEvent.id,
				imageUrl: preSignedImageUrlResponse,
			};

			await createEventImage(imageData);
		}
		return preSignedImageUrlResponse;
	} catch (error) {
		console.log(error, 'Error creating event image');
		throw new Error('Failed to create event image. Please try again later.');
	}
}
