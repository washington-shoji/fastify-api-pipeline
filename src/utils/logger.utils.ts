import pino from 'pino';

const logger = pino({
	// Default log level to 'info' if not specified
	level: process.env.LOG_LEVEL || 'info',
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true,
		},
	},
});

export default logger;
