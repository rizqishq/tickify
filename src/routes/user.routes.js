import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { uploadProfilePicture, removeProfilePicture, updateProfile, getMe, changePassword } from "../controllers/user.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const r = Router();

r.get("/me", auth, getMe);
r.patch("/profile-picture", auth, upload.single("file"), uploadProfilePicture);
r.delete("/profile-picture", auth, removeProfilePicture);
r.patch("/profile", auth, updateProfile);
r.patch("/change-password", auth, changePassword);

export default r;
