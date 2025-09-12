const User = require('../models/User');
const Watchlist = require('../models/Watchlist');
const Movie = require('../models/Movie');
const Review = require('../models/Review'); 

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.params.id).select('-hashedPassword');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const reviews = await Review.find({ userId: user._id }).populate(
    'movieId',
    'title posterUrl'
  );

  res.json({ user, reviews });
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { username, email, password, profilePicture } = req.body;
  user.username = username || user.username;
  user.email = email || user.email;
  if (password) user.hashedPassword = password;
  user.profilePicture = profilePicture || user.profilePicture;

  const updatedUser = await user.save();
  res.json(updatedUser);
};

// @desc    Get user watchlist
// @route   GET /api/users/:id/watchlist
// @access  Private
const getWatchlist = async (req, res) => {
  const watchlist = await Watchlist.find({ userId: req.params.id }).populate('movieId');
  res.json(watchlist);
};

// @desc    Add movie to watchlist
// @route   POST /api/users/:id/watchlist
// @access  Private
const addToWatchlist = async (req, res) => {
  const { movieId } = req.body;
  const exists = await Watchlist.findOne({ userId: req.params.id, movieId });
  if (exists) {
    res.status(400);
    throw new Error('Movie already in watchlist');
  }

  const watchlistItem = new Watchlist({ userId: req.params.id, movieId });
  const createdItem = await watchlistItem.save();
  res.status(201).json(createdItem);
};

// @desc    Remove movie from watchlist
// @route   DELETE /api/users/:id/watchlist/:movieId
// @access  Private
const removeFromWatchlist = async (req, res) => {
  const { id, movieId } = req.params;
  const item = await Watchlist.findOne({ userId: id, movieId });
  if (!item) {
    res.status(404);
    throw new Error('Movie not found in watchlist');
  }

  await Watchlist.deleteOne({ _id: item._id });
  res.json({ message: 'Removed from watchlist' });
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
};
