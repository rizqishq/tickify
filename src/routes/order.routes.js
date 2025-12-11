import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { createOrder, ordersHistory, payOrder, getOrder, cancelOrder } from "../controllers/order.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { validateCreateOrder } from "../validators/order.validator.js";

const r = Router();

r.use(auth);

r.post("/", validate(validateCreateOrder), createOrder);
r.post("/:id/pay", payOrder);
r.get("/", ordersHistory);
r.get("/:id", getOrder);
r.put("/:id/cancel", cancelOrder);

export default r;
