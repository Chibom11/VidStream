import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from 'dotenv'

dotenv.config()
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function generateSignedUrl(videoKey) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: videoKey,
  });

  const signedUrl = await getSignedUrl(
    s3Client,
    command,
    {
      expiresIn: 3600, // 1 hour
    }
  );

  return signedUrl;
}