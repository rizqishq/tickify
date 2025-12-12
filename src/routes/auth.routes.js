import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { validateRegister, validateLogin } from "../validators/auth.validator.js";

const r = Router();




r.post("/register", validate(validateRegister), register);


r.post("/login", validate(validateLogin), login);

export default r;