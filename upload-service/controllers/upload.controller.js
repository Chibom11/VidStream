import fs from "fs";
import {S3Client,PutObjectCommand} from "@aws-sdk/client-s3";
import dotenv from 'dotenv'

dotenv.config();
// create s3 client
const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadFileToS3 = async (req, res) => {

  try {
    const file=req.file;
    console.log("Reqfile   ",req.file)
    if(!file){
      res.status(500).send("No file found")
    }

    // upload params
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: file.originalname, // file name in s3
      Body: file.buffer,
      ContentType: "image/png",
    };

    // upload to s3
    const command = new PutObjectCommand(params);

    const response = await s3.send(command);

    console.log("Upload Success:", response);

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: response,
    });
  } catch (error) {
    console.log("S3 Upload Error:", error);

    return res.status(500).json({
      success: false,
      message: "Upload failed",
      error,
    });
  }
};

export default uploadFileToS3;