import express from "express";
import dotenv from "dotenv";
dotenv.config();

import morgan from "morgan";
import authRoutes from "./src/routes/auth.routes.js";
import { StatusCodes } from "http-status-codes";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => res.json({ ok: true, message: "Ticketing backend" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});