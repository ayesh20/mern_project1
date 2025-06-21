import express from 'express';
import { createUser, loginuser } from '../controllers/userController.js';

const userRouter = express.Router();
userRouter.post("/",createUser)
userRouter.post("/login", loginuser)

export default userRouter;