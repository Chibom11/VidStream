import { Router } from "express";
import { sendMessageToKafka } from "../controllers/kafka.publisher.controller.js";

const router=Router();

router.post('/',sendMessageToKafka);

export default router