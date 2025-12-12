import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { authAdmin } from "../../middlewares/authAdmin.js";
import * as ctrl from "../../controllers/admin/admin.event.controller.js";
import { getEvent } from "../../controllers/event.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { validateCreateEvent, validateUpdateEvent } from "../../validators/event.validator.js";
import { upload } from "../../middlewares/upload.middleware.js";

const r = Router();




r.post("/", auth, authAdmin, upload.single("banner"), validate(validateCreateEvent), ctrl.adminCreateEvent);


r.get("/", auth, authAdmin, ctrl.adminListEvents);


r.get("/:id", auth, authAdmin, getEvent);


r.put("/:id", auth, authAdmin, upload.single("banner"), validate(validateUpdateEvent), ctrl.adminUpdateEvent);


r.delete("/:id", auth, authAdmin, ctrl.adminDeleteEvent);

export default r;
