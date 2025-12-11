import nodemailer from 'nodemailer';

let transporter;

// Initialize Transporter (Lazy load)
const getTransporter = async () => {
    if (transporter) return transporter;

    if (process.env.SMTP_HOST) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    } else {
        // Test Account (Ethereal)
        console.log("No SMTP Config found. Creating Ethereal Test Account...");
        const testAccount = await nodemailer.createTestAccount();

        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });

        console.log("📧 Ethereal Email Ready!");
        console.log(`📧 Preview URL: https://ethereal.email/login`);
        console.log(`📧 User: ${testAccount.user}`);
        console.log(`📧 Pass: ${testAccount.pass}`);
    }
    return transporter;
};

export const EmailService = {
    sendEmail: async (to, subject, html) => {
        try {
            const transport = await getTransporter();
            const info = await transport.sendMail({
                from: '"Tickify System" <no-reply@tickify.com>',
                to,
                subject,
                html,
            });

            console.log(`Message sent: ${info.messageId}`);
            // Preview only available when using Ethereal
            if (!process.env.SMTP_HOST) {
                console.log(`📧 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
            }
            return info;
        } catch (error) {
            console.error("Error sending email", error);
            return null;
        }
    },

    sendTicketEmail: async (order, userEmail = "customer@example.com") => {
        const subject = `Your Ticket for Order #${order.id.slice(0, 8)}`;
        const html = `
            <h1>Order Confirmed!</h1>
            <p>Thank you for your purchase.</p>
            <p><strong>Order ID:</strong> ${order.id}</p>
            <p><strong>Total:</strong> Rp ${parseFloat(order.total_price).toLocaleString()}</p>
            <hr/>
            <h3>Tickets:</h3>
            <ul>
                ${order.items.map(item => `<li>${item.quantity}x ${item.category_name || 'Ticket'} (${item.event_title || 'Event'})</li>`).join('')}
            </ul>
            <p>Show this email at the entrance.</p>
        `;
        return await EmailService.sendEmail(userEmail, subject, html);
    },

    sendCancellationEmail: async (order, userEmail = "customer@example.com") => {
        const subject = `Order Cancelled: #${order.id.slice(0, 8)}`;
        const html = `
            <h1>Order Cancelled</h1>
            <p>Your order #${order.id} has been cancelled.</p>
            <p>If this was a mistake, please book again.</p>
        `;
        return await EmailService.sendEmail(userEmail, subject, html);
    }
};
