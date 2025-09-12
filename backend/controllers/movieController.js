const Movie = require('../models/Movie');
const Review = require('../models/Review');

// @desc    Get all movies with filters
// @route   GET /api/movies
// @access  Public
const getMovies = async (req, res) => {
  const { genre, year, rating, search, page = 1, limit = 10 } = req.query;

  const query = {};
  if (genre) query.genre = { $in: [genre] };
  if (year) query.releaseYear = year;
  if (rating) query.averageRating = { $gte: rating };
  if (search) query.title = { $regex: search, $options: 'i' };

  const movies = await Movie.find(query)
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.json(movies);
};

// @desc    Get movie by ID with reviews
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (movie) {
    const reviews = await Review.find({ movieId: movie._id }).populate('userId', 'username');
    res.json({ movie, reviews });
  } else {
    res.status(404);
    throw new Error('Movie not found');
  }
};

// @desc    Add a new movie (Admin only)
// @route   POST /api/movies
// @access  Private/Admin
const addMovie = async (req, res) => {
  const movie = new Movie(req.body);
  const createdMovie = await movie.save();
  res.status(201).json(createdMovie);
};

// @desc    Update average rating for a movie
const updateMovieRating = async (movieId) => {
  const reviews = await Review.find({ movieId });
  const avgRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / (reviews.length || 1);
  await Movie.findByIdAndUpdate(movieId, { averageRating: avgRating });
};

module.exports = { getMovies, getMovieById, addMovie, updateMovieRating };
