import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger.utils';

export async function authMiddleware(
	request: FastifyRequest,
	reply: FastifyReply,
	done: Function
) {
	try {
		const token = request.headers.authorization?.split(' ')[1]; // Bearer TOKEN
		if (!token) {
			throw new Error('No token provided');
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
		// request.user = decoded; // Add the user payload to the request object
		done(); // Proceed to the next middleware or route handler
	} catch (error) {
		reply.code(401).send({ message: 'Unauthorized' });
		logger.error(error, 'Error Auth middleware');
	}
}
