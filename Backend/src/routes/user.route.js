import { Router } from "express";
import { getProfile, getFavorites, getHistory } from "../controllers/user.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.get("/profile", authUser, getProfile);
userRouter.get("/favorites", authUser, getFavorites);
userRouter.get("/history", authUser, getHistory);

export default userRouter;
