import { TicketCategoryRepository } from "../repositories/ticket_category.repository.js";
import { TicketRepository } from "../repositories/ticket.repository.js";

export class TicketService {
    static async listTicketCategories(eventId) {
        return TicketCategoryRepository.findByEventId(eventId);
    }

    static async getUserTickets(userId) {
        return TicketRepository.findByUserId(userId);
    }

    static async getTicketById(id) {
        const ticket = await TicketRepository.findById(id);
        if (!ticket) throw new Error("Ticket not found");
        return ticket;
    }

    // Admin Methods
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
