import express from 'express';
import { createUser, getUsers, loginuser } from '../controllers/userController.js';

const userRouter = express.Router();
userRouter.post("/register",createUser)
userRouter.get("/:page/:limit", getUsers);
userRouter.post("/login", loginuser)

export default userRouter;