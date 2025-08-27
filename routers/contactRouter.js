// routes/contactRouter.js
import express from 'express';
import { createContact } from '../controllers/contactuscontroller.js';

const contactRouter = express.Router();

contactRouter.post("/", createContact);

export default contactRouter;
