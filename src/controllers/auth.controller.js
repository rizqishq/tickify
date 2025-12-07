import { AuthService } from "../services/auth.service.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { StatusCodes } from "http-status-codes";

export const register = asyncWrapper(async (req, res) => {
    const result = await AuthService.register(req.body);
    res.status(StatusCodes.CREATED).json(result);
});

export const login = asyncWrapper(async (req, res) => {
    const result = await AuthService.login(req.body);
    res.status(StatusCodes.OK).json(result);
});
