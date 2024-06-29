// src/index.ts or wherever your Fastify instance is created

import fastify from 'fastify';
import multipart from '@fastify/multipart';
import cors from '@fastify/cors';
import eventRoutes from './routes/event.route';
import authRoutes from './routes/auth.route';
import runMigrations from './database/dbMigrate';
import fileUploadRoutes from './routes/uploadfile.controller';
import logger from './utils/logger.utils';
import eventAddressRoutes from './routes/event-address.route';
import eventImageRoutes from './routes/event-image.route';

const app = fastify({ logger: true });

app.register(cors, {
	origin: 'http://localhost:4200',
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
});
app.register(multipart);

// Register event routes
app.register(eventRoutes, { prefix: '/api/v1' });
app.register(authRoutes, { prefix: '/api/v1' });
app.register(eventAddressRoutes, { prefix: '/api/v1' });
app.register(eventImageRoutes, { prefix: '/api/v1' });
app.register(fileUploadRoutes, { prefix: '/api/v1' });

// Start the server
async function start() {
	await runMigrations(); // Ensure tables are set up before starting the server

	try {
		await app.listen({ port: 3000 });
		console.log(`Server is running at http://localhost:3000`);
	} catch (err) {
		logger.error(err, 'Server Error');
		process.exit(1);
	}
}

start();
