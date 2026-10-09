const { pool } = require('../config/database');

/**
 * UserRepository - Tầng Repository cho bảng users.
 *
 * Chịu trách nhiệm duy nhất: thực thi truy vấn SQL đến bảng users.
 * Sử dụng parameterized queries để chống SQL injection.
 */
class UserRepository {
  /**
   * Tìm user theo username.
   * @param {string} username
   * @returns {object|null}
   */
  async findByUsername(username) {
    const [rows] = await pool.execute(
      'SELECT id, username, email, password_hash, created_at FROM users WHERE username = ?',
      [username]
    );
    return rows[0] || null;
  }

  /**
   * Tìm user theo email.
   * @param {string} email
   * @returns {object|null}
   */
  async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT id, username, email, password_hash, created_at FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  }

  /**
   * Tìm user theo id (không trả password_hash).
   * @param {number} id
   * @returns {object|null}
   */
  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  /**
   * Tạo user mới.
   * @param {object} userData - { username, email, password_hash }
   * @returns {object} - User vừa tạo (không có password_hash)
   */
  async create({ username, email, password_hash }) {
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, password_hash]
    );
    return {
      id: result.insertId,
      username,
      email,
    };
  }
}

module.exports = new UserRepository();
