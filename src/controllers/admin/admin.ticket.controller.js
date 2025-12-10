import { TicketService } from "../../services/ticket.service.js";
import { asyncWrapper } from "../../utils/asyncWrapper.js";
import { StatusCodes } from "http-status-codes";

export const adminCreateTicket = asyncWrapper(async (req, res) => {
    const ticket = await TicketService.createCategory(req.body);
    res.status(StatusCodes.CREATED).json(ticket);
});

export const adminUpdateTicket = asyncWrapper(async (req, res) => {
    const ticket = await TicketService.updateCategory(req.params.id, req.body);
    if (!ticket) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Ticket Category not found" });
    }
    res.json(ticket);
});

export const adminDeleteTicket = asyncWrapper(async (req, res) => {
    await TicketService.deleteCategory(req.params.id);
    res.json({ message: "deleted" });
});
