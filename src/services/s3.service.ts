import { s3Client } from '../aws/s3client';
import {
	DeleteObjectCommand,
	ObjectCannedACL,
	PutObjectCommand,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function uploadImageFileToS3(
	fileBuffer: Buffer,
	fileName: string,
	bucketName: string
) {
	const filenameWithPngExt = fileName.replace(
		'.jpg' || '.jpeg' || '.svg' || '.gif',
		'.png'
	);

	const params = {
		Bucket: bucketName,
		Key: filenameWithPngExt,
		Body: fileBuffer,
		ACL: ObjectCannedACL.public_read,
		ContentType: 'image/png',
	};

	try {
		const response = await new Upload({
			client: s3Client,
			params: params,
		}).done();
		// Contains details about the uploaded file, such as ETag, version ID, etc.
		return response;
	} catch (error) {
		console.log(error, 'Error uploading file to S3');
		throw error;
	}
}

export async function deleteFileFromS3(fileName: string, bucketName: string) {
	const params = {
		Bucket: bucketName,
		Key: fileName,
	};

	try {
		const command = new DeleteObjectCommand(params);
		const response = await s3Client.send(command);
		// The response is usually empty for a successful deletion
		return response;
	} catch (error) {
		console.log(error, 'Error deleting file from S3');
		throw error;
	}
}

export async function createPresignedUrlWithClient(): Promise<string> {
	const bucketName = process.env.S3_BUCKET as string;
	const key = `${Math.random().toString()}.png`;
	const client = s3Client;
	const command = new PutObjectCommand({
		Bucket: bucketName,
		Key: key,
		ACL: ObjectCannedACL.public_read,
	});
	const presignedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });

	return presignedUrl;
}
