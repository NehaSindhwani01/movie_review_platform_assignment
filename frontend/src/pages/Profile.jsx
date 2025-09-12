import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/api';
import StarRating from '../components/StarRating';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reviews');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileData, watchlistData] = await Promise.all([
          api.get(`/users/${id}`),
          user && user._id === id ? api.get(`/users/${id}/watchlist`) : Promise.resolve([])
        ]);
        setProfile(profileData);
        setWatchlist(watchlistData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, user]);

  if (loading) return <LoadingSpinner />;
  if (!profile) return <div className="text-center py-8">Profile not found</div>;

  const isOwnProfile = user && user._id === id;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {profile.user.username[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{profile.user.username}</h1>
            <p className="text-gray-600">Member since {new Date(profile.user.joinDate).getFullYear()}</p>
            <p className="text-gray-600">{profile.reviews.length} reviews</p>
            {isOwnProfile && <p className="text-gray-600">{watchlist.length} movies in watchlist</p>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reviews'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Reviews ({profile.reviews.length})
          </button>
          {isOwnProfile && (
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'watchlist'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Watchlist ({watchlist.length})
            </button>
          )}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {profile.reviews.length > 0 ? (
            profile.reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start gap-4">
                  <img
                    src={review.movieId.posterUrl || '/api/placeholder/80/120'}
                    alt={review.movieId.title}
                    className="w-16 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <Link
                      to={`/movies/${review.movieId._id}`}
                      className="text-lg font-semibold text-blue-600 hover:text-blue-800"
                    >
                      {review.movieId.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1 mb-3">
                      <StarRating rating={review.rating} />
                      <span className="text-sm text-gray-600">
                        {new Date(review.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    {review.reviewText && (
                      <p className="text-gray-700">{review.reviewText}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No reviews yet.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'watchlist' && isOwnProfile && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {watchlist.length > 0 ? (
            watchlist.map((item) => (
              <MovieCard key={item._id} movie={item.movieId} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">Your watchlist is empty.</p>
              <Link
                to="/movies"
                className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Movies
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;