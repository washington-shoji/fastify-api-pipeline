import { FastifyInstance } from 'fastify';
import {
	deleteFileController,
	uploadFileController,
} from '../controllers/uploadfile.controller';

export default async function fileUploadRoutes(fastify: FastifyInstance) {
	// Create Event
	fastify.post('/fupload', uploadFileController);
	fastify.delete('/fdelete', deleteFileController);
}
