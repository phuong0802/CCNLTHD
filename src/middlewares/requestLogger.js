const morgan = require('morgan');

/**
 * Request Logger Middleware.
 *
 * Sử dụng morgan với format 'dev' cho môi trường phát triển
 * và 'combined' cho production.
 *
 * Lưu ý: Không ghi token, password hoặc thông tin nhạy cảm vào log.
 * Morgan mặc định chỉ ghi method, url, status, response time.
 */
function requestLogger() {
  const format = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
  return morgan(format);
}

module.exports = requestLogger;
