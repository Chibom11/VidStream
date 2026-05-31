import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from "@aws-sdk/client-s3";

import fs from "fs";

const multipartUploadFileToS3 = async (req, res) => {
  console.log("Upload req received");

  const filePath =
    "C:/Users/shiva/Downloads/013) Day 13 - Chunking, Multipart upload.mp4";

  if (!fs.existsSync(filePath)) {
    console.log("File does not exist:", filePath);
    return res.status(400).send("File does not exist");
  }

  const s3 = new S3Client({
    region: "ap-south-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `videos/${Date.now()}.mp4`,
    ContentType: "video/mp4",
  };

  let uploadId;

  try {
    console.log("Creating Multipart Upload...");

    const multipartRes = await s3.send(
      new CreateMultipartUploadCommand(uploadParams)
    );

    uploadId = multipartRes.UploadId;

    console.log("UploadId:", uploadId);

    const fileSize = fs.statSync(filePath).size;

    const chunkSize = 5 * 1024 * 1024; // 5MB minimum for multipart
    const numParts = Math.ceil(fileSize / chunkSize);

    console.log("File Size:", fileSize);
    console.log("Number of Parts:", numParts);

    const uploadedETags = [];

    for (let i = 0; i < numParts; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, fileSize);

      console.log(
        `Uploading part ${i + 1}/${numParts} (${start}-${end})`
      );

      const uploadPartResponse = await s3.send(
        new UploadPartCommand({
          Bucket: uploadParams.Bucket,
          Key: uploadParams.Key,
          UploadId: uploadId,
          PartNumber: i + 1,
          Body: fs.createReadStream(filePath, {
            start,
            end: end - 1,
          }),
        })
      );

      console.log(
        `Part ${i + 1} uploaded: ${uploadPartResponse.ETag}`
      );

      uploadedETags.push({
        PartNumber: i + 1,
        ETag: uploadPartResponse.ETag,
      });
    }

    console.log("Completing Multipart Upload...");

    const completeResponse = await s3.send(
      new CompleteMultipartUploadCommand({
        Bucket: uploadParams.Bucket,
        Key: uploadParams.Key,
        UploadId: uploadId,
        MultipartUpload: {
          Parts: uploadedETags,
        },
      })
    );

    console.log("Upload Complete");
    console.log(completeResponse);

    return res.status(200).json({
      success: true,
      location: completeResponse.Location,
      key: uploadParams.Key,
    });
  } catch (error) {
    console.error("Multipart Upload Error:", error);

    if (uploadId) {
      try {
        await s3.send(
          new AbortMultipartUploadCommand({
            Bucket: uploadParams.Bucket,
            Key: uploadParams.Key,
            UploadId: uploadId,
          })
        );

        console.log("Multipart upload aborted");
      } catch (abortError) {
        console.error("Abort Error:", abortError);
      }
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default multipartUploadFileToS3;