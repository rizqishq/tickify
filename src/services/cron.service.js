import cron from 'node-cron';
import { OrderRepository } from '../repositories/order.repository.js';
import { OrderService } from './order.service.js';

export const initCron = () => {
    // Run every 15 minutes
    cron.schedule('*/15 * * * *', async () => {
        console.log('Running automated order cleanup...');
        try {
            const cutoffDate = new Date(Date.now() - 60 * 60 * 1000);

            const expiredOrders = await OrderRepository.findExpiredPendingOrders(cutoffDate);

            if (expiredOrders.length > 0) {
                console.log(`Found ${expiredOrders.length} expired orders. Cancelling...`);

                for (const order of expiredOrders) {
                    try {
                        console.log(`Needs cancellation: Order #${order.id}`);

                        await OrderService.systemCancelOrder(order.id);

                    } catch (err) {
                        console.error(`Failed to auto-cancel order ${order.id}`, err);
                    }
                }
            } else {
                console.log('No expired orders found.');
            }
        } catch (error) {
            console.error('Error in cron job:', error);
        }
    });

    console.log('Cron jobs initialized.');
};
