import { Router } from "express";
import { fetchVideo } from "../controllers/allVideos.controller.js";
const route=Router();

route.get('/',fetchVideo);

export default route