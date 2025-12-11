import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from 'swagger-ui-express';
import { specs } from './src/config/swagger.js';
dotenv.config();

import authRoutes from "./src/routes/auth.routes.js";
import eventRoutes from "./src/routes/event.routes.js";
import ticketRoutes from "./src/routes/ticket.routes.js";
import orderRoutes from "./src/routes/order.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import webhookRoutes from "./src/routes/webhook.routes.js";
import adminEventRoutes from "./src/routes/admin/admin.event.routes.js";
import adminTicketRoutes from "./src/routes/admin/admin.ticket.routes.js";
import adminUserRoutes from "./src/routes/admin/admin.user.routes.js";
import { initCron } from "./src/services/cron.service.js";

import helmet from "helmet";
import morgan from "morgan";

import { errorHandler } from "./src/middlewares/error.middleware.js";

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cors({
    origin: [
        'https://tickify-app.vercel.app',
        'http://localhost:3000',
        'http://localhost:5173'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
}));

// Public Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/webhooks", webhookRoutes);

// Admin Routes
app.use("/api/admin/events", adminEventRoutes);
app.use("/api/admin/tickets", adminTicketRoutes);
app.use("/api/admin/users", adminUserRoutes);

initCron();

app.use(errorHandler);

app.get("/api/health", (req, res) => res.json({ ok: true, message: "Ticketing backend" }));

const swaggerOptions = {
    customCssUrl: 'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css',
    customJs: [
        'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js',
        'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js'
    ]
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});