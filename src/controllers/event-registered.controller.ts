import { FastifyReply, FastifyRequest } from 'fastify';
import { getAllRegisteredEvents } from '../services/event-registered.service';
import { decodeToken } from '../tests/unit-tests/utils/decode-token';

export async function getAllRegisteredEventsController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	try {
		const token = request.headers.authorization?.split(' ')[1]; // Bearer TOKEN
		console.log('token >>>>>>>>>>>>>>>>', token);
		const decoded = decodeToken(token);
		const userId = decoded?.userId;
		console.log('userId >>>>>>>>>>>>>>>>', userId);
		if (!userId) {
			return reply.code(401).send({ message: 'Unauthorized' });
		}
		const result = await getAllRegisteredEvents(userId);
		reply.code(200).send(result);
	} catch (error) {
		reply.code(500).send({ message: 'Error finding registered events' });
	}
}
