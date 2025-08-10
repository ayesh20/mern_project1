import express from 'express';
import { createUser, getUser, loginuser } from '../controllers/userController.js';

const userRouter = express.Router();
userRouter.post("/",createUser)
userRouter.get("/",getUser)
userRouter.post("/login", loginuser)

export default userRouter;