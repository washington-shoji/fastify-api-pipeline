import jwt from 'jsonwebtoken';

export function testToken(userId: string): string {
	const testToken = jwt.sign(
		{ userId: userId },
		String(process.env.JWT_SECRET).replace(/\\n/g, '\n'),
		{
			expiresIn: '1m',
			algorithm: 'HS256',
		}
	);

	return testToken;
}
