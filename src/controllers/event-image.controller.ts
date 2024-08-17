import { FastifyReply } from 'fastify/types/reply';
import { FastifyRequest } from 'fastify/types/request';
import {
	createEventImageService,
	deleteEventImageService,
	updateEventImageService,
} from '../services/event-image.service';
import { findEventImageById } from '../repositories/event-image.repository';
import { decodeToken } from '../tests/unit-tests/utils/decode-token';

export async function createEventImageController(
	request: FastifyRequest<{
		file: File;
		Querystring: {
			eventId: string;
		};
	}>,
	reply: FastifyReply
) {
	try {
		const token = request.headers.authorization?.split(' ')[1]; // Bearer TOKEN
		const decoded = decodeToken(token);
		const userId = decoded?.userId;
		if (!userId) {
			return reply.code(401).send({ message: 'Unauthorized' });
		}

		const eventId = request.query.eventId;
		const file = await request.file();

		if (!eventId || !file) {
			throw new Error('No event id or file was provided');
		}

		const eventImage = await createEventImageService(eventId, userId, file);

		reply.code(201).send({
			imageData: {
				imageId: eventImage?.id,
				eventId: eventImage?.eventId,
				imageUrl: eventImage?.imageUrl,
				imageKey: eventImage?.imageKey,
			},
		});
	} catch (error) {
		console.log(error, 'Error handling createEventImageController');
		reply.code(500).send({ message: 'Error creating event image' });
	}
}

export async function updateEventImageController(
	request: FastifyRequest<{
		file: File;
		Querystring: {
			imageId: string;
		};
	}>,
	reply: FastifyReply
) {
	try {
		const imageId = request.query.imageId;
		const file = await request.file();

		if (!imageId || !file) {
			throw new Error('No event image id or event or file was provided');
		}

		const eventImage = await updateEventImageService(imageId, file);

		reply.code(201).send({
			imageData: {
				imageId: eventImage?.id,
				eventId: eventImage?.eventId,
				imageUrl: eventImage?.imageUrl,
				imageKey: eventImage?.imageKey,
			},
		});
	} catch (error) {
		console.log(error, 'Error handling updateEventImageController');
		reply.code(500).send({ message: 'Error updating event image' });
	}
}

export async function deleteEventImageController(
	request: FastifyRequest<{
		Params: { id: string };
	}>,
	reply: FastifyReply
) {
	try {
		const imageId = request.params.id;

		if (!imageId) {
			throw new Error('No event image id or image key was provided');
		}

		await deleteEventImageService(imageId);
		reply.code(201).send({ response: 'Event image deleted successfully' });
	} catch (error) {
		console.log(error, 'Error handling deleteEventImageController');
		reply.code(500).send({ message: 'Error deleting event image' });
	}
}

export async function findByIdEventImageController(
	request: FastifyRequest<{ Params: { id: string } }>,
	reply: FastifyReply
) {
	try {
		const imageId = request.params.id;
		const eventImage = await findEventImageById(imageId);
		reply.code(201).send({
			imageData: {
				imageId: eventImage.id,
				eventId: eventImage.event_id,
				imageUrl: eventImage.image_url,
				imageKey: eventImage.image_key,
			},
		});
	} catch (error) {
		console.log(error, 'Error handling findByIdEventImageController');
		reply.code(500).send({ message: 'Error finding event image' });
	}
}
