import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Film, Plus, X, Star, Clapperboard, Camera, Calendar, User, Users, FileText, Image } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-gray-700/50 text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-rose-600 shadow-lg mb-4">
            <X className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent mb-2">
            Access Denied
          </h1>
          <p className="text-gray-300">You need admin privileges to add movies.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-6 py-2 bg-amber-500 text-gray-900 font-semibold rounded-lg hover:bg-amber-400 transition-colors"
          >
            Return Home
          </button>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-gray-700/50">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-gradient-to-r from-amber-500 to-yellow-300 rounded-lg">
              <Clapperboard className="w-8 h-8 text-gray-900" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              Add New Movie
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Film className="w-4 h-4" />
                Movie Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700/60 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 text-white placeholder-gray-400 transition-all"
                placeholder="Enter movie title"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Release Year */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Release Year
                </label>
                <input
                  type="number"
                  name="releaseYear"
                  value={formData.releaseYear}
                  onChange={handleInputChange}
                  min="1900"
                  max={new Date().getFullYear() + 5}
                  className="w-full px-4 py-3 bg-gray-700/60 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 text-white transition-all"
                />
              </div>

              {/* Director */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Director
                </label>
                <input
                  type="text"
                  name="director"
                  value={formData.director}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700/60 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 text-white placeholder-gray-400 transition-all"
                  placeholder="Enter director name"
                />
              </div>
            </div>

            {/* Genres */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Genres
              </label>
              <div className="flex flex-col sm:flex-row gap-2 mb-3">
                <select
                  value={currentGenre}
                  onChange={(e) => setCurrentGenre(e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-700/60 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 text-white transition-all"
                >
                  <option value="">Select a genre</option>
                  {predefinedGenres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={addGenre}
                  className="px-4 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-900 font-semibold rounded-lg hover:from-amber-600 hover:to-yellow-500 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Genre
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.genre.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-2 bg-amber-500/20 text-amber-300 rounded-full text-sm flex items-center gap-2 border border-amber-500/30"
                  >
                    {genre}
                    <button
                      type="button"
                      onClick={() => removeGenre(genre)}
                      className="text-amber-400 hover:text-amber-200 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Cast */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Cast
              </label>
              <div className="flex flex-col sm:flex-row gap-2 mb-3">
                <input
                  type="text"
                  value={currentCastMember}
                  onChange={(e) => setCurrentCastMember(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCastMember())}
                  className="flex-1 px-4 py-3 bg-gray-700/60 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 text-white placeholder-gray-400 transition-all"
                  placeholder="Enter cast member name"
                />
                <button
                  type="button"
                  onClick={addCastMember}
                  className="px-4 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-gray-900 font-semibold rounded-lg hover:from-amber-600 hover:to-yellow-500 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Cast
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.cast.map((member) => (
                  <span
                    key={member}
                    className="px-3 py-2 bg-gray-700/60 text-gray-300 rounded-full text-sm flex items-center gap-2 border border-gray-600"
                  >
                    {member}
                    <button
                      type="button"
                      onClick={() => removeCastMember(member)}
                      className="text-gray-400 hover:text-gray-200 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Poster URL */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Image className="w-4 h-4" />
                Poster URL
              </label>
              <input
                type="url"
                name="posterUrl"
                value={formData.posterUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/poster.jpg"
                className="w-full px-4 py-3 bg-gray-700/60 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 text-white placeholder-gray-400 transition-all"
              />

              {formData.posterUrl && (
                <div className="mt-4">
                  <p className="text-sm text-gray-400 mb-2">Poster Preview:</p>
                  <div className="border-2 border-amber-500/30 rounded-lg p-1 inline-block">
                    <img
                      src={formData.posterUrl}
                      alt="Poster Preview"
                      className="w-32 h-48 object-cover rounded-md"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDEyOCAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTkyIiBmaWxsPSIjMzMzMzMzIi8+CjxwYXRoIGQ9Ik00OCA2NEw2NCA4MEw4MCA2NEg0OFoiIGZpbGw9IiM2NjY2NjYiLz4KPHBhdGggZD0iTTQ4IDk2TDY0IDExMkw4MCA5Nkg0OFoiIGZpbGw9IiM2NjY2NjYiLz4KPHBhdGggZD0iTTQ4IDEyOEw2NCAxNDRMODAgMTI4SDQ4WiIgZmlsbD0iIzY2NjY2NiIvPgo8L3N2Zz4K';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Synopsis */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Synopsis
              </label>
              <textarea
                name="synopsis"
                value={formData.synopsis}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-4 py-3 bg-gray-700/60 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 text-white placeholder-gray-400 transition-all"
                placeholder="Enter movie synopsis..."
              />
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-900/40 border border-red-700/50 text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-900/40 border border-green-700/50 text-green-200 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-6 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding Movie...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Add Movie
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/movies')}
                className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMovie;