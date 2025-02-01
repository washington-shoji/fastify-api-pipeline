import { FastifyRequest, FastifyReply } from 'fastify';
import { findPublicEventsAllInfoService } from '../services/event-all-info.service';

export async function getPublicEventsController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	try {
		const events = await findPublicEventsAllInfoService();
		reply.send(events);
	} catch (error) {
		reply.code(500).send({ message: 'Error retrieving events' });
		console.log(error, 'Error handling getEventsController');
	}
}
