import pino from 'pino';

// Mock the pino module
jest.mock('pino');

describe('Logger Configuration', () => {
	// Save the original environment variable to restore it later
	const originalLogLevel = process.env.LOG_LEVEL;

	afterEach(() => {
		// Restore the original LOG_LEVEL environment variable after each test
		if (originalLogLevel === undefined) {
			delete process.env.LOG_LEVEL;
		} else {
			process.env.LOG_LEVEL = originalLogLevel;
		}
		// Clear the module cache to ensure the logger module is reloaded for each test
		jest.resetModules();
	});

	it('should default to "info" level if LOG_LEVEL is not set', () => {
		// Ensure LOG_LEVEL is not set
		delete process.env.LOG_LEVEL;

		// Require the logger module, which will re-instantiate the logger with the current environment variables
		const logger = require('../../utils/logger.utils').default;

		// Check that pino was called with the expected default configuration
		expect(pino).toHaveBeenCalledWith(
			expect.objectContaining({
				level: 'info',
				transport: expect.objectContaining({
					target: 'pino-pretty',
					options: expect.objectContaining({ colorize: true }),
				}),
			})
		);
	});
});
