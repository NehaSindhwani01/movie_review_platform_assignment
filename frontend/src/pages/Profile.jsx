import { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';
import StarRating from '../components/StarRating';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { User, Calendar, Star, Clock, Film, Eye, EyeOff, Bug, AlertCircle } from 'lucide-react';

const Profile = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState({});
  const [activeTab, setActiveTab] = useState('reviews');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');
        
        console.log('Fetching profile for ID:', id);
        console.log('Current user:', user);
        
        // Make API calls
        const profileRes = await api.get(`/users/${id}`);
        console.log('Profile API response:', profileRes);
        
        let watchlistRes = { data: [] };
        if (user && user._id === id) {
          watchlistRes = await api.get(`/users/${id}/watchlist`);
          console.log('Watchlist API response:', watchlistRes);
        }

        // Store debug info
        setDebugInfo({
          profileResponse: profileRes,
          watchlistResponse: watchlistRes,
          paramsId: id,
          currentUserId: user?._id,
          isOwnProfile: user && user._id === id
        });

        // Check if profile data exists
        if (profileRes?.user) {
          setProfile(profileRes);
          setWatchlist(user && user._id === id ? watchlistRes : []);
        } else {
          setError('Profile data not found in response');
          setProfile(null);
        }
        
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError(`Failed to load profile: ${error.message || 'Unknown error'}`);
        setProfile(null);
        
        // Store error in debug info
        setDebugInfo(prev => ({
          ...prev,
          error: error.message,
          errorStack: error.stack
        }));
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProfile();
    } else {
      setError('No user ID provided in URL');
      setLoading(false);
    }
  }, [id, user]);

  // Debug component to show what's happening
  const DebugPanel = () => (
    <div className="mt-8 p-4 bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold text-amber-400 mb-3 flex items-center gap-2">
        <Bug className="w-5 h-5" />
        Debug Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p><strong>URL ID:</strong> {id}</p>
          <p><strong>Current User ID:</strong> {user?._id || 'Not logged in'}</p>
          <p><strong>Is Own Profile:</strong> {user && user._id === id ? 'Yes' : 'No'}</p>
          <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        </div>
        <div>
          <p><strong>Profile Data:</strong> {profile ? 'Exists' : 'Null'}</p>
          <p><strong>Error:</strong> {error || 'None'}</p>
          <p><strong>Watchlist Items:</strong> {watchlist.length}</p>
        </div>
      </div>
      {error && (
        <div className="mt-4 p-3 bg-red-900/30 rounded-lg">
          <p className="text-red-300">{error}</p>
        </div>
      )}
    </div>
  );

  if (loading) return <LoadingSpinner />;
  
  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-gray-700/50 text-center">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-rose-600 shadow-lg mb-4">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent mb-2">
              {error ? 'Error Loading Profile' : 'Profile Not Found'}
            </h1>
            <p className="text-gray-300 mb-6">
              {error || 'The user profile you\'re looking for doesn\'t exist.'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Link
                to="/"
                className="px-6 py-2 bg-amber-500 text-gray-900 font-semibold rounded-lg hover:bg-amber-400 transition-colors"
              >
                Return Home
              </Link>
              {user && (
                <button
                  onClick={() => navigate(`/profile/${user._id}`)}
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors"
                >
                  View My Profile
                </button>
              )}
            </div>

            {/* <DebugPanel /> */}
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = user && user._id === profile.user._id;

  // Filter out reviews with null movieId
  const validReviews = profile.reviews.filter(review => review.movieId !== null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-gray-700/50 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full flex items-center justify-center text-gray-900 text-3xl font-bold shadow-lg">
                {profile.user.username[0].toUpperCase()}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-amber-500 text-gray-900 p-1 rounded-full">
                <User className="w-5 h-5" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
                {profile.user.username}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-gray-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Member since {new Date(profile.user.joinDate).getFullYear()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span>{validReviews.length} reviews</span>
                </div>
                {isOwnProfile && (
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-amber-400" />
                    <span>{watchlist.length} in watchlist</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700 mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'reviews'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <Star className="w-4 h-4" />
              Reviews ({validReviews.length})
            </button>
            {isOwnProfile && (
              <button
                onClick={() => setActiveTab('watchlist')}
                className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === 'watchlist'
                    ? 'border-amber-500 text-amber-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <Eye className="w-4 h-4" />
                Watchlist ({watchlist.length})
              </button>
            )}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {validReviews.length > 0 ? (
              validReviews.map((review) => (
                <div key={review._id} className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-gray-700/50">
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    <div className="flex-shrink-0">
                      <img
                        src={review.movieId?.posterUrl || '/api/placeholder/100/150'}
                        alt={review.movieId?.title || 'Movie poster'}
                        className="w-20 h-28 object-cover rounded-lg shadow-lg"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDEwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjMzMzMzMzIi8+CjxwYXRoIGQ9Ik00MCA2NUw1MCA3NUw2MDY1SDQwWiIgZmlsbD0iIzY2NjY2NiIvPgo8cGF0aCBkPSJNNDAgODVMNTA5NUw2MDg1SDQwWiIgZmlsbD0iIzY2NjY2NiIvPgo8cGF0aCBkPSJNNDAgMTA1TDUwMTE1TDYwMTA1SDQwWiIgZmlsbD0iIzY2NjY2NiIvPgo8L3N2Zz4K';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      {review.movieId ? (
                        <Link
                          to={`/movies/${review.movieId._id}`}
                          className="text-xl font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                        >
                          {review.movieId.title}
                        </Link>
                      ) : (
                        <span className="text-xl font-semibold text-gray-400">
                          [Movie Deleted]
                        </span>
                      )}
                      <div className="flex items-center gap-3 mt-2 mb-4">
                        <StarRating rating={review.rating} />
                        <span className="text-sm text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(review.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      {review.reviewText && (
                        <p className="text-gray-300 leading-relaxed">{review.reviewText}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl p-12 border border-gray-700/50 text-center">
                <Film className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No Reviews Yet</h3>
                <p className="text-gray-500 mb-6">This user hasn't written any reviews yet.</p>
                {isOwnProfile && (
                  <Link
                    to="/movies"
                    className="inline-flex items-center gap-2 bg-amber-500 text-gray-900 px-6 py-3 rounded-lg hover:bg-amber-400 transition-colors font-semibold"
                  >
                    Browse Movies
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'watchlist' && isOwnProfile && (
          <div>
            {watchlist.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {watchlist.map((item) => (
                  <MovieCard key={item._id} movie={item.movieId} />
                ))}
              </div>
            ) : (
              <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl p-12 border border-gray-700/50 text-center">
                <EyeOff className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">Your Watchlist is Empty</h3>
                <p className="text-gray-500 mb-6">Start adding movies to keep track of what you want to watch.</p>
                <Link
                  to="/movies"
                  className="inline-flex items-center gap-2 bg-amber-500 text-gray-900 px-6 py-3 rounded-lg hover:bg-amber-400 transition-colors font-semibold"
                >
                  Browse Movies
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Debug panel for development
        {process.env.NODE_ENV === 'development' && <DebugPanel />} */}
      </div>
    </div>
  );
};

export default Profile;