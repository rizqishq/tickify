import { Router } from "express";
import { handleXenditWebhook } from "../controllers/webhook.controller.js";

const r = Router();

r.post("/xendit", handleXenditWebhook);

export default r;
