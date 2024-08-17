import { FastifyInstance } from 'fastify/types/instance';
import { getPresignedUrlWithClientController } from '../controllers/upload-presigned-url.controller';

export default async function preSignedUrlRoutes(fastify: FastifyInstance) {
	fastify.post('/upload-url', getPresignedUrlWithClientController);
}
