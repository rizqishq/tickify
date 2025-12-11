import { Router } from "express";
import { listTicketsByEvent, myTickets, getTicket } from "../controllers/ticket.controller.js";
import { auth } from "../middlewares/auth.js";

const r = Router();

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Ticket retrieval and management
 */

/**
 * @swagger
 * /tickets/event/{eventId}:
 *   get:
 *     summary: List tickets for a specific event (Public)
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of available tickets for event
 */
r.get("/event/:eventId", listTicketsByEvent);

/**
 * @swagger
 * /tickets/mine:
 *   get:
 *     summary: Get my tickets
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of user tickets
 */
r.get("/mine", auth, myTickets);

/**
 * @swagger
 * /tickets/{id}:
 *   get:
 *     summary: Get ticket details
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket details with QR Code
 */
r.get("/:id", auth, getTicket);

export default r;
