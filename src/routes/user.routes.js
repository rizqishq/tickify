import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { uploadProfilePicture, removeProfilePicture, updateProfile, getMe, changePassword } from "../controllers/user.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const r = Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User profile management
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 */
r.get("/me", auth, getMe);

/**
 * @swagger
 * /users/profile-picture:
 *   patch:
 *     summary: Upload profile picture
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile picture updated
 */
r.patch("/profile-picture", auth, upload.single("file"), uploadProfilePicture);

/**
 * @swagger
 * /users/profile-picture:
 *   delete:
 *     summary: Remove profile picture
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile picture removed
 */
r.delete("/profile-picture", auth, removeProfilePicture);

/**
 * @swagger
 * /users/profile:
 *   patch:
 *     summary: Update profile details
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 */
r.patch("/profile", auth, updateProfile);

/**
 * @swagger
 * /users/change-password:
 *   patch:
 *     summary: Change password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
r.patch("/change-password", auth, changePassword);

export default r;
