const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
  title: { type: String, required: true },
  genre: [String],
  releaseYear: Number,
  director: String,
  cast: [String],
  synopsis: String,
  posterUrl: String,
  averageRating: { type: Number, default: 0 },
  addedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
  }
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);
