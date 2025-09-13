import { Link } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Heart, Calendar, Star, Clapperboard, Eye } from 'lucide-react';
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
    <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-gray-700/50">
      <div className="relative">
        <img
          src={
            movie.posterUrl && movie.posterUrl !== 'NULL' && movie.posterUrl !== 'null'
              ? movie.posterUrl
              : '/placeholder.png'
          }
          alt={movie.title}
          className="w-full h-72 object-cover"
          onError={(e) => {
            console.log('Image failed to load for:', movie.title, 'URL:', e.target.src);
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDMwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNDUwIiBmaWxsPSIjMzMzMzMzIi8+CjxwYXRoIGQ9Ik0xMjAgMTk1TDE1MCAyMjVMMTgwIDE5NUgxMjBaIiBmaWxsPSIjNjY2NjY2Ii8+CjxwYXRoIGQ9Ik0xMjAgMjU1TDE1MCAyODVMMTgwIDI1NUgxMjBaIiBmaWxsPSIjNjY2NjY2Ii8+CjxwYXRoIGQ9Ik0xMjAgMzE1TDE1MCAzNDVMMTgwIDMxNUgxMjBaIiBmaWxsPSIjNjY2NjY2Ii8+Cjwvc3ZnPgo=';
          }}
        />
        <button
          onClick={toggleWatchlist}
          disabled={loading}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm ${
            inWatchlist 
              ? 'bg-red-500/90 text-white shadow-lg shadow-red-500/30' 
              : 'bg-gray-900/70 text-gray-300 hover:bg-gray-800/90 hover:text-white'
          } transition-all duration-200 transform hover:scale-110`}
        >
          <Heart className={`w-5 h-5 ${inWatchlist ? 'fill-current' : ''}`} />
        </button>
        
        {/* Rating badge */}
        {movie.averageRating > 0 && (
          <div className="absolute top-3 left-3 bg-amber-500/90 text-gray-900 px-2 py-1 rounded-full text-sm font-semibold backdrop-blur-sm flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            <span>{movie.averageRating?.toFixed(1)}</span>
          </div>
        )}
      </div>
      
      <div className="p-5">
        <h3 className="font-bold text-lg text-white mb-3 line-clamp-2 leading-tight">
          {movie.title}
        </h3>
        
        <div className="flex items-center gap-2 text-gray-300 mb-3">
          <Calendar className="w-4 h-4 text-amber-400" />
          <span className="text-sm">{movie.releaseYear}</span>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <StarRating rating={Math.round(movie.averageRating)} />
          <span className="text-sm text-gray-400">
            ({movie.reviewCount || 0} reviews)
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-5">
          {movie.genre?.slice(0, 3).map((g) => (
            <span
              key={g}
              className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs rounded-full border border-amber-500/30"
            >
              {g}
            </span>
          ))}
        </div>
        
        <Link
          to={`/movies/${movie._id}`}
          className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-900 py-3 px-4 rounded-lg font-semibold hover:from-amber-600 hover:to-yellow-500 transition-all duration-200 transform hover:scale-[1.02] shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          View Details
        </Link>
      </div>
    </div>
  );
};

export default MovieCard;