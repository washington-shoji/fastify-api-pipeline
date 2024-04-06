import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserAuthModel, UserResponseModel } from '../models/user-auth-model';
import {
	loginUser,
	registerUser,
	revokeAllRefreshTokensForUser,
	storeRefreshToken,
} from '../repositories/auth.repository';

dotenv.config();

export async function registerUserService(
	username: string,
	email: string,
	password: string
) {
	const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with a salt round of 10

	const userData: UserAuthModel = {
		username: username,
		email: email,
		password: hashedPassword,
	};

	return await registerUser(userData);
}

export async function loginUserService(
	username: string,
	email: string,
	password: string
) {
	const userData: UserAuthModel = {
		username: username,
		email: email,
		password: password,
	};
	const user = await loginUser(userData);

	if (!user) {
		throw new Error('User not found');
	}

	const isValid = await bcrypt.compare(password, user.password);
	if (!isValid) {
		throw new Error('Invalid password');
	}

	const accessToken = jwt.sign(
		{ userId: user.id },
		String(process.env.JWT_SECRET).replace(/\\n/g, '\n'),
		{
			expiresIn: '5m',
			algorithm: 'HS256',
		}
	);

	const refreshToken = jwt.sign(
		{ userId: user.id },
		String(process.env.REFRESH_TOKEN_SECRET).replace(/\\n/g, '\n'),
		{ expiresIn: '7d' }
	);

	const userResponse: UserResponseModel = {
		id: user.id,
		username: user.username,
		email: user.email,
	};

	// Store refreshToken in the database with its expiry date
	await storeRefreshToken(user.id, refreshToken);

	return { userResponse, accessToken, refreshToken };
}

export async function changeUserPassword(userId: string, newPassword: string) {
	// Password update logic...

	// Revoke all existing refresh tokens for this user
	await revokeAllRefreshTokensForUser(userId);
}
