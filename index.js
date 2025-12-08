import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";

import helmet from "helmet";
import morgan from "morgan";

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
}));

// Public Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/api/health", (req, res) => res.json({ ok: true, message: "Ticketing backend" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});