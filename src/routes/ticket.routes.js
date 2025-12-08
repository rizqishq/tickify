import { Router } from "express";
import { listTicketsByEvent, myTickets, getTicket } from "../controllers/ticket.controller.js";
import { auth } from "../middlewares/auth.js";

const r = Router();

r.get("/event/:eventId", listTicketsByEvent);
r.get("/mine", auth, myTickets);
r.get("/:id", auth, getTicket);

export default r;
