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


module.exports = { getReviews, submitReview };
