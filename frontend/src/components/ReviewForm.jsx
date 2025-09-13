import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import StarRating from './StarRating';
import api from '../api/api';

const ReviewForm = ({ movieId, onReviewSubmit }) => {
  const { user } = useContext(AuthContext);
  const [reviewData, setReviewData] = useState({ rating: 5, reviewText: '' });
  const [submitting, setSubmitting] = useState(false);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to submit a review');
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/reviews/${movieId}`, reviewData);
      setReviewData({ rating: 5, reviewText: '' });
      onReviewSubmit();
    } catch (error) {
      alert('Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="p-6 bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700/50 text-center">
        <p className="text-gray-300">Please login to write a review.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submitReview} className="p-6 bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700/50">
      <h3 className="font-semibold text-white mb-4 text-lg">Write a Review</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium text-amber-300 mb-2">
          Rating
        </label>
        <StarRating
          rating={reviewData.rating}
          interactive={true}
          onRatingChange={(rating) => setReviewData(prev => ({...prev, rating}))}
          size="w-8 h-8"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-amber-300 mb-2">
          Review
        </label>
        <textarea
          value={reviewData.reviewText}
          onChange={(e) => setReviewData(prev => ({...prev, reviewText: e.target.value}))}
          rows={4}
          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          placeholder="Share your thoughts about this movie..."
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="bg-amber-500 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-amber-400 transition-colors disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;