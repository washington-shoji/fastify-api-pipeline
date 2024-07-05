import jwt from 'jsonwebtoken';

export type TokenPayload = {
	userId: string;
	iat: number;
	exp: number;
};

export function decodeToken(token: string | undefined) {
	if (!token) return;

	const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

	if (decoded) {
		const arrayToken = token.split('.');
		const tokenPayload: TokenPayload = JSON.parse(atob(arrayToken[1]));

		return tokenPayload;
	}
}

export function decodeRefreshToken(token: string | undefined) {
	if (!token) return;

	const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string);

	if (decoded) {
		const arrayToken = token.split('.');
		const tokenPayload: TokenPayload = JSON.parse(atob(arrayToken[1]));

		return tokenPayload;
	}
}
