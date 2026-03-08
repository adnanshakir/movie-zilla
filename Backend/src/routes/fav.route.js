import { Router } from "express";
import { addFavorites, removeFavorites, getFavorites } from "../controllers/fav.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const favRouter = Router();

favRouter.post("/add/:movieId", authUser, addFavorites);
favRouter.get("/get", authUser, getFavorites);
favRouter.delete("/remove/:movieId", authUser, removeFavorites);

export default favRouter;
