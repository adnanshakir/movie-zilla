import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import favRouter from "./routes/fav.route.js";
import historyRouter from "./routes/history.route.js";
import { globalErrorHandler } from "./middleware/error.middleware.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: ["http://localhost:5173", "http://127.0.0.1:5173"] }));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/favorites", favRouter);
app.use("/api/history", historyRouter);

// Global error handler (must be last)
app.use(globalErrorHandler);

export default app;