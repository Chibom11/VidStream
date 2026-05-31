import {
  S3Client,
  CreateMultipartUploadCommand,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const initializeUpload = async (req, res) => {
  try {
    console.log("Initializing Upload");

    const { filename } = req.body;

    const createParams = {
      Bucket: process.env.AWS_BUCKET,
      Key: filename,
      ContentType: "video/mp4",
    };

    const multipartParams = await s3.send(
      new CreateMultipartUploadCommand(createParams)
    );

    const uploadId = multipartParams.UploadId;

    console.log("multipartParams", multipartParams);

    return res.status(200).json({
      uploadId,
    });
  } catch (err) {
    console.error("Error initializing upload:", err);
    return res.status(500).send("Upload initialization failed");
  }
};

import { UploadPartCommand } from "@aws-sdk/client-s3";

export const uploadChunk = async (req, res) => {
  try {
    console.log("Uploading Chunk");

    const { filename, chunkIndex, uploadId } = req.body;

    const partParams = {
      Bucket: process.env.AWS_BUCKET,
      Key: filename,
      UploadId: uploadId,
      PartNumber: parseInt(chunkIndex) + 1,
      Body: req.file.buffer,
    };

    const data = await s3.send(
      new UploadPartCommand(partParams)
    );

    console.log("data", data);

    return res.status(200).json({
      success: true,
      ETag: data.ETag,
      PartNumber: parseInt(chunkIndex) + 1,
    });
  } catch (err) {
    console.error("Error uploading chunk:", err);
    return res.status(500).send("Chunk could not be uploaded");
  }
};

import {
  ListPartsCommand,
  CompleteMultipartUploadCommand,
} from "@aws-sdk/client-s3";

export const completeUpload = async (req, res) => {
  try {
    console.log("Completing Upload");

    const { filename, uploadId } = req.body;

    const completeParams = {
      Bucket: process.env.AWS_BUCKET,
      Key: filename,
      UploadId: uploadId,
    };

    const data = await s3.send(
      new ListPartsCommand(completeParams)
    );

    const parts = data.Parts.map((part) => ({
      ETag: part.ETag,
      PartNumber: part.PartNumber,
    }));

    const uploadResult = await s3.send(
      new CompleteMultipartUploadCommand({
        ...completeParams,
        MultipartUpload: {
          Parts: parts,
        },
      })
    );

    console.log("uploadResult", uploadResult);

    return res.status(200).json({
      message: "Uploaded successfully!",
      location: uploadResult.Location,
    });
  } catch (error) {
    console.log("Error completing upload:", error);

    return res.status(500).send(
      "Upload completion failed"
    );
  }
};