const express = require('express');
const { addReview, getUserReviews, getAllReviews } = require('../controller/review');
const router = express.Router();

router.post('/review',addReview);

router.get('/review/:userId',getUserReviews);

router.get('/allreview',getAllReviews);

module.exports = router;
