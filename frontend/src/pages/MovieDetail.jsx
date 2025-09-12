import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/api';
import ReviewForm from '../components/ReviewForm';
import MovieCard from '../components/MovieCard';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);

  // Fetch current movie + reviews
  const fetchMovie = async () => {
    const res = await API.get(`/movies/${id}`);
    setMovie(res.data.movie);
    setReviews(res.data.reviews);
  };

  // Fetch all movies for recommendations
  const fetchAllMovies = async () => {
    const res = await API.get('/movies'); // fetch all movies
    setAllMovies(res.data);
  };

  useEffect(() => {
    fetchMovie();
    fetchAllMovies();
  }, [id]);

  // Compute smart recommendations
  useEffect(() => {
    if (movie && allMovies.length > 0) {
      const recommended = allMovies
        .filter((m) => m._id !== movie._id) // exclude current movie
        .filter((m) => m.genre.some((g) => movie.genre.includes(g))) // match at least one genre
        .sort(
          (a, b) =>
            Math.abs(a.averageRating - movie.averageRating) -
            Math.abs(b.averageRating - movie.averageRating)
        )
        .slice(0, 5); // top 5 recommended
      setRecommendedMovies(recommended);
    }
  }, [movie, allMovies]);

  return movie ? (
    <div>
      <h1>{movie.title}</h1>
      <img src={movie.posterUrl} alt={movie.title} />
      <p>{movie.synopsis}</p>
      <p>Genre: {movie.genre.join(', ')}</p>
      <p>Rating: {movie.averageRating.toFixed(1)}</p>

      <h2>Reviews</h2>
      {reviews.map((rev) => (
        <div key={rev._id}>
          <strong>{rev.userId.username}</strong> - {rev.rating}⭐
          <p>{rev.reviewText}</p>
        </div>
      ))}

      <ReviewForm movieId={id} onReviewSubmit={fetchMovie} />

      {/* Recommended Movies Section */}
      {recommendedMovies.length > 0 && (
        <div>
          <h2>Recommended Movies</h2>
          <div className="movie-grid">
            {recommendedMovies.map((rec) => (
              <MovieCard key={rec._id} movie={rec} />
            ))}
          </div>
        </div>
      )}
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default MovieDetail;
