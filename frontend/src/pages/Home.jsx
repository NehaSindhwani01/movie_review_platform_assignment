import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import api from '../api/api';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await api.get('/movies?limit=12&rating=4');
        setMovies(data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent mb-4">
            Welcome to MovieHub
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover amazing movies, read reviews, and create your personal watchlist
          </p>
        </div>

        <section className="mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Star className="w-6 h-6 text-amber-400" />
            <h2 className="text-2xl font-bold text-white">Top Rated Movies</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        </section>

        <div className="text-center">
          <Link
            to="/movies"
            className="inline-block bg-amber-500 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-amber-400 transition-colors"
          >
            Explore All Movies
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;