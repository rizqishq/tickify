import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { authAdmin } from "../../middlewares/authAdmin.js";
import * as ctrl from "../../controllers/admin/admin.ticket.controller.js";

const r = Router();




r.post("/", auth, authAdmin, ctrl.adminCreateTicket);


r.put("/:id", auth, authAdmin, ctrl.adminUpdateTicket);


r.delete("/:id", auth, authAdmin, ctrl.adminDeleteTicket);

export default r;
