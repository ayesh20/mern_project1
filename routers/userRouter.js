import express from 'express';
import { createUser, getUsers, loginuser,googleLogin,sendOTP,resetPassword } from '../controllers/userController.js';

const userRouter = express.Router();
userRouter.post("/register",createUser)
userRouter.get("/:page/:limit", getUsers);
userRouter.get("/all", getUsers);
userRouter.post("/login", loginuser);
userRouter.post("/google-login", googleLogin);
userRouter.post("/send-otp", sendOTP)
userRouter.post("/reset-password",resetPassword)

export default userRouter;