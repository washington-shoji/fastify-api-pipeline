import { FastifyRequest, FastifyReply } from 'fastify';
import { TokenExpiredError } from 'jsonwebtoken';
import { decodeToken } from '../tests/unit-tests/utils/decode-token';
import { getEventStats } from '../services/event-stats.service';

export async function getEventsStatsController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	try {
		const token = request.headers.authorization?.split(' ')[1]; // Bearer TOKEN
		const decoded = decodeToken(token);
		const userId = decoded?.userId;
		if (!userId) {
			return reply.code(401).send({ message: 'Unauthorized' });
		}

		const stats = await getEventStats(userId);
		reply.code(200).send(stats);
	} catch (error) {
		if (error instanceof TokenExpiredError) {
			return reply.code(401).send({ message: 'Unauthorized' });
		}

		reply.code(500).send({ message: 'Error retrieving event stats' });
		console.log(error, 'Error handling getUserEventsController');
	}
}
