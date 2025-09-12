const express = require('express');
const router = express.Router();
const { getReviews, submitReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:movieId').get(getReviews).post(protect, submitReview);

module.exports = router;
