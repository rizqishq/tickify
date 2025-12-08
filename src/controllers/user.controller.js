import { UserService } from "../services/user.service.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { StatusCodes } from "http-status-codes";

export const uploadProfilePicture = asyncWrapper(async (req, res) => {
    console.log("Upload Request File:", req.file); // DEBUG LOG
    const result = await UserService.updateProfilePicture(req.user.id, req.file);
    res.status(StatusCodes.OK).json(result);
});

export const removeProfilePicture = asyncWrapper(async (req, res) => {
    await UserService.removeProfilePicture(req.user.id);
    res.json({ message: "Profile picture removed" });
});

export const updateProfile = asyncWrapper(async (req, res) => {
    const result = await UserService.updateDetails(req.user.id, req.body);
    res.json(result);
});

export const changePassword = asyncWrapper(async (req, res) => {
    const { old_password, new_password, confirm_new_password } = req.body;

    if (new_password !== confirm_new_password) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Passwords do not match" });
    }

    await UserService.changePassword(req.user.id, old_password, new_password);
    res.json({ message: "Password updated successfully" });
});

export const getMe = asyncWrapper(async (req, res) => {
    const user = await UserService.getUser(req.user.id);
    res.json(user);
});

export const listUsers = asyncWrapper(async (req, res) => {
    const users = await UserService.listUsers();
    res.json(users);
});
