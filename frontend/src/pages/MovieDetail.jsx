import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Users } from 'lucide-react';
import api from '../api/api';
import StarRating from '../components/StarRating';
import ReviewForm from '../components/ReviewForm';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMovie = async () => {
    try {
      const data = await api.get(`/movies/${id}`);
      setMovie(data.movie);
      setReviews(data.reviews);
      
      // Get recommendations based on genre
      if (data.movie.genre.length > 0) {
        const allMovies = await api.get('/movies');
        const recommended = allMovies
          .filter(m => m._id !== id && m.genre.some(g => data.movie.genre.includes(g)))
          .sort((a, b) => Math.abs(b.averageRating - data.movie.averageRating))
          .slice(0, 4);
        setRecommendedMovies(recommended);
      }
    } catch (error) {
      console.error('Error fetching movie:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovie();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!movie) return <div className="text-center py-8">Movie not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Movie Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={
                  movie.posterUrl && movie.posterUrl !== 'NULL' && movie.posterUrl !== 'null'
                    ? movie.posterUrl
                    : '/placeholder.png' // fallback for missing images
                }
                alt={movie.title}
                className="w-full md:w-64 h-96 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = '/placeholder.png';
                }}
              />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{movie.title}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <StarRating rating={Math.round(movie.averageRating)} size="w-6 h-6" />
                  <span className="text-xl font-semibold">
                    {movie.averageRating?.toFixed(1) || '0.0'}
                  </span>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span><strong>Release Year:</strong> {movie.releaseYear}</span>
                  </div>
                  {movie.director && (
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-gray-400" />
                      <span><strong>Director:</strong> {movie.director}</span>
                    </div>
                  )}
                  {movie.cast && movie.cast.length > 0 && (
                    <div>
                      <strong>Cast:</strong> {movie.cast.join(', ')}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genre?.map((g) => (
                    <span
                      key={g}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {g}
                    </span>
                  ))}
                </div>
                {movie.synopsis && (
                  <p className="text-gray-700 leading-relaxed">{movie.synopsis}</p>
                )}
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
            
            {/* Submit Review Form */}
            <div className="mb-8">
              <ReviewForm movieId={id} onReviewSubmit={fetchMovie} />
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review._id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {review.userId.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold">{review.userId.username}</p>
                        <div className="flex items-center gap-2">
                          <StarRating rating={review.rating} />
                          <span className="text-sm text-gray-500">
                            {new Date(review.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    {review.reviewText && (
                      <p className="text-gray-700 ml-11">{review.reviewText}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {recommendedMovies.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recommended Movies</h3>
              <div className="space-y-4">
                {recommendedMovies.map((rec) => (
                  <Link
                    key={rec._id}
                    to={`/movies/${rec._id}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <img
                      src={movie.posterUrl && movie.posterUrl !== 'NULL' && movie.posterUrl !== 'null'
                            ? movie.posterUrl
                            : '/placeholder.png'
                      }
                        
                      alt={rec.title}
                      className="w-12 h-18 object-cover rounded"
                      onError={(e) => {
                        e.target.src = '/api/placeholder/60/90';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{rec.title}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <StarRating rating={Math.round(rec.averageRating)} size="w-3 h-3" />
                        <span className="text-xs text-gray-600">
                          {rec.averageRating?.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;