import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/api';
import MovieCard from '../components/MovieCard';

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    const res = await API.get(`/users/${id}`);
    setProfile(res.data);
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  return profile ? (
    <div>
      <h1>{profile.user.username}'s Profile</h1>
      <img src={profile.user.profilePicture} alt="profile" />
      <h2>Review History</h2>
      {profile.reviews.map((rev) => (
        <div key={rev._id}>
          <strong>{rev.movieId.title}</strong> - {rev.rating}⭐
          <p>{rev.reviewText}</p>
        </div>
      ))}
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default Profile;
