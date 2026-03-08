import { Router } from "express";
import { addHistory, removeHistory, getHistory } from "../controllers/history.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const historyRouter = Router();

historyRouter.post("/add/:movieId", authUser, addHistory);
historyRouter.get("/get", authUser, getHistory);
historyRouter.delete("/remove/:movieId", authUser, removeHistory);

export default historyRouter;