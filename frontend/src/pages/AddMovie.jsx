import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Film, Plus, X } from 'lucide-react';
import api from '../api/api';

const AddMovie = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    genre: [],
    releaseYear: new Date().getFullYear(),
    director: '',
    cast: [],
    synopsis: '',
    posterUrl: ''
  });
  const [currentGenre, setCurrentGenre] = useState('');
  const [currentCastMember, setCurrentCastMember] = useState('');

  // Check if user is admin
  if (!user || !user.isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to add movies.</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addGenre = () => {
    if (currentGenre.trim() && !formData.genre.includes(currentGenre.trim())) {
      setFormData(prev => ({
        ...prev,
        genre: [...prev.genre, currentGenre.trim()]
      }));
      setCurrentGenre('');
    }
  };

  const removeGenre = (genreToRemove) => {
    setFormData(prev => ({
      ...prev,
      genre: prev.genre.filter(genre => genre !== genreToRemove)
    }));
  };

  const addCastMember = () => {
    if (currentCastMember.trim() && !formData.cast.includes(currentCastMember.trim())) {
      setFormData(prev => ({
        ...prev,
        cast: [...prev.cast, currentCastMember.trim()]
      }));
      setCurrentCastMember('');
    }
  };

  const removeCastMember = (castToRemove) => {
    setFormData(prev => ({
      ...prev,
      cast: prev.cast.filter(cast => cast !== castToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const movieData = {
        ...formData,
        releaseYear: parseInt(formData.releaseYear)
      };
      
      await api.post('/movies', movieData);
      setSuccess('Movie added successfully!');
      
      // Reset form
      setFormData({
        title: '',
        genre: [],
        releaseYear: new Date().getFullYear(),
        director: '',
        cast: [],
        synopsis: '',
        posterUrl: ''
      });
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/movies');
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Failed to add movie');
    } finally {
      setLoading(false);
    }
  };

  const predefinedGenres = [
    'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime', 'Documentary',
    'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Romance',
    'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-center gap-3 mb-8">
          <Film className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Add New Movie</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Movie Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter movie title"
            />
          </div>

          {/* Release Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Release Year
            </label>
            <input
              type="number"
              name="releaseYear"
              value={formData.releaseYear}
              onChange={handleInputChange}
              min="1900"
              max={new Date().getFullYear() + 5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Director */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Director
            </label>
            <input
              type="text"
              name="director"
              value={formData.director}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter director name"
            />
          </div>

          {/* Genres */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Genres
            </label>
            <div className="flex gap-2 mb-3">
              <select
                value={currentGenre}
                onChange={(e) => setCurrentGenre(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a genre</option>
                {predefinedGenres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={addGenre}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.genre.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
                >
                  {genre}
                  <button
                    type="button"
                    onClick={() => removeGenre(genre)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Cast */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cast
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={currentCastMember}
                onChange={(e) => setCurrentCastMember(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCastMember())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter cast member name"
              />
              <button
                type="button"
                onClick={addCastMember}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.cast.map((member) => (
                <span
                  key={member}
                  className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm flex items-center gap-2"
                >
                  {member}
                  <button
                    type="button"
                    onClick={() => removeCastMember(member)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Poster URL */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Poster URL
            </label>
            <input
                type="url"
                name="posterUrl"
                value={formData.posterUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, posterUrl: e.target.value }))}
                placeholder="https://example.com/poster.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            {formData.posterUrl && (
                <div className="mt-3">
                <img
                    src={formData.posterUrl}
                    alt="Poster Preview"
                    className="w-32 h-48 object-cover rounded-lg border"
                    onError={(e) => e.target.src = '/placeholder.png'} // fallback if invalid
                />
                </div>
            )}
        </div>


          {/* Synopsis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Synopsis
            </label>
            <textarea
              name="synopsis"
              value={formData.synopsis}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter movie synopsis..."
            />
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? 'Adding Movie...' : 'Add Movie'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/movies')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMovie;