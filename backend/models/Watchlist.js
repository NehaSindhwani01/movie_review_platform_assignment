const mongoose = require('mongoose');

const watchlistSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  dateAdded: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Watchlist', watchlistSchema);
