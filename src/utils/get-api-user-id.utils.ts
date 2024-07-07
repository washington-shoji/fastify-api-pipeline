import { FastifyRequest } from 'fastify/types/request';
import { decodeToken } from '../tests/unit-tests/utils/decode-token';

export function getUserIdFromToken(request: FastifyRequest) {
	const token = request.headers.authorization?.split(' ')[1]; // Bearer TOKEN
	const decoded = decodeToken(token);
	const userId = decoded?.userId;

	return userId;
}
