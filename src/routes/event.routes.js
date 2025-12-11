import { Router } from "express";
import { listEvents, getEvent } from "../controllers/event.controller.js";

const r = Router();

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Public event management
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: List all events
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of events
 */
r.get("/", listEvents);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get event details
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event details
 *       404:
 *         description: Event not found
 */
r.get("/:id", getEvent);

export default r;
