import { TicketCategoryRepository } from "../repositories/ticket_category.repository.js";
import { TicketRepository } from "../repositories/ticket.repository.js";
import { generateQrDataUri } from "../utils/qr.js";

export class TicketService {
    static async listTicketCategories(eventId) {
        return TicketCategoryRepository.findByEventId(eventId);
    }

    static async getUserTickets(userId, page = 1, limit = 6) {
        const offset = (page - 1) * limit;
        const result = await TicketRepository.findByUserId(userId, limit, offset);

        const ticketsWithQr = await Promise.all(result.data.map(async (t) => ({
            ...t,
            qr_code: await generateQrDataUri(t.ticket_code)
        })));

        return {
            data: ticketsWithQr,
            pagination: result.pagination
        };
    }

    static async getTicketById(id) {
        const ticket = await TicketRepository.findById(id);
        if (!ticket) throw new Error("Ticket not found");
        return {
            ...ticket,
            qr_code: await generateQrDataUri(ticket.ticket_code)
        };
    }

    static async createCategory(data) {
        return TicketCategoryRepository.create(data);
    }

    static async updateCategory(id, data) {
        return TicketCategoryRepository.update(id, data);
    }

    static async deleteCategory(id) {
        return TicketCategoryRepository.delete(id);
    }
}
