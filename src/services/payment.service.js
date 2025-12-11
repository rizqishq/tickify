import { Xendit } from "xendit-node";
import dotenv from "dotenv";

dotenv.config();

console.log("Xendit Key Loaded:", process.env.XENDIT_SECRET_KEY ? process.env.XENDIT_SECRET_KEY.substring(0, 8) + "..." : "UNDEFINED");

const x = new Xendit({
    secretKey: process.env.XENDIT_SECRET_KEY,
});

export class PaymentService {
    static async createInvoice(externalId, amount, payerEmail, description, successRedirectUrl, failureRedirectUrl) {
        try {
            // Ensure amount is a number
            const amountNum = parseFloat(amount);
            if (isNaN(amountNum)) throw new Error("Invalid amount");

            const resp = await x.Invoice.createInvoice({
                data: {
                    externalId: externalId.toString(),
                    amount: amountNum,
                    payerEmail: payerEmail,
                    description: description,
                    invoiceDuration: 86400,
                    successRedirectUrl: successRedirectUrl,
                    failureRedirectUrl: failureRedirectUrl,
                    currency: "IDR"
                }
            });

            console.log("Xendit Invoice Response:", JSON.stringify(resp, null, 2));

            const invoiceUrl = resp.invoiceUrl || resp.invoice_url;

            return {
                invoice_url: invoiceUrl,
                id: resp.id,
                status: resp.status
            };
        } catch (error) {
            console.error("Xendit Create Invoice Error:", error);
            if (error.response) {
                console.error("Xendit Response Body:", JSON.stringify(error.response, null, 2));
            }
            throw new Error("Failed to create payment invoice: " + error.message);
        }
    }

    static async getInvoice(orderId) {
        try {
            console.log("Checking Xendit status for Order ID (External ID):", orderId);
            // Since we stored Order ID as externalId, we search for that.
            const resp = await x.Invoice.getInvoices({
                externalId: orderId.toString()
            });

            // getInvoices returns a list. We take the most recent one.
            if (resp && resp.length > 0) {
                return resp[0];
            }
            return null;
        } catch (error) {
            console.error("Xendit Get Invoice Error:", error);
            return null;
        }
    }
}

