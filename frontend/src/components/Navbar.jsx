import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Film, User, LogOut, Plus, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-amber-400">
              <Film className="w-8 h-8" />
              MovieHub
            </Link>
            <div className="flex space-x-6">
              <Link 
                to="/" 
                className="text-gray-300 hover:text-amber-400 transition-colors font-medium"
              >
                Home
              </Link>
              <Link 
                to="/movies" 
                className="text-gray-300 hover:text-amber-400 transition-colors font-medium"
              >
                Movies
              </Link>
              {/* Admin Link */}
              {user && user.isAdmin && (
                <Link
                  to="/admin/add-movie"
                  className="flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Movie
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Admin Badge */}
                {user.isAdmin && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-medium border border-amber-500/30">
                    <Shield className="w-3 h-3" />
                    Admin
                  </div>
                )}
                <Link
                  to={`/profile/${user._id}`}
                  className="flex items-center gap-2 text-gray-300 hover:text-amber-400 transition-colors"
                >
                  <User className="w-5 h-5" />
                  {user.username}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-300 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-amber-400 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-amber-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-amber-400 transition-colors font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;