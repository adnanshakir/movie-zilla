import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { authUser } from "../middleware/auth.middleware.js";
import { validateRegister, validateLogin } from "../middleware/validation.middleware.js";

const authRouter = Router();

authRouter.post("/register", validateRegister, authController.registerUser);
authRouter.post("/login", validateLogin, authController.loginUser);
authRouter.get("/get-me", authUser, authController.getMe);
authRouter.post("/logout", authController.logoutUser);

export default authRouter;