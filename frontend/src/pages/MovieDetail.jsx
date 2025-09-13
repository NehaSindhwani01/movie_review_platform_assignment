import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Users, Star, ArrowLeft, Clapperboard } from 'lucide-react';
import api from '../api/api';
import StarRating from '../components/StarRating';
import ReviewForm from '../components/ReviewForm';
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
      if (data.movie.genre && data.movie.genre.length > 0) {
        const allMovies = await api.get('/movies');
        const recommended = allMovies
          .filter(m => m._id !== id && m.genre && m.genre.some(g => data.movie.genre.includes(g)))
          .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0)) // Sort by rating descending
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
  if (!movie) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-gray-700/50 text-center">
        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-rose-600 shadow-lg mb-4">
          <Clapperboard className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent mb-2">
          Movie Not Found
        </h1>
        <p className="text-gray-300 mb-6">The movie you're looking for doesn't exist.</p>
        <Link
          to="/movies"
          className="px-6 py-2 bg-amber-500 text-gray-900 font-semibold rounded-lg hover:bg-amber-400 transition-colors"
        >
          Browse Movies
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          to="/movies"
          className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Movies
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Movie Details */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl p-6 mb-8 border border-gray-700/50">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={
                      movie.posterUrl && movie.posterUrl !== 'NULL' && movie.posterUrl !== 'null'
                        ? movie.posterUrl
                        : '/placeholder.png'
                    }
                    alt={movie.title}
                    className="w-full md:w-64 h-96 object-cover rounded-xl shadow-lg"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjM4NCIgdmlld0JveD0iMCAwIDI1NiAzODQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMzg0IiBmaWxsPSIjMzMzMzMzIi8+CjxwYXRoIGQ9Ik0xMDIgMTQ0TDEyOCAxNzZMMTU0IDE0NEgxMDJaIiBmaWxsPSIjNjY2NjY2Ii8+CjxwYXRoIGQ9Ik0xMDIgMTkyTDEyOCAyMjRMMTU0IDE5MkgxMDJaIiBmaWxsPSIjNjY2NjY2Ii8+CjxwYXRoIGQ9Ik0xMDIgMjQwTDEyOCAyNzJMMTU0IDI0MEgxMDJaIiBmaWxsPSIjNjY2NjY2Ii8+Cjwvc3ZnPgo=';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent mb-4">
                    {movie.title}
                  </h1>
                  <div className="flex items-center gap-4 mb-4">
                    <StarRating rating={Math.round(movie.averageRating || 0)} size="w-6 h-6" />
                    <span className="text-xl font-semibold text-white">
                      {(movie.averageRating || 0).toFixed(1)}
                    </span>
                    <span className="text-gray-400">
                      ({reviews.length} reviews)
                    </span>
                  </div>
                  <div className="space-y-3 mb-6 text-gray-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-amber-400" />
                      <span><strong className="text-white">Release Year:</strong> {movie.releaseYear}</span>
                    </div>
                    {movie.director && (
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-amber-400" />
                        <span><strong className="text-white">Director:</strong> {movie.director}</span>
                      </div>
                    )}
                    {movie.cast && movie.cast.length > 0 && (
                      <div>
                        <strong className="text-white">Cast:</strong> {movie.cast.join(', ')}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {movie.genre?.map((g) => (
                      <span
                        key={g}
                        className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-sm border border-amber-500/30"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                  {movie.synopsis && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Synopsis</h3>
                      <p className="text-gray-300 leading-relaxed">{movie.synopsis}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-gray-700/50">
              <h2 className="text-2xl font-bold text-white mb-6">Reviews</h2>
              
              {/* Submit Review Form */}
              <div className="mb-8">
                <ReviewForm movieId={id} onReviewSubmit={fetchMovie} />
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-700/50 pb-6 last:border-b-0 last:pb-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full flex items-center justify-center text-gray-900 font-semibold">
                          {review.userId?.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{review.userId?.username || 'Unknown'}</p>
                          <div className="flex items-center gap-2">
                            <StarRating rating={review.rating} />
                            <span className="text-sm text-gray-400">
                              {new Date(review.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      {review.reviewText && (
                        <p className="text-gray-300 ml-13">{review.reviewText}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-8">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {recommendedMovies.length > 0 ? (
              <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-gray-700/50 sticky top-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400" />
                  Recommended Movies
                </h3>
                <div className="space-y-4">
                  {recommendedMovies.map((rec) => (
                    <Link
                      key={rec._id}
                      to={`/movies/${rec._id}`}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700/80 transition-colors"
                    >
                      <img
                        src={rec.posterUrl && rec.posterUrl !== 'NULL' && rec.posterUrl !== 'null'
                              ? rec.posterUrl
                              : '/placeholder.png'
                        }
                        alt={rec.title}
                        className="w-12 h-18 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iOTAiIHZpZXdCb3g9IjAgMCA2MCA5MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjkwIiBmaWxsPSIjMzMzMzMzIi8+CjxwYXRoIGQ9Ik0yNCAzNkwzMCA0MkwzNiAzNkgyNFoiIGZpbGw9IiM2NjY2NjYiLz4KPHBhdGggZD0iTTI0IDQ4TDMwIDU0TDM2IDQ4SDI0WiIgZmlsbD0iIzY2NjY2NiIvPgo8cGF0aCBkPSJNMjQgNjBMMzAgNjZMMzYgNjBIMjRaIiBmaWxsPSIjNjY2NjY2Ii8+Cjwvc3ZnPgo=';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-sm truncate">{rec.title}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <StarRating rating={Math.round(rec.averageRating || 0)} size="w-3 h-3" />
                          <span className="text-xs text-amber-400">
                            {(rec.averageRating || 0).toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-gray-700/50 sticky top-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400" />
                  Recommended Movies
                </h3>
                <p className="text-gray-400 text-center py-4">No recommendations available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;