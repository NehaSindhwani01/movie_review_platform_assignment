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
      <div className="p-4 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-600">Please login to write a review.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submitReview} className="p-4 bg-gray-50 rounded-lg">
      <h3 className="font-semibold mb-4">Write a Review</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Review
        </label>
        <textarea
          value={reviewData.reviewText}
          onChange={(e) => setReviewData(prev => ({...prev, reviewText: e.target.value}))}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Share your thoughts about this movie..."
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;