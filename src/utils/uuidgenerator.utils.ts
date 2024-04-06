import { UUID, uuidv7 } from 'uuidv7';

function generateUUIDv7(): string {
	// This should return a UUIDv7 string
	return uuidv7();
}

function parseUUID(id: string): Readonly<Uint8Array> {
	// This should parse a string to UUIDv7
	return UUID.parse(id).bytes;
}

export { generateUUIDv7, parseUUID };
