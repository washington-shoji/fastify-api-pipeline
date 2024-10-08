import { FastifyRequest, FastifyReply } from 'fastify';
import { getEventsService } from '../services/event.service';

export async function getPublicEventsController(
	request: FastifyRequest,
	reply: FastifyReply
) {
	try {
		const events = await getEventsService();
		reply.send(events);
	} catch (error) {
		reply.code(500).send({ message: 'Error retrieving events' });
		console.log(error, 'Error handling getEventsController');
	}
}
