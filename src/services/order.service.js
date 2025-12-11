import { pool } from "../config/db.js";
import { OrderRepository } from "../repositories/order.repository.js";
import { TicketCategoryRepository } from "../repositories/ticket_category.repository.js";
import { TicketRepository } from "../repositories/ticket.repository.js";
import { UserRepository } from "../repositories/user.repository.js";
import { PaymentService } from "./payment.service.js";
import { generateTicketCode, generateQrDataUri } from "../utils/qr.js";
import { StatusCodes } from "http-status-codes";

export class OrderService {
    static async createOrder(userId, items) {
        if (!items || items.length === 0) {
            throw new Error("No items provided");
        }

        const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Calculate Total and Lock Quotas
            let total = 0;
            const categoryMap = new Map();

            for (const item of items) {
                const category = await TicketCategoryRepository.findByIdForUpdate(item.category_id, client);
                if (!category) {
                    const err = new Error(`Category ${item.category_id} not found`);
                    err.statusCode = StatusCodes.NOT_FOUND;
                    throw err;
                }
                if (category.quota < item.quantity) {
                    const err = new Error(`Not enough quota for category ${category.id}`);
                    err.statusCode = StatusCodes.BAD_REQUEST;
                    throw err;
                }

                total += parseFloat(category.price) * item.quantity;
                categoryMap.set(item.category_id, category);
            }

            // Create Order
            const order = await OrderRepository.create({
                user_id: userId,
                total_price: total,
                status: 'pending'
            }, client);

            const createdTickets = [];

            // Create Items, Update Quota, Generate Tickets
            for (const item of items) {
                const category = categoryMap.get(item.category_id);
                const subtotal = parseFloat(category.price) * item.quantity;

                // Order Item
                const orderItem = await OrderRepository.createItem({
                    order_id: order.id,
                    category_id: item.category_id,
                    quantity: item.quantity,
                    price_each: category.price,
                    subtotal
                }, client);

                // Update Quota
                await TicketCategoryRepository.updateQuota(item.category_id, item.quantity, client);

                // Generate Tickets
                for (let i = 0; i < item.quantity; i++) {
                    const ticket = await TicketRepository.create({
                        order_item_id: orderItem.id,
                        user_id: userId,
                        category_id: item.category_id,
                        ticket_code: generateTicketCode()
                    }, client);

                    const ticketWithQr = {
                        ...ticket,
                        qr_code: await generateQrDataUri(ticket.ticket_code)
                    };
                    createdTickets.push(ticketWithQr);
                }
            }

            await client.query("COMMIT");
            return { order, tickets: createdTickets };

        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    static async getUserOrders(userId, status) {
        const orders = await OrderRepository.findByUserId(userId, status);

        const updates = orders.map(async (order) => {
            if (order.status === 'pending') {
                try {
                    const invoice = await PaymentService.getInvoice(order.id);
                    if (invoice && (invoice.status === 'PAID' || invoice.status === 'SETTLED')) {
                        await OrderRepository.updateStatus(order.id, 'paid');
                        order.status = 'paid';
                    }
                } catch (e) {
                    console.error(`Failed to sync order ${order.id}`, e);
                }
            }
        });

        await Promise.all(updates);

        return orders;
    }

    static async payOrder(orderId, userId) {
        const order = await OrderRepository.findById(orderId);
        if (!order) {
            const error = new Error("Order not found");
            error.statusCode = StatusCodes.NOT_FOUND;
            throw error;
        }

        if (order.user_id !== userId) {
            const error = new Error("Unauthorized access to order");
            error.statusCode = StatusCodes.FORBIDDEN;
            throw error;
        }

        if (order.status === 'paid') {
            return order; // Already paid
        }

        const user = await UserRepository.findById(userId);

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const successRedirectUrl = `${frontendUrl}/my-tickets`; // Redirect to tickets after payment
        const failureRedirectUrl = `${frontendUrl}/orders/${order.id}`;

        const invoice = await PaymentService.createInvoice(
            order.id,
            order.total_price,
            user.email,
            `Payment for Order #${order.id}`,
            successRedirectUrl,
            failureRedirectUrl
        );

        return invoice;
    }

    static async getOrder(orderId, userId) {
        let order = await OrderRepository.findById(orderId);
        if (!order) {
            const error = new Error("Order not found");
            error.statusCode = StatusCodes.NOT_FOUND;
            throw error;
        }

        if (order.user_id !== userId) {
            const error = new Error("Unauthorized access to order");
            error.statusCode = StatusCodes.FORBIDDEN;
            throw error;
        }

        // Lazy Sync: If pending, check Xendit
        if (order.status === 'pending') {
            try {
                const invoice = await PaymentService.getInvoice(orderId);
                if (invoice && (invoice.status === 'PAID' || invoice.status === 'SETTLED')) {
                    // Update DB
                    await OrderRepository.updateStatus(orderId, 'paid');
                    // Update local object
                    order.status = 'paid';
                }
            } catch (err) {
                console.error("Failed to sync payment status:", err);
                // Ignore error, just return pending
            }
        }

        return order;
    }
}
