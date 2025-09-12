import { Link } from 'react-router-dom';
import WatchlistButton from './WatchlistButton';

const MovieCard = ({ movie }) => {
  return (
    <div className="movie-card">
      <img src={movie.posterUrl} alt={movie.title} />
      <h3>{movie.title}</h3>
      <p>Rating: {movie.averageRating.toFixed(1)}</p>
      <Link to={`/movies/${movie._id}`}>Details</Link>
      <WatchlistButton movieId={movie._id} />
    </div>
  );
};

export default MovieCard;
