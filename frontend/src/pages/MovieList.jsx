import { useState, useEffect } from 'react';
import API from '../api/api';
import MovieCard from '../components/MovieCard';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');

  const fetchMovies = async () => {
    const res = await API.get(`/movies?search=${search}`);
    setMovies(res.data);
  };

  useEffect(() => {
    fetchMovies();
  }, [search]);

  return (
    <div>
      <h1>All Movies</h1>
      <input
        type="text"
        placeholder="Search movies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default MovieList;
