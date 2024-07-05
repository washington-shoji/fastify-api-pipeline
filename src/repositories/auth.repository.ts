import pool from '../database/db';
import { UserAuthModel } from '../models/user-auth-model';
import { generateUUIDv7, parseUUID } from '../utils/uuidgenerator.utils';

export async function registerUser(userData: UserAuthModel) {
	const { username, email, password } = userData;
	const uuid = generateUUIDv7();
	const result = await pool.query(
		`INSERT INTO users (id, username, email, password) VALUES ($1, $2, $3, $4) RETURNING id, username, email`,
		[uuid, username, email, password]
	);
	return result.rows[0];
}

export async function loginUser(userData: UserAuthModel) {
	const { username, email } = userData;
	const result = await pool.query(
		`SELECT * FROM users WHERE username = $1 AND email = $2`,
		[username, email]
	);

	return result.rows[0];
}

export async function storeRefreshToken(userId: string, refreshToken: string) {
	const expiresAt = new Date();
	const uuid = generateUUIDv7();
	const userUuid = parseUUID(userId);
	expiresAt.setDate(expiresAt.getDate() + 7); // Set expiry date to 7 days from now

	// Insert refreshToken into the database
	await pool.query(
		`INSERT INTO refresh_tokens (id, user_id, token, expires_at) VALUES ($1, $2, $3, $4)`,
		[uuid, userUuid, refreshToken, expiresAt]
	);
}

export async function checkRefreshTokenInDB(
	userId: string,
	refreshToken: string
) {
	const uuid = parseUUID(userId);
	const { rows } = await pool.query(
		`SELECT * FROM refresh_tokens WHERE user_id = $1 AND token = $2 AND expires_at > NOW() AND revoked IS NOT TRUE`,
		[uuid, refreshToken]
	);

	return rows.length > 0;
}

export async function revokeRefreshToken(refreshToken: string) {
	await pool.query(
		`UPDATE refresh_tokens SET revoked = TRUE WHERE token = $1`,
		[refreshToken]
	);
}

export async function revokeAllRefreshTokensForUser(userId: string) {
	const uuid = parseUUID(userId);
	await pool.query(
		`UPDATE refresh_tokens SET revoked = TRUE WHERE user_id = $1`,
		[uuid]
	);
}

export async function testDeleteUser(testUserId: string) {
	const result = await pool.query(`DELETE FROM users WHERE id = $1 `, [
		testUserId,
	]);

	return result.rows[0];
}
