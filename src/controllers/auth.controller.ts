import { FastifyRequest, FastifyReply } from 'fastify';
import { UserAuthModel } from '../models/user-auth-model';
import jwt from 'jsonwebtoken';
import {
	loginUserService,
	registerUserService,
} from '../services/auth.service';
import {
	checkRefreshTokenInDB,
	revokeRefreshToken,
} from '../repositories/auth.repository';

export async function registerController(
	request: FastifyRequest<{
		Body: UserAuthModel;
	}>,
	reply: FastifyReply
) {
	const { username, email, password } = request.body;

	try {
		const newUser = await registerUserService(username, email, password);
		reply.code(201).send(newUser);
	} catch (error) {
		reply.code(500).send({ message: 'Error registering user' });
	}
}

export async function loginController(
	request: FastifyRequest<{
		Body: UserAuthModel;
	}>,
	reply: FastifyReply
) {
	const { username, email, password } = request.body;

	try {
		const { userResponse, accessToken, refreshToken } = await loginUserService(
			username,
			email,
			password
		);
		reply.send({ userResponse, accessToken, refreshToken });
	} catch (error) {
		console.log('ERROR', error);
		reply.code(401).send({ message: 'Unauthorized' });
	}
}

export async function refreshTokenController(
	request: FastifyRequest<{
		Body: {
			refreshToken: string;
			userId: string;
		};
	}>,
	reply: FastifyReply
) {
	const { refreshToken, userId } = request.body;

	if (!refreshToken) {
		return reply.code(401).send({ message: 'Unauthorized' });
	}

	// Validate the refresh token
	let payload = null;
	try {
		payload = jwt.verify(
			refreshToken,
			String(process.env.REFRESH_TOKEN_SECRET).replace(/\\n/g, '\n')
		);
	} catch (error) {
		return reply.code(403).send({ message: 'Forbidden' });
	}

	// Check if the refresh token exists in the database and is not expired
	const tokenExists = await checkRefreshTokenInDB(userId, refreshToken);
	if (!tokenExists) {
		return reply.code(403).send({ message: 'Forbidden' });
	}

	// Generate a new access token
	const newAccessToken = jwt.sign(
		{ userId: userId },
		String(process.env.JWT_SECRET).replace(/\\n/g, '\n'),
		{ expiresIn: '15m' }
	);

	reply.send({ accessToken: newAccessToken });
}

export async function logoutController(
	request: FastifyRequest<{
		Body: {
			refreshToken: string;
		};
	}>,
	reply: FastifyReply
) {
	const { refreshToken } = request.body;

	if (!refreshToken) {
		return reply.code(400).send({ message: 'Refresh Token Required' });
	}

	// Optionally validate the refresh token
	let payload = null;
	try {
		payload = jwt.verify(
			refreshToken,
			String(process.env.REFRESH_TOKEN_SECRET).replace(/\\n/g, '\n')
		);
	} catch (error) {
		return reply.code(403).send({ message: 'Invalid Refresh Token' });
	}

	// Mark the refresh token as revoked in the database
	await revokeRefreshToken(refreshToken);

	reply.send({ message: 'Logged out successfully' });
}
