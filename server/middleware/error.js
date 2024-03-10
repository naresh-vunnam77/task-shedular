const ErrorResponse = require('../helpers/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  // log to console for Dev
  // console.log(err);

  // Mongoose Bad ObjectId
  if (err.name === 'CastError') {
    const message = 'No Data Found';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose Duplicate entry error
  if (err.code === 11000) {
    const message = 'Duplicate Entry';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  if (err.name === 'User already exists') {
    const message = 'User already exists';
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Internal Server Error',
    status: error.statusCode
  });
};

module.exports = errorHandler;
