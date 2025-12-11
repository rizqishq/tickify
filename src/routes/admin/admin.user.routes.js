import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { authAdmin } from "../../middlewares/authAdmin.js";
import * as ctrl from "../../controllers/admin/admin.user.controller.js";

const r = Router();

/**
 * @swagger
 * tags:
 *   name: Admin Users
 *   description: User management for admins
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: List all users
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
r.get("/", auth, authAdmin, ctrl.adminListUsers);

/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     summary: Get user details (Admin)
 *     tags: [Admin Users]
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
 *         description: User details
 */
r.get("/:id", auth, authAdmin, ctrl.adminGetUser);

export default r;
