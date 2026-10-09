const { validationResult } = require('express-validator');

/**
 * Validation Middleware.
 *
 * Kiểm tra kết quả validation của express-validator.
 * Nếu có lỗi, trả về 400 Bad Request cùng danh sách lỗi.
 * Nếu hợp lệ, gọi next() để chuyển đến Controller.
 */
function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      statusCode: 400,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
}

module.exports = validateRequest;
