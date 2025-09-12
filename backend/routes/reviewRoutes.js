const express = require('express');
const router = express.Router();
const { getReviews, submitReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:movieId')
  .get(getReviews)
  .post(protect, submitReview);

router.route('/delete/:id')
  .delete(protect, deleteReview); // Only user who submitted can delete

module.exports = router;
