const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    comment: {
        type: String,
        required: true,
        maxlength: 500
    }
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
