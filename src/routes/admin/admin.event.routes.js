import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { authAdmin } from "../../middlewares/authAdmin.js";
import * as ctrl from "../../controllers/admin/admin.event.controller.js";
import { getEvent } from "../../controllers/event.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { validateCreateEvent, validateUpdateEvent } from "../../validators/event.validator.js";
import { upload } from "../../middlewares/upload.middleware.js";

const r = Router();

/**
 * @swagger
 * tags:
 *   name: Admin Events
 *   description: Event management for admins
 */

/**
 * @swagger
 * /admin/events:
 *   post:
 *     summary: Create a new event
 *     tags: [Admin Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - banner
 *             properties:
 *               title:
 *                 type: string
 *               banner:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Event created
 */
r.post("/", auth, authAdmin, upload.single("banner"), validate(validateCreateEvent), ctrl.adminCreateEvent);

/**
 * @swagger
 * /admin/events:
 *   get:
 *     summary: List all events (Admin)
 *     tags: [Admin Events]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of events
 */
r.get("/", auth, authAdmin, ctrl.adminListEvents);

/**
 * @swagger
 * /admin/events/{id}:
 *   get:
 *     summary: Get event details (Admin)
 *     tags: [Admin Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Event details
 */
r.get("/:id", auth, authAdmin, getEvent);

/**
 * @swagger
 * /admin/events/{id}:
 *   put:
 *     summary: Update an event
 *     tags: [Admin Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Event updated
 */
r.put("/:id", auth, authAdmin, upload.single("banner"), validate(validateUpdateEvent), ctrl.adminUpdateEvent);

/**
 * @swagger
 * /admin/events/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Admin Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Event deleted
 */
r.delete("/:id", auth, authAdmin, ctrl.adminDeleteEvent);

export default r;
