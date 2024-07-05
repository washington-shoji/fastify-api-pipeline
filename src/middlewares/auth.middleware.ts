import { FastifyReply, FastifyRequest } from 'fastify';
import logger from '../utils/logger.utils';
import { decodeToken } from '../tests/unit-tests/utils/decode-token';

export async function authMiddleware(
	request: FastifyRequest,
	reply: FastifyReply
) {
	try {
		const token = request.headers.authorization?.split(' ')[1]; // Bearer TOKEN

		if (!token) {
			reply.code(401).send({ message: 'Unauthorized' });
			//throw new Error('No token provided');
		}

		const decodedToken = decodeToken(token);
		if (!decodedToken) {
			reply.code(401).send({ message: 'Unauthorized' });
			//throw new Error('No token provided');
		}
	} catch (error) {
		reply.code(401).send({ message: 'Unauthorized' });
		logger.error(error, 'Error Auth middleware');
	}
}
