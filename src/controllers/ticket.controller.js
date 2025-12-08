import { TicketService } from "../services/ticket.service.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";

export const listTicketsByEvent = asyncWrapper(async (req, res) => {
    const categories = await TicketService.listTicketCategories(req.params.eventId);
    res.json(categories);
});

export const myTickets = asyncWrapper(async (req, res) => {
    const tickets = await TicketService.getUserTickets(req.user.id);
    res.json(tickets);
});

export const getTicket = asyncWrapper(async (req, res) => {
    const ticket = await TicketService.getTicketById(req.params.id);
    // Ensure the ticket belongs to the requesting user
    if (ticket.user_id !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
    }
    res.json(ticket);
});
