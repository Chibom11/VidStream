import { Router } from "express";
import uploadFileToS3 from "../controllers/upload.controller.js";
import multer from 'multer'
import multipartUploadFileToS3 from "../controllers/multipart.upload.controller.js";
const route=Router();
const upload=multer()
route.post('/',multipartUploadFileToS3)

export default route