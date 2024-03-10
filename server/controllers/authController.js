const crypto = require('crypto');
const ErrorResponse = require('../helpers/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/UserModel');

// @desc    Register User
// @route   POST /api/v1/auth/register
// @access  Private

const register = asyncHandler(async (req, res, next) => {
  // Check if user Exists
  const email = req.body.email;

  let user = await User.findOne({ email });

  if (user) {
    return res.status(400).json({
      success: false,
      message: 'User already exists'
    });
  }

  // Create User

  user = await User.create(req.body);

  sendTokenResponse(user, 200, res);
});

// @desc    Login User
// @route   POST /api/v1/auth/login
// @access  Public

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse('Please check your email and/or password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    res.status(404).json({
      success: false,
      message: 'User does not exist, please check your email.'
    });
  }

  // Match Password
  const passwordMatch = await user.matchPasswords(password);

  if (!passwordMatch) {
    res.status(401).json({
      success: false,
      message: 'Invalid Credentials, Check Email/Password'
    });
  }

  sendTokenResponse(user, 200, res);
});

// Get token and create cookie
const sendTokenResponse = (user, statusCode, res) => {
  // Create Token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({ success: true, token, user: {id:user.id , email:user.email} });
};



// @desc    User Logout
// @route   POST /api/v1/auth/logout
// @access  Private

const logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 2000),
    httpOnly: true
  });
  res.status(200).json({});
});

module.exports = { register, login, logout };
