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
