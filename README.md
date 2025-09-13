# MovieHub 🎬

A modern, full-stack movie review and discovery platform built with React, Node.js, and MongoDB. Users can discover movies, write reviews, manage watchlists, and explore recommendations in a beautifully designed interface.

## ✨ Features

### 🎯 Core Features
- **Movie Discovery**: Browse and search through a curated collection of movies
- **Advanced Filtering**: Filter by genre, release year, rating, and search terms
- **User Reviews**: Write and read detailed movie reviews with star ratings
- **Personal Watchlist**: Save movies to watch later with easy management
- **User Profiles**: View user activity, reviews, and watchlist history
- **Movie Recommendations**: Get personalized suggestions based on genres

### 🔐 Authentication & Authorization
- Secure user registration and login with JWT tokens
- Password hashing with bcrypt
- Protected routes for authenticated users
- Admin-only features for content management

### 👑 Admin Features
- Add new movies to the database
- Admin dashboard with platform statistics
- Special admin privileges and UI indicators
- Content management capabilities

### 🎨 Modern UI/UX
- Responsive design that works on all devices
- Dark theme with glass morphism effects
- Smooth animations and hover effects
- Loading states and error handling
- Gradient accents and modern typography

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Context API** - State management

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Clone Repository
```bash
git clone https://github.com/yourusername/moviehub.git
cd moviehub
```

### Backend Setup
```bash
cd backend
npm install

# Create .env file
echo "MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key" > .env

# Start the server
npm start
```

### Frontend Setup
```bash
cd frontend
npm install

# Start the development server
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## 📁 Project Structure

```
moviehub/
├── backend/
│   ├── controllers/         # Request handlers
│   │   ├── authController.js
│   │   ├── movieController.js
│   │   ├── reviewController.js
│   │   └── userController.js
│   ├── middleware/          # Custom middleware
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/              # MongoDB schemas
│   │   ├── Movie.js
│   │   ├── Review.js
│   │   ├── User.js
│   │   └── Watchlist.js
│   ├── routes/              # API routes
│   │   ├── authRoutes.js
│   │   ├── movieRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   └── db.js           # Database connection
│   ├── .env                # Environment variables
│   └── server.js           # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── MovieCard.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── StarRating.jsx
│   │   │   └── ...
│   │   ├── pages/           # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── MovieList.jsx
│   │   │   ├── MovieDetail.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── ...
│   │   ├── context/         # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── api/             # API utilities
│   │   │   └── api.js
│   │   └── App.jsx          # Main app component
│   ├── public/
│   └── package.json
└── README.md
```

## 🔧 Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/moviehub
PORT=5000
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Movies
- `GET /api/movies` - Get all movies (with filtering)
- `GET /api/movies/:id` - Get movie details with reviews
- `POST /api/movies` - Add new movie (Admin only)

### Reviews
- `GET /api/reviews/:movieId` - Get reviews for a movie
- `POST /api/reviews/:movieId` - Submit review (Auth required)

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile (Auth required)
- `GET /api/users/:id/watchlist` - Get user watchlist (Auth required)
- `POST /api/users/:id/watchlist` - Add to watchlist (Auth required)
- `DELETE /api/users/:id/watchlist/:movieId` - Remove from watchlist (Auth required)

## 🎨 Key Features Walkthrough

### Movie Discovery
- Browse all movies with pagination
- Filter by genre, year, rating
- Real-time search functionality
- Responsive grid layout

### User Authentication
- Secure JWT-based authentication
- Password hashing with bcrypt
- Protected routes and middleware
- Persistent login sessions

### Review System
- 5-star rating system with interactive UI
- Rich text reviews
- User attribution and timestamps
- Average rating calculations

### Watchlist Management
- Add/remove movies with one click
- Personal watchlist view
- Visual indicators for saved movies
- Easy watchlist access from profile

### Admin Dashboard
- Platform statistics overview
- Add new movies with comprehensive form
- Admin-only routes and permissions
- Content management tools

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide React](https://lucide.dev/) for beautiful icons
- [MongoDB Atlas](https://www.mongodb.com/atlas) for cloud database hosting
- Movie poster images from various sources (ensure you have proper licensing)



## Project Link: [https://github.com/NehaSindhwani01/movie_review_platform_assignment]([https://github.com/NehaSindhwani01/movie_review_platform_assignment])

---

