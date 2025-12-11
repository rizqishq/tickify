import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { createOrder, ordersHistory, payOrder, getOrder, cancelOrder } from "../controllers/order.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { validateCreateOrder } from "../validators/order.validator.js";

const r = Router();

r.use(auth);

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order processing and management
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     category_id:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Order created
 *       400:
 *         description: Invalid input or insufficient quota
 */
r.post("/", validate(validateCreateOrder), createOrder);

/**
 * @swagger
 * /orders/{id}/pay:
 *   post:
 *     summary: Pay for an order (Redirects to Xendit)
 *     tags: [Orders]
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
 *         description: Payment invoice generated
 */
r.post("/:id/pay", payOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get transaction history
 *     tags: [Orders]
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, paid, cancelled]
 *     responses:
 *       200:
 *         description: List of user orders
 */
r.get("/", ordersHistory);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order details
 *     tags: [Orders]
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
 *         description: Order details with items
 *       404:
 *         description: Order not found
 */
r.get("/:id", getOrder);

/**
 * @swagger
 * /orders/{id}/cancel:
 *   put:
 *     summary: Cancel a pending order
 *     tags: [Orders]
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
 *         description: Order cancelled successfully
 *       400:
 *         description: Order cannot be cancelled (not pending)
 */
r.put("/:id/cancel", cancelOrder);

export default r;
