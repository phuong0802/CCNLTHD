const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');
const ApiError = require('../utils/ApiError');

/**
 * AuthService - Tầng Service cho nghiệp vụ xác thực.
 *
 * Thực hiện logic nghiệp vụ: kiểm tra trùng lặp, băm mật khẩu,
 * so sánh mật khẩu, tạo JWT. Không xử lý HTTP request/response.
 */
class AuthService {
  /**
   * Đăng ký tài khoản mới.
   * @param {object} data - { username, email, password }
   * @returns {object} - Thông tin user (không có password)
   */
  async register({ username, email, password }) {
    // Kiểm tra username đã tồn tại
    const existingUsername = await userRepository.findByUsername(username);
    if (existingUsername) {
      throw ApiError.conflict('Username đã được sử dụng');
    }

    // Kiểm tra email đã tồn tại
    const existingEmail = await userRepository.findByEmail(email);
    if (existingEmail) {
      throw ApiError.conflict('Email đã được sử dụng');
    }

    // Băm mật khẩu bằng bcrypt
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Lưu user vào database
    const user = await userRepository.create({ username, email, password_hash });

    return user;
  }

  /**
   * Đăng nhập.
   * @param {object} data - { email, password }
   * @returns {object} - { user, token }
   */
  async login({ email, password }) {
    // Tìm user theo email
    const user = await userRepository.findByEmail(email);
    if (!user) {
      // Không tiết lộ email có tồn tại hay không
      throw ApiError.unauthorized('Email hoặc mật khẩu không chính xác');
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw ApiError.unauthorized('Email hoặc mật khẩu không chính xác');
    }

    // Tạo JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // Trả user không có password_hash
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
      },
      token,
    };
  }

  /**
   * Lấy thông tin tài khoản đang đăng nhập.
   * @param {number} userId
   * @returns {object}
   */
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw ApiError.notFound('Không tìm thấy tài khoản');
    }
    return user;
  }
}

module.exports = new AuthService();
