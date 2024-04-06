import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const region = process.env.S3_REGION as string;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID as string;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY as string;

// Initialize S3 Client
const s3Client = new S3Client({
	region: region,
	credentials: {
		accessKeyId: accessKeyId,
		secretAccessKey: secretAccessKey,
	},
});

export { s3Client };
