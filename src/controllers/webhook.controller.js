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
        try {
            const updatedOrder = await OrderRepository.updateStatus(orderId, 'paid');
            console.log(`Order ${orderId} marked as PAID`);

            // Get full order details for email
            const fullOrder = await OrderRepository.findById(orderId);
            // Ideally we get email from User Service or Order if stored.
            // For now, let's hardcode or fetch user email.
            // Assuming we don't have user email easily accessible without fetching User.
            // Let's just send to a placeholder or try to fetch user.
            // TODO: Fetch real user email.
            await EmailService.sendTicketEmail(fullOrder, "customer@example.com");

        } catch (error) {
            console.error(`Failed to update order ${orderId}:`, error);
            throw error;
        }
    }

    res.json({ received: true });
});
