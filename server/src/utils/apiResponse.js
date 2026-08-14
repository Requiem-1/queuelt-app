/**
 * Standardized API Response Envelope
 */

const success = (res, data = null, message = 'Success', statusCode = 200, meta = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data !== null ? { data, ...((typeof data === 'object' && !Array.isArray(data)) ? data : {}) } : {}),
    ...(Object.keys(meta).length > 0 ? { meta } : {}),
  });
};

const error = (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
};

module.exports = {
  success,
  error,
};
