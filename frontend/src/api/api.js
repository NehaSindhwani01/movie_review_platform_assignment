const API_BASE = 'https://movie-review-platform-assignment.onrender.com/api';

const api = {
  request: async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  },

  get: (endpoint) => api.request(endpoint),
  post: (endpoint, body) => api.request(endpoint, { method: 'POST', body }),
  put: (endpoint, body) => api.request(endpoint, { method: 'PUT', body }),
  delete: (endpoint) => api.request(endpoint, { method: 'DELETE' }),
};

export default api;