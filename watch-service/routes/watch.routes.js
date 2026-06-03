import express from "express";
import watchVideo from "../controllers/watch.controllers.js";

const router = express.Router();

router.get("/", watchVideo);

export default router;