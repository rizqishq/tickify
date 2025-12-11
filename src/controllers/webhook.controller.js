import { OrderRepository } from "../repositories/order.repository.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";

export const handleXenditWebhook = asyncWrapper(async (req, res) => {
    const { external_id, status } = req.body;

    console.log(`Received Xendit Webhook. Order: ${external_id}, Status: ${status}`);

    if (status === 'PAID' || status === 'SETTLED') {
        const orderId = external_id;
        try {
            await OrderRepository.updateStatus(orderId, 'paid');
            console.log(`Order ${orderId} marked as PAID`);
        } catch (error) {
            console.error(`Failed to update order ${orderId}:`, error);
            throw error;
        }
    }

    res.json({ received: true });
});
