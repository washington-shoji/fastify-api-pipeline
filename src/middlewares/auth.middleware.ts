import { FastifyReply, FastifyRequest } from 'fastify';
import { decodeToken } from '../tests/unit-tests/utils/decode-token';

export async function authMiddleware(
	request: FastifyRequest,
	reply: FastifyReply
) {
	try {
		const token = request.headers.authorization?.split(' ')[1]; // Bearer TOKEN

		if (!token) {
			return reply.code(401).send({ message: 'Unauthorized' });
			//throw new Error('No token provided');
		}

		const decodedToken = decodeToken(token);
		if (!decodedToken) {
			return reply.code(401).send({ message: 'Unauthorized' });
			//throw new Error('No token provided');
		}
	} catch (error) {
		reply.code(401).send({ message: 'Unauthorized' });
		console.log(error, 'Error Auth middleware');
	}
}
