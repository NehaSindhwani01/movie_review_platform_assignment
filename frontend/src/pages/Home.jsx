import { useState, useEffect } from 'react';
import API from '../api/api';
import MovieCard from '../components/MovieCard';

const Home = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const res = await API.get('/movies?limit=10');
      setMovies(res.data);
    };
    fetchMovies();
  }, []);

  return (
    <div>
      <h1>Featured & Trending Movies</h1>
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default Home;
