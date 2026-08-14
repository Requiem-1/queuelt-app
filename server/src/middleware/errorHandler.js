/**
 * Centralized Global Error Handling Middleware
 */

const notFound = (req, res, next) => {
  const error = new Error(`Resource not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error(`[Express Error Handler]: ${err.message}`, err.stack);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
