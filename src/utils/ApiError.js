/**
 * ApiError - Lớp lỗi ứng dụng tùy chỉnh.
 *
 * Mở rộng Error để mang theo statusCode, giúp Error-Handling Middleware
 * phân biệt giữa lỗi nghiệp vụ (4xx) và lỗi hệ thống (5xx).
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code (400, 401, 403, 404, 409, 500...)
   * @param {string} message - Thông báo lỗi gửi về client
   */
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
    // Đảm bảo stack trace chính xác trong V8
    Error.captureStackTrace(this, this.constructor);
  }

  // Factory methods cho các loại lỗi phổ biến
  static badRequest(message = 'Dữ liệu không hợp lệ') {
    return new ApiError(400, message);
  }

  static unauthorized(message = 'Chưa xác thực') {
    return new ApiError(401, message);
  }

  static forbidden(message = 'Không có quyền truy cập') {
    return new ApiError(403, message);
  }

  static notFound(message = 'Không tìm thấy tài nguyên') {
    return new ApiError(404, message);
  }

  static conflict(message = 'Dữ liệu bị trùng lặp') {
    return new ApiError(409, message);
  }

  static internal(message = 'Lỗi máy chủ') {
    return new ApiError(500, message);
  }
}

module.exports = ApiError;
