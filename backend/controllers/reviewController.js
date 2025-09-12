const Review = require('../models/Review');
const { updateMovieRating } = require('./movieController');
const Movie = require('../models/Movie'); 

// @desc    Get reviews for a movie
// @route   GET /api/reviews/:movieId
// @access  Public
const getReviews = async (req, res) => {
  const reviews = await Review.find({ movieId: req.params.movieId }).populate('userId', 'username');
  res.json(reviews);
};

// @desc    Submit review for a movie
// @route   POST /api/reviews/:movieId
// @access  Private
const submitReview = async (req, res) => {
  const { rating, reviewText } = req.body;
  const movieId = req.params.movieId;

  const review = new Review({
    userId: req.user.id,
    movieId,
    rating,
    reviewText,
  });

  const createdReview = await review.save();
  await updateMovieRating(movieId);
  res.status(201).json(createdReview);
};

// @desc    Delete a review (only owner can delete)
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
  try {
    console.log('=== DELETE /api/reviews/:id called ===');
    console.log('Review ID to delete:', req.params.id);
    console.log('Current user ID:', req.user.id);

    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    console.log('Review found. User ID:', review.userId.toString());
    console.log('Current user ID (string):', req.user.id.toString());

    // Only review owner can delete - use req.user.id instead of req.user._id
    if (req.user.id.toString() !== review.userId.toString()) {
      console.log('Authorization failed - user IDs do not match');
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    // Use findByIdAndDelete instead of remove()
    await Review.findByIdAndDelete(req.params.id);
    console.log('Review deleted successfully');

    // Update movie average rating after deletion
    await updateMovieRating(review.movieId);

    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.error('Error in deleteReview:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
module.exports = { getReviews, submitReview , deleteReview };
