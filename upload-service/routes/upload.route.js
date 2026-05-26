import { Router } from "express";
const route=Router();
import uploadFileToS3 from "../controllers/upload.controller.js";
route.post('/upload',uploadFileToS3)

export default route