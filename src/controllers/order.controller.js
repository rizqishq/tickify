import { OrderService } from "../services/order.service.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { StatusCodes } from "http-status-codes";

export const createOrder = asyncWrapper(async (req, res) => {
    const result = await OrderService.createOrder(req.user.id, req.body.items);
    res.status(StatusCodes.CREATED).json(result);
});

export const ordersHistory = asyncWrapper(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await OrderService.getUserOrders(req.user.id, req.query.status, page, limit);
    res.json(result);
});

export const payOrder = asyncWrapper(async (req, res) => {
    const result = await OrderService.payOrder(req.params.id, req.user.id);
    res.json(result);
});

export const getOrder = asyncWrapper(async (req, res) => {
    const order = await OrderService.getOrder(req.params.id, req.user.id);
    res.json(order);
});

export const cancelOrder = asyncWrapper(async (req, res) => {
    const result = await OrderService.cancelOrder(req.params.id, req.user.id);
    res.json(result);
});
