import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import favRouter from "./routes/fav.route.js";
import historyRouter from "./routes/history.route.js";
import userRouter from "./routes/user.route.js";
import { globalErrorHandler } from "./middleware/error.middleware.js";

const app = express();

// CORS must be first — before body parsers — so every response
// (including error responses) carries the correct CORS headers.
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
};

console.log("FRONTEND_URL:", process.env.FRONTEND_URL);

app.use(cors(corsOptions));
app.options("/*", cors());

// Body parsers after CORS
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/favorites", favRouter);
app.use("/api/history", historyRouter);
app.use("/api/user", userRouter);

// Global error handler (must be last)
app.use(globalErrorHandler);

export default app;