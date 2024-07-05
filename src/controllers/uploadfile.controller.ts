import { FastifyReply } from 'fastify';
import { FastifyRequest } from 'fastify/types/request';
import logger from '../utils/logger.utils';
import { deleteFileFromS3, uploadImageFileToS3 } from '../services/s3.service';

interface CustomFastifyRequest extends FastifyRequest {
	file: any;
}

export async function uploadFileController(
	request: CustomFastifyRequest,
	reply: FastifyReply
) {
	try {
		// Assuming you're using something like fastify-multipart
		const data = await request.file();
		const buffer = await data.toBuffer();
		const fileName = data.filename;
		const bucketName = process.env.S3_BUCKET as string;
		const response = await uploadImageFileToS3(buffer, fileName, bucketName);
		reply.code(201).send({ data: response.Location });
	} catch (error) {
		logger.error(error, 'Error handling uploadFileController');
		reply.code(500).send({ message: 'Error uploading image' });
	}
}

export async function deleteFileController(
	request: FastifyRequest<{
		Body: {
			filename: string;
		};
	}>,
	reply: FastifyReply
) {
	try {
		// Assuming you're using something like fastify-multipart
		const fileName = request.body.filename;
		const bucketName = process.env.S3_BUCKET as string;
		const response = await deleteFileFromS3(fileName, bucketName);
		reply.code(204).send();
	} catch (error) {
		logger.error(error, 'Error handling uploadFileController');
		reply.code(500).send({ message: 'Error uploading image' });
	}
}
