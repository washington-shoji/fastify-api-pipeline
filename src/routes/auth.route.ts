import { FastifyInstance } from 'fastify';
import {
	loginController,
	logoutController,
	refreshTokenController,
	registerController,
} from '../controllers/auth.controller';

export default async function authRoutes(fastify: FastifyInstance) {
	fastify.post('/register', registerController);
	fastify.post('/login', loginController);
	fastify.post('/refresh-token', refreshTokenController);
	fastify.post('/logout', logoutController);
}
