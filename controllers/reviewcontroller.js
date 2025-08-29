import Review from "../models/review.js";
import jwt from 'jsonwebtoken';

// Helper function to extract user from token
function getUserFromToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        throw new Error('Invalid token');
    }
}

// Add a new review (extract user from token in request body or header)
export async function addReview(req, res) {
    try {
        const { productName, rating, title, review } = req.body;
        const authHeader = req.headers.authorization;
        
        // Check for token
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                message: "Please login to submit a review" 
            });
        }

        const token = authHeader.substring(7);
        let user;
        
        // Verify token and get user info
        try {
            user = getUserFromToken(token);
        } catch (error) {
            return res.status(401).json({ 
                message: "Session expired. Please login again" 
            });
        }
        
        // Validation
        if (!productName || !rating || !title || !review) {
            return res.status(400).json({ 
                message: "All fields are required" 
            });
        }

        // Validate rating is between 1-5
        const numericRating = parseInt(rating);
        if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
            return res.status(400).json({ 
                message: "Rating must be between 1 and 5" 
            });
        }

        // Create new review (mapping 'review' from frontend to 'details' in backend)
        const newReview = new Review({
            productName: productName.trim(),
            rating: numericRating.toString(),
            title: title.trim(),
            details: review.trim() // Frontend sends 'review', backend saves as 'details'
        });

        const savedReview = await newReview.save();

        res.status(201).json({
            message: "Review added successfully!",
            reviewId: savedReview._id
        });

    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ 
            message: "Failed to submit review. Please try again." 
        });
    }
}

export async function getProductReviews(req, res) {
    try {
        const productName = req.params.productName;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        if (!productName) {
            return res.status(400).json({ message: "Product name is required" });
        }

        // Get reviews for specific product
        const reviews = await Review.find({ 
            productName: { $regex: new RegExp(productName, 'i') }
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .select('-__v');

        if (reviews.length === 0) {
            return res.status(404).json({ message: "No reviews found for this product" });
        }

        const totalReviews = await Review.countDocuments({ 
            productName: { $regex: new RegExp(productName, 'i') } 
        });
        const totalPages = Math.ceil(totalReviews / limit);

        // Calculate average rating
        const ratingStats = await Review.aggregate([
            { $match: { productName: { $regex: new RegExp(productName, 'i') } } },
            { 
                $group: { 
                    _id: null, 
                    avgRating: { $avg: { $toDouble: "$rating" } },
                    totalReviews: { $sum: 1 }
                } 
            }
        ]);

        const averageRating = ratingStats.length > 0 ? ratingStats[0].avgRating : 0;

        res.json({
            message: "Product reviews retrieved successfully!",
            reviews,
            productName,
            averageRating: Math.round(averageRating * 10) / 10,
            pagination: {
                currentPage: page,
                totalPages,
                totalReviews,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error("Error fetching product reviews:", error);
        res.status(500).json({ message: "Failed to retrieve product reviews" });
    }
}