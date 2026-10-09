const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

/**
 * Authentication Middleware.
 *
 * Xác thực JWT từ header Authorization: Bearer <token>.
 * Nếu hợp lệ, gắn thông tin user vào req.user để các
 * tầng phía sau sử dụng. Nếu không hợp lệ, chuyển lỗi
 * đến Error-Handling Middleware qua next().
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Token không được cung cấp'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Gắn thông tin user đã xác thực vào request
    req.user = {
      id: decoded.id,
      username: decoded.username,
    };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Token đã hết hạn'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(ApiError.unauthorized('Token không hợp lệ'));
    }
    return next(ApiError.unauthorized('Xác thực thất bại'));
  }
}

module.exports = authMiddleware;
