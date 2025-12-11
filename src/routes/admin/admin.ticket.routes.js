import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { authAdmin } from "../../middlewares/authAdmin.js";
import * as ctrl from "../../controllers/admin/admin.ticket.controller.js";

const r = Router();

/**
 * @swagger
 * tags:
 *   name: Admin Tickets
 *   description: Ticket Category management for admins
 */

/**
 * @swagger
 * /admin/tickets:
 *   post:
 *     summary: Create a ticket category for an event
 *     tags: [Admin Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event_id
 *               - name
 *               - price
 *               - quota
 *             properties:
 *               event_id:
 *                 type: integer
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               quota:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Ticket category created
 */
r.post("/", auth, authAdmin, ctrl.adminCreateTicket);

/**
 * @swagger
 * /admin/tickets/{id}:
 *   put:
 *     summary: Update a ticket category
 *     tags: [Admin Tickets]
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
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               quota:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Ticket category updated
 */
r.put("/:id", auth, authAdmin, ctrl.adminUpdateTicket);

/**
 * @swagger
 * /admin/tickets/{id}:
 *   delete:
 *     summary: Delete a ticket category
 *     tags: [Admin Tickets]
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
 *         description: Ticket category deleted
 */
r.delete("/:id", auth, authAdmin, ctrl.adminDeleteTicket);

export default r;
