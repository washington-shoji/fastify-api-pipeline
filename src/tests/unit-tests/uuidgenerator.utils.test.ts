import { UUID, uuidv7 } from 'uuidv7';
import { generateUUIDv7, parseUUID } from '../../utils/uuidgenerator.utils';

jest.mock('uuidv7', () => ({
	uuidv7: jest.fn(),
	UUID: {
		parse: jest.fn(),
	},
}));

describe('UUIDv7 Utilities', () => {
	describe('generateUUIDv7', () => {
		it('should generate a valid UUIDv7 string', () => {
			const mockUUID = '01F5KC59ZX4RFFPQ3F8K2VABHW';
			(uuidv7 as jest.Mock).mockReturnValue(mockUUID);

			const result = generateUUIDv7();
			expect(uuidv7).toHaveBeenCalled();
			expect(result).toBe(mockUUID);
			// Optionally, add a regex check here for UUID format if desired
		});
	});

	describe('parseUUID', () => {
		it('should parse a UUIDv7 string into a Uint8Array', () => {
			const mockUUID = '01F5KC59ZX4RFFPQ3F8K2VABHW';
			const mockBytes = new Uint8Array([1, 2, 3, 4]); // Example byte array, adjust as needed
			(UUID.parse as jest.Mock).mockReturnValue({ bytes: mockBytes });

			const result = parseUUID(mockUUID);
			expect(UUID.parse).toHaveBeenCalledWith(mockUUID);
			expect(result).toEqual(mockBytes);
		});
	});
});
