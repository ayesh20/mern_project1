import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    productName: {        
        type: String,
        required: true
    },
    rating: {         
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    details: {      
        type: String,
        default: "NOT GIVEN"
    }
    
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;