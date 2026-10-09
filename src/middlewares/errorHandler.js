const ApiError = require('../utils/ApiError');

/**
 * Centralized Error-Handling Middleware.
 *
 * Trong Express 5, middleware xử lý lỗi vẫn có chữ ký 4 tham số:
 * (err, req, res, next). Express 5 tự động bắt lỗi từ async route/middleware
 * và chuyển đến error handler, không cần try-catch thủ công.
 *
 * Phân loại lỗi:
 * - ApiError: Lỗi nghiệp vụ đã biết (4xx) — trả statusCode và message.
 * - ValidationError (express-validator): Lỗi validation — trả 400.
 * - SyntaxError (body-parser): JSON không hợp lệ — trả 400.
 * - Lỗi khác: Lỗi hệ thống không mong đợi — trả 500.
 *
 * Không trả stack trace cho client trong production.
 */
function errorHandler(err, req, res, next) {
  // Ghi log lỗi phía server
  console.error(`[Error] ${err.name}: ${err.message}`);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  // Lỗi nghiệp vụ từ ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      statusCode: err.statusCode,
    });
  }

  // Lỗi JSON không hợp lệ từ body-parser
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'JSON không hợp lệ',
      statusCode: 400,
    });
  }

  // Lỗi MySQL: duplicate entry (ER_DUP_ENTRY)
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'Dữ liệu đã tồn tại',
      statusCode: 409,
    });
  }

  // Lỗi hệ thống không mong đợi
  const statusCode = 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Lỗi máy chủ nội bộ'
    : err.message || 'Lỗi máy chủ nội bộ';

  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
}

module.exports = errorHandler;
