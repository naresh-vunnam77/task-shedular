// middleware/auth.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../helpers/errorResponse');
const User = require('../models/UserModel');
const Task = require('../models/TaskModel');
// Protect Routes
const authenticateUser = asyncHandler(async (req, res, next) => {
  let token;
  // Check if Authorization header is present and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Extract the token from the Authorization header
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ErrorResponse('Unauthorized', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, "f6sdsABWqRZHEFfSnJVC9y4eBAY7RSfZ");
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(new ErrorResponse('Unauthorized', 401));
  }
});


// Authorize user based on task ownership
const authorizeUser = asyncHandler(async (req, res, next) => {
  const taskId = req.params.taskId;
  const createdBy = req.user.id;

  const task = await Task.findOne({ _id: taskId, createdBy });

  if (!task) {
    return res.status(403).json({ error: 'Forbidden - You do not have permission to perform this action' });
  }

  next();
});

module.exports = { authenticateUser, authorizeUser };
