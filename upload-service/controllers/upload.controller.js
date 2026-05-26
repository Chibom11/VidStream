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
    console.log("Reached the upload controller")
    const filePath =
      "C:/Users/shiva/yt/upload-service/assets/IMG_20260526_192612.jpg";

    // check if file exists
    if (!fs.existsSync(filePath)) {
      console.log("File does not exist:", filePath);
      return res.status(400).json({
        success: false,
        message: "File not found",
      });
    }

    // read file
    const fileContent = fs.readFileSync(filePath);

    // upload params
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: "s3upload.png", // file name in s3
      Body: fileContent,
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