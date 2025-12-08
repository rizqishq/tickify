import { Router } from "express";
import { listEvents, getEvent } from "../controllers/event.controller.js";

const r = Router();

r.get("/", listEvents);
r.get("/:id", getEvent);

export default r;
