/**
 * Lightweight Request Payload Validation Middleware
 */

const validate = (requiredFields = []) => {
  return (req, res, next) => {
    const missing = [];
    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required field(s): ${missing.join(', ')}`,
        errors: missing.map((f) => ({ field: f, message: `${f} is required` })),
      });
    }

    next();
  };
};

module.exports = {
  validate,
};
