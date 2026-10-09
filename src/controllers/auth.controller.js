const authService = require('../services/auth.service');

/**
 * AuthController - Tầng Controller cho xác thực.
 *
 * Đọc dữ liệu từ request, gọi Service, trả HTTP response.
 * Không chứa logic nghiệp vụ hay truy vấn SQL.
 */
class AuthController {
  /**
   * POST /api/auth/register
   * Đăng ký tài khoản mới.
   */
  async register(req, res, next) {
    const { username, email, password } = req.body;
    const user = await authService.register({ username, email, password });

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: user,
    });
  }

  /**
   * POST /api/auth/login
   * Đăng nhập.
   */
  async login(req, res, next) {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });

    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: result,
    });
  }

  /**
   * GET /api/auth/me
   * Lấy thông tin tài khoản đang đăng nhập.
   */
  async getProfile(req, res, next) {
    const user = await authService.getProfile(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  }

  /**
   * POST /api/auth/logout
   * Đăng xuất.
   *
   * Vì JWT là stateless, server không thể tự động vô hiệu hóa token.
   * Phía client cần xóa token đã lưu (localStorage, cookie...).
   * Hệ thống này KHÔNG triển khai token blacklist.
   * Đây là giới hạn được ghi nhận.
   */
  async logout(req, res, next) {
    res.status(200).json({
      success: true,
      message: 'Đăng xuất thành công. Vui lòng xóa token phía client.',
    });
  }
}

module.exports = new AuthController();
