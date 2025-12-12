import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { authAdmin } from "../../middlewares/authAdmin.js";
import * as ctrl from "../../controllers/admin/admin.user.controller.js";

const r = Router();




r.get("/", auth, authAdmin, ctrl.adminListUsers);


r.get("/:id", auth, authAdmin, ctrl.adminGetUser);


r.post("/", auth, authAdmin, ctrl.adminCreateUser);


r.put("/:id", auth, authAdmin, ctrl.adminUpdateUser);


r.delete("/:id", auth, authAdmin, ctrl.adminDeleteUser);

export default r;
