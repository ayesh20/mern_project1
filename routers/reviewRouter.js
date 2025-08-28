import express from 'express';
import { addReview, getProductReviews } from '../controllers/reviewcontroller.js';

const reviewRouter = express.Router();

reviewRouter.post("/", addReview);
reviewRouter.get("/product/:productName", getProductReviews);

export default reviewRouter;