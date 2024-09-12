// src/index.ts or wherever your Fastify instance is created

import fastify from 'fastify';
import multipart from '@fastify/multipart';
import cors from '@fastify/cors';
import fastifyRateLimit from '@fastify/rate-limit';

import runMigrations from './database/dbMigrate';
import fileUploadRoutes from './routes/uploadfile.controller';

import eventRoutes from './routes/event.route';
import authRoutes from './routes/auth.route';
import eventAddressRoutes from './routes/event-address.route';
import eventImageRoutes from './routes/event-image.route';
import publicEventRoutes from './routes/public-event.route';
import eventAttendeeRoutes from './routes/event-attendee.route';
import eventRegisteredRoutes from './routes/event-registered.route';
import preSignedUrlRoutes from './routes/upload-presigned-url.route';
import healthCheckRoutes from './routes/helth-check.route';

const app = fastify({logger: true});

app.register(cors, {
	origin: '*',
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
});
app.register(multipart);

app.register(fastifyRateLimit, {
	max: 100,
	timeWindow: '1 minute',
});

// Register health check routes
app.register(healthCheckRoutes, { prefix: '/api/v1' });

// Register public event routes
app.register(publicEventRoutes, { prefix: '/api/v1' });

// Register event routes
app.register(eventRoutes, { prefix: '/api/v1' });
app.register(authRoutes, { prefix: '/api/v1' });
app.register(eventAddressRoutes, { prefix: '/api/v1' });
app.register(eventImageRoutes, { prefix: '/api/v1' });
app.register(eventAttendeeRoutes, { prefix: '/api/v1' });
app.register(eventRegisteredRoutes, { prefix: '/api/v1' });
app.register(fileUploadRoutes, { prefix: '/api/v1' });
app.register(preSignedUrlRoutes, { prefix: '/api/v1' });

// Start the server
async function start() {
	await runMigrations(); // Ensure tables are set up before starting the server

	try {
		if(process?.env?.PORT) {
			const port = parseInt(process?.env?.PORT);
			await app.listen({ port: port, host: '0.0.0.0' });
			console.log(`Server is running at http://localhost:${port}`);
		} else {
			await app.listen({ port: 3030, host: '0.0.0.0' });
			console.log(`Server is running at http://localhost:3030`);
		}
	} catch (err) {
		console.log('Server Error: ', err);
		process.exit(1);
	}
}

start();
