import {Router} from 'express'
import { uploadToDb } from '../controllers/multipart.upload.controller.js';

const route= Router();

route.post('/',uploadToDb)

export default route