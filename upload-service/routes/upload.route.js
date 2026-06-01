import express from "express";
import {initializeUpload,uploadChunk,completeUpload} from "../controllers/multipart.upload.controller.js";

import multer from "multer";

const upload = multer();

const router = express.Router();

// Route for initializing upload
router.post("/initialize",upload.none(),initializeUpload);

// Route for uploading individual chunks
router.post("/",upload.fields([
  { name: "chunk", maxCount: 1 },
  { name: "filename", maxCount: 1 },
  { name: "chunkIndex", maxCount: 1 },
  { name: "uploadId", maxCount: 1 },
  { name: "totalchunks", maxCount: 1 }
]),uploadChunk);

// Route for completing the upload
router.post("/complete",completeUpload);

export default router;