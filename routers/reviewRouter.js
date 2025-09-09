import express from 'express';
import { addReview, getProductReviews,getAllReviews } from '../controllers/reviewcontroller.js';

const reviewRouter = express.Router();

reviewRouter.post("/", addReview);
reviewRouter.get("/", getAllReviews); 
reviewRouter.get("/product/:productName", getProductReviews);

export default reviewRouter;