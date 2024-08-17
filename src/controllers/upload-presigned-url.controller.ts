import { FastifyRequest, FastifyReply } from 'fastify';
import { decodeToken } from '../tests/unit-tests/utils/decode-token';
import { TokenExpiredError } from 'jsonwebtoken';
import { createPresignedUrlWithClient } from '../services/s3.service';

export async function getPresignedUrlWithClientController(
	request: FastifyRequest<{
		Params: {
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
		const preSignedUrl = await createPresignedUrlWithClient();
		if (!preSignedUrl) {
			return reply.code(404).send({ message: 'Resource not found' });
		}

		reply.code(200).send(preSignedUrl);
	} catch (error) {
		if (error instanceof TokenExpiredError) {
			return reply.code(401).send({ message: 'Unauthorized' });
		}

		reply.code(500).send({ message: 'Error generating pre-signed url' });
		console.log(error, 'Error handling getPresignedUrlWithClientController');
	}
}
