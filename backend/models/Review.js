const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  rating: { type: Number, required: true },
  reviewText: String,
  timestamp: { type: Date, default: Date.now },
  
});

module.exports = mongoose.model('Review', reviewSchema);
