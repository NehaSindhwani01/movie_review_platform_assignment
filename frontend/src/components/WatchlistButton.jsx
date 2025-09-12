import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/api';

const WatchlistButton = ({ movieId }) => {
  const { user } = useContext(AuthContext);
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    const checkWatchlist = async () => {
      if (!user) return;
      const res = await API.get(`/users/${user._id}/watchlist`);
      setInWatchlist(res.data.some((item) => item.movieId._id === movieId));
    };
    checkWatchlist();
  }, [user, movieId]);

  const toggleWatchlist = async () => {
    if (!user) return alert('Login to manage watchlist');
    if (inWatchlist) {
      await API.delete(`/users/${user._id}/watchlist/${movieId}`);
    } else {
      await API.post(`/users/${user._id}/watchlist`, { movieId });
    }
    setInWatchlist(!inWatchlist);
  };

  return (
    <button onClick={toggleWatchlist}>
      {inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
    </button>
  );
};

export default WatchlistButton;
