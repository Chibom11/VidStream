import { Router } from "express";
import uploadFileToS3 from "../controllers/upload.controller.js";
import multer from 'multer'
const route=Router();
const upload=multer()
route.post('/',upload.single('file'),uploadFileToS3)

export default route