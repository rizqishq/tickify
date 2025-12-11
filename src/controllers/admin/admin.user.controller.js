import { UserService } from "../../services/user.service.js";
import { asyncWrapper } from "../../utils/asyncWrapper.js";

export const adminListUsers = asyncWrapper(async (req, res) => {
    const users = await UserService.listUsers();
    res.json(users);
});

export const adminGetUser = asyncWrapper(async (req, res) => {
    const user = await UserService.getUser(req.params.id);
    res.json(user);
});

export const adminCreateUser = asyncWrapper(async (req, res) => {
    const user = await UserService.createUser(req.body);
    res.status(201).json(user);
});

export const adminUpdateUser = asyncWrapper(async (req, res) => {
    const user = await UserService.adminUpdateUser(req.params.id, req.body);
    res.json(user);
});

export const adminDeleteUser = asyncWrapper(async (req, res) => {
    await UserService.deleteUser(req.params.id);
    res.json({ message: "User deleted successfully" });
});
