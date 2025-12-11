import { OrderRepository } from "../repositories/order.repository.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { StatusCodes } from "http-status-codes";
import { EmailService } from "../services/email.service.js";

export const handleXenditWebhook = asyncWrapper(async (req, res) => {
    const xenditToken = req.headers['x-callback-token'];

    if (xenditToken !== process.env.XENDIT_CALLBACK_TOKEN) {
        console.warn("Unauthorized webhook attempt blocked. Invalid token:", xenditToken);
        return res.status(StatusCodes.FORBIDDEN).json({ message: "Invalid Verification Token" });
    }

    const { external_id, status } = req.body;

    console.log(`Received Webhook for Order ${external_id}, Status: ${status}`);

    if (status === 'PAID' || status === 'SETTLED') {
        const orderId = external_id; // mapped correctly

        // Idempotency Check: Check if already paid
        const existingOrder = await OrderRepository.findById(orderId);
        if (!existingOrder) {
            console.error(`Order ${orderId} not found for webhook`);
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Order not found" });
        }

        if (existingOrder.status === 'paid' || existingOrder.status === 'cancelled') {
            console.log(`Order ${orderId} is already ${existingOrder.status}. Ignoring webhook.`);
            return res.json({ received: true, message: "Already processed" });
        }

        try {
            const updatedOrder = await OrderRepository.updateStatus(orderId, 'paid');
            console.log(`Order ${orderId} marked as PAID`);

            // Get full order details for email
            // Reuse existingOrder since we have it, but better refetch or just use it?
            // existingOrder has items.
            await EmailService.sendTicketEmail(existingOrder).catch(e => console.error("Failed to send email", e));

        } catch (error) {
            console.error(`Failed to update order ${orderId}:`, error);
            throw error;
        }
    }

    res.json({ received: true });
});
