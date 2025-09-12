const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, isAdmin: user.isAdmin }, 
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// @desc    Register new user
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    username,
    email,
    hashedPassword: password,
    isAdmin: req.body.isAdmin || false,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user), // <-- FIXED
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
};

// @desc    Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user), 
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
};

module.exports = { registerUser, loginUser };
