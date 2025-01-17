import fastify, { FastifyReply, FastifyRequest } from 'fastify';
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

const app = fastify({ logger: true });

app.register(cors, {
	origin: '*',
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
});
app.register(multipart, { attachFieldsToBody: true });

app.register(fastifyRateLimit, {
	max: 100,
	timeWindow: '1 minute',
});

// Register health check routes
app.register(healthCheckRoutes);

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

// Function to prepare the server
async function buildServer() {
	// Run migrations if necessary
	await runMigrations();
	// Ensure the app is ready
	await app.ready();
	return app;
}

// Export the handler for Vercel deployment
export default async function vercelHandler(
	req: FastifyRequest,
	res: FastifyReply
): Promise<void> {
	const app = await buildServer();
	// Handle the request
	app.server.emit('request', req, res);
}

// Start the server locally if not in a serverless environment
if (require.main === module) {
	runSeverLocally();
}

async function runSeverLocally() {
	try {
		const app = await buildServer();
		const port = process.env.PORT || 3030;
		await app.listen({ port: Number(port), host: '0.0.0.0' });
		console.log(`Server is running at http://localhost:${port}`);
	} catch (err) {
		console.error('Server Error:', err);
		process.exit(1);
	}
}
