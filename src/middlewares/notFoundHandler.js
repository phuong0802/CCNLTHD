/**
 * Not Found Handler Middleware.
 *
 * Xử lý các request đến endpoint không tồn tại.
 * Đăng ký sau tất cả route, trước error-handling middleware.
 */
function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Không tìm thấy endpoint: ${req.method} ${req.originalUrl}`,
    statusCode: 404,
  });
}

module.exports = notFoundHandler;
