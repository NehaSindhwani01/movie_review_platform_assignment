import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/api';

const ReviewForm = ({ movieId, onReviewSubmit }) => {
  const { user } = useContext(AuthContext);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return alert('Login to submit review');
    await API.post(`/reviews/${movieId}`, { rating, reviewText });
    setRating(5);
    setReviewText('');
    onReviewSubmit();
  };

  return (
    <form onSubmit={submitReview}>
      <label>Rating:</label>
      <input
        type="number"
        min="1"
        max="5"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
      />
      <label>Review:</label>
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
      ></textarea>
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;
