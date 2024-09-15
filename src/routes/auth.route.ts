import { FastifyInstance } from 'fastify';
import {
	loginController,
	logoutController,
	refreshTokenController,
	registerController,
} from '../controllers/auth.controller';

const bodyJsonSchema = {
	type: 'object',
	required: ['username', 'email', 'password'],
	properties: {
		username: { type: 'string' },
		email: { type: 'string' },
		password: { type: 'string' },
	}
  }

  const schemaBody = {
	body: bodyJsonSchema
  }

export default async function authRoutes(fastify: FastifyInstance) {
	fastify.post('/register', {schema: schemaBody}, registerController);
	fastify.post('/login', {schema: schemaBody}, loginController);
	fastify.post('/refresh-token', refreshTokenController);
	fastify.post('/logout', logoutController);
}
