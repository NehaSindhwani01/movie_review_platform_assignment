import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BarChart3, Film, Users, MessageSquare, Plus, Edit, Trash2 } from 'lucide-react';
import api from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalUsers: 0,
    totalReviews: 0
  });
  const [recentMovies, setRecentMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if user is admin
  if (!user || !user.isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this dashboard.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch movies to calculate stats
        const movies = await api.get('/movies');
        setRecentMovies(movies.slice(0, 5)); // Get latest 5 movies
        
        // Calculate stats (you might want to create specific API endpoints for this)
        setStats({
          totalMovies: movies.length,
          totalUsers: 0, // You'd need a users count endpoint
          totalReviews: movies.reduce((total, movie) => total + (movie.reviewCount || 0), 0)
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your movie database and monitor platform activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Movies</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalMovies}</p>
            </div>
            <Film className="w-12 h-12 text-blue-600 opacity-80" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-green-600">{stats.totalUsers}</p>
            </div>
            <Users className="w-12 h-12 text-green-600 opacity-80" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-3xl font-bold text-purple-600">{stats.totalReviews}</p>
            </div>
            <MessageSquare className="w-12 h-12 text-purple-600 opacity-80" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/admin/add-movie"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Movie
          </Link>
          <Link
            to="/movies"
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Film className="w-4 h-4" />
            View All Movies
          </Link>
        </div>
      </div>

      {/* Recent Movies */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Movies</h2>
          <Link
            to="/movies"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All
          </Link>
        </div>
        
        {recentMovies.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Title</th>
                  <th className="text-left py-2">Year</th>
                  <th className="text-left py-2">Genre</th>
                  <th className="text-left py-2">Rating</th>
                  <th className="text-left py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentMovies.map((movie) => (
                  <tr key={movie._id} className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={movie.posterUrl || '/api/placeholder/40/60'}
                          alt={movie.title}
                          className="w-10 h-15 object-cover rounded"
                        />
                        <span className="font-medium">{movie.title}</span>
                      </div>
                    </td>
                    <td className="py-3 text-gray-600">{movie.releaseYear}</td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1">
                        {movie.genre?.slice(0, 2).map((g) => (
                          <span
                            key={g}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 text-gray-600">
                      {movie.averageRating?.toFixed(1) || '0.0'}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/movies/${movie._id}`}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        {/* You could add delete functionality here */}
                        <button className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No movies found</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;