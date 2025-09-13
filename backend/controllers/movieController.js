const Movie = require('../models/Movie');
const Review = require('../models/Review');

// @desc    Get all movies with filters
// @route   GET /api/movies
const getMovies = async (req, res) => {
  try {
    const { genre, year, rating, search, page = 1, limit = 10 } = req.query;

    console.log('=== GET /api/movies called ===');
    console.log('Query params:', req.query);

    const query = {};
    if (genre) query.genre = { $in: [genre] };
    if (year) query.releaseYear = parseInt(year);
    if (rating) query.averageRating = { $gte: parseFloat(rating) };
    if (search) query.title = { $regex: search, $options: 'i' };

    console.log('MongoDB query:', query);

    const movies = await Movie.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 }); // Add sorting

    console.log('Found movies:', movies.length);
    console.log('Movie IDs:', movies.map(m => m._id));
    
    res.json(movies);
  } catch (error) {
    console.error('Error in getMovies:', error);
    res.status(500).json({ error: error.message });
  }
};

const addMovie = async (req, res) => {
  try {
    console.log('=== POST /api/movies called ===');
    console.log('Request body:', req.body);
    console.log('User making request:', req.user._id); // Add this for debugging

    const { title, genre, releaseYear, director, cast, synopsis, posterUrl } = req.body;

    const isValidUrl = posterUrl ? /^https?:\/\/.+$/i.test(posterUrl) : true;
    if (!isValidUrl) return res.status(400).json({ message: 'Invalid poster URL' });

    const movie = new Movie({ 
      title, 
      genre, 
      releaseYear, 
      director, 
      cast, 
      synopsis, 
      posterUrl,
      addedBy: req.user._id // This should come from req.user, not req.body
    });
    
    const createdMovie = await movie.save();
    
    console.log('Movie saved successfully:', createdMovie._id);
    console.log('Added by user:', createdMovie.addedBy);
    
    res.status(201).json(createdMovie);
  } catch (err) {
    console.error('Error in addMovie:', err);
    res.status(500).json({ message: err.message });
  }
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



// @desc    Update average rating for a movie
const updateMovieRating = async (movieId) => {
  const reviews = await Review.find({ movieId });
  const avgRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / (reviews.length || 1);
  await Movie.findByIdAndUpdate(movieId, { averageRating: avgRating });
};

module.exports = { getMovies, getMovieById, addMovie, updateMovieRating  };
