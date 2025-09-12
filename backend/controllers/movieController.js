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


// @desc    Delete a movie (only admin who added it)
// @route   DELETE /api/movies/:id
// @access  Private/Admin
// controllers/movieController.js
const deleteMovie = async (req, res) => {
  try {
    console.log('=== DELETE /api/movies/:id called ===');
    console.log('Movie ID to delete:', req.params.id);
    
    // Check if user is authenticated
    if (!req.user) {
      console.log('User not authenticated');
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    console.log('Current user ID:', req.user.id);          // Changed from _id to id
    console.log('Current user isAdmin:', req.user.isAdmin); // Changed from role to isAdmin

    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    console.log('Movie found. addedBy:', movie.addedBy);
    
    // Allow admin users to delete any movie
    if (req.user.isAdmin) {
      console.log('Admin user - authorized to delete any movie');
      await Movie.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Movie deleted successfully by admin' });
    }
    
    // Check if the movie was added by a user (has addedBy field)
    if (!movie.addedBy) {
      console.log('Movie has no addedBy field - authorization failed');
      return res.status(403).json({ message: 'Not authorized to delete this movie' });
    }

    // Convert both IDs to strings for proper comparison
    const currentUserId = req.user.id.toString();          // Changed from _id to id
    const movieAddedById = movie.addedBy.toString();
    
    console.log('Current user ID (string):', currentUserId);
    console.log('Movie addedBy ID (string):', movieAddedById);
    console.log('User IDs match:', currentUserId === movieAddedById);

    // Only allow deletion if addedBy matches the current user
    if (currentUserId !== movieAddedById) {
      console.log('Authorization failed - user IDs do not match');
      return res.status(403).json({ message: 'Not authorized to delete this movie' });
    }

    await Movie.findByIdAndDelete(req.params.id);
    console.log('Movie deleted successfully');
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('Error in deleteMovie:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMovies, getMovieById, addMovie, updateMovieRating , deleteMovie };
