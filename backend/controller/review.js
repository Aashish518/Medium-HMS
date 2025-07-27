const Review = require('../schema/review');
const User = require('../schema/user');

exports.addReview = async (req, res) => {
    try {
        const { userId, comment } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const existingReview = await Review.findOne({ userId });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already added a review' });
        }

        const review = new Review({ userId, comment });
        await review.save();

        res.status(201).json({ message: 'Review added successfully', review });
    } catch (err) {
        console.error('Error in addReview:', err);
        res.status(500).json({ message: 'Error adding review', error: err.message });
    }
};

exports.getUserReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ userId: req.params.userId })
            .populate('userId', 'full_name');

        res.json(reviews);
    } catch (err) {
        console.error('Error in getUserReviews:', err);
        res.status(500).json({ message: 'Error fetching user reviews', error: err.message });
    }
};


exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('userId', 'full_name');

        res.json(reviews);
    } catch (err) {
        console.error('Error in getAllReviews:', err);
        res.status(500).json({ message: 'Error fetching all reviews', error: err.message });
    }
};