import { FastifyRequest, FastifyReply } from 'fastify';

export async function healthCheckController(
	request: FastifyRequest,
	reply: FastifyReply
) {
   reply.code(200).send({message: 'Server lives, yeay!!!'});
}