import { Link } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Heart, Calendar } from 'lucide-react';
import StarRating from './StarRating';
import api from '../api/api';

const MovieCard = ({ movie }) => {
  const { user } = useContext(AuthContext);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkWatchlist = async () => {
      if (!user) return;
      try {
        const watchlist = await api.get(`/users/${user._id}/watchlist`);
        setInWatchlist(watchlist.some(item => item.movieId._id === movie._id));
      } catch (error) {
        console.error('Error checking watchlist:', error);
      }
    };
    checkWatchlist();
  }, [user, movie._id]);

  const toggleWatchlist = async () => {
    if (!user) {
      alert('Please login to manage your watchlist');
      return;
    }

    setLoading(true);
    try {
      if (inWatchlist) {
        await api.delete(`/users/${user._id}/watchlist/${movie._id}`);
      } else {
        await api.post(`/users/${user._id}/watchlist`, { movieId: movie._id });
      }
      setInWatchlist(!inWatchlist);
    } catch (error) {
      alert('Error updating watchlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={
            movie.posterUrl && movie.posterUrl !== 'NULL' && movie.posterUrl !== 'null'
              ? movie.posterUrl
              : '/placeholder.png' // fallback for missing images
          }
          alt={movie.title}
          className="w-full h-64 object-cover"
          onError={(e) => {
            console.log('Image failed to load for:', movie.title, 'URL:', e.target.src);
            e.target.src = '/api/placeholder/300/450';
          }}
        />
        <button
          onClick={toggleWatchlist}
          disabled={loading}
          className={`absolute top-2 right-2 p-2 rounded-full ${
            inWatchlist 
              ? 'bg-red-500 text-white' 
              : 'bg-white bg-opacity-80 text-gray-700 hover:bg-opacity-100'
          } transition-colors`}
        >
          <Heart className={`w-4 h-4 ${inWatchlist ? 'fill-current' : ''}`} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{movie.title}</h3>
        <div className="flex items-center gap-2 mb-2">
          <StarRating rating={Math.round(movie.averageRating)} />
          <span className="text-sm text-gray-600">
            {movie.averageRating?.toFixed(1) || '0.0'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <Calendar className="w-4 h-4" />
          <span>{movie.releaseYear}</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {movie.genre?.slice(0, 2).map((g) => (
            <span
              key={g}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {g}
            </span>
          ))}
        </div>
        <Link
          to={`/movies/${movie._id}`}
          className="block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default MovieCard;