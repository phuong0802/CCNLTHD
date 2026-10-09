const { pool } = require('../config/database');

/**
 * TaskRepository - Tầng Repository cho bảng tasks.
 *
 * Chịu trách nhiệm duy nhất: thực thi truy vấn SQL đến bảng tasks.
 * Mọi truy vấn đều sử dụng parameterized queries.
 */
class TaskRepository {
  /**
   * Tìm task theo id.
   * @param {number} id
   * @returns {object|null}
   */
  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM tasks WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  /**
   * Tìm task theo id và user_id (kiểm tra quyền sở hữu ở tầng query).
   * @param {number} id
   * @param {number} userId
   * @returns {object|null}
   */
  async findByIdAndUserId(id, userId) {
    const [rows] = await pool.execute(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows[0] || null;
  }

  /**
   * Lấy danh sách task của user với phân trang, tìm kiếm, lọc, sắp xếp.
   *
   * @param {number} userId
   * @param {object} options - { page, limit, search, status, priority, sortBy, order }
   * @returns {{ tasks: object[], total: number }}
   */
  async findAllByUserId(userId, options = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      priority,
      sortBy = 'created_at',
      order = 'desc',
    } = options;

    // Xây dựng câu WHERE động
    const conditions = ['user_id = ?'];
    const params = [userId];

    if (search) {
      conditions.push('title LIKE ?');
      params.push(`%${search}%`);
    }

    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (priority) {
      conditions.push('priority = ?');
      params.push(priority);
    }

    const whereClause = conditions.join(' AND ');

    // Whitelist các cột được phép sắp xếp để tránh SQL injection
    const allowedSortColumns = ['created_at', 'updated_at', 'due_date', 'title', 'status', 'priority'];
    const safeSort = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const safeOrder = order === 'asc' ? 'ASC' : 'DESC';

    // Đếm tổng số bản ghi
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) AS total FROM tasks WHERE ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Tính offset cho phân trang
    const offset = (page - 1) * limit;

    // Truy vấn dữ liệu với LIMIT và OFFSET
    // Lưu ý: LIMIT và OFFSET không hỗ trợ placeholder trong mysql2 execute,
    // nên ép kiểu number an toàn trước khi truyền vào.
    const [tasks] = await pool.execute(
      `SELECT * FROM tasks WHERE ${whereClause} ORDER BY ${safeSort} ${safeOrder} LIMIT ${Number(limit)} OFFSET ${Number(offset)}`,
      params
    );

    return { tasks, total };
  }

  /**
   * Tạo task mới.
   * @param {object} taskData
   * @returns {object} - Task vừa tạo
   */
  async create({ user_id, title, description, status, priority, due_date }) {
    const [result] = await pool.execute(
      `INSERT INTO tasks (user_id, title, description, status, priority, due_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, title, description || null, status || 'TODO', priority || 'MEDIUM', due_date || null]
    );

    return this.findById(result.insertId);
  }

  /**
   * Cập nhật task.
   * @param {number} id
   * @param {object} updateData - Các trường cần cập nhật
   * @returns {object} - Task sau khi cập nhật
   */
  async update(id, updateData) {
    const allowedFields = ['title', 'description', 'status', 'priority', 'due_date'];
    const setClauses = [];
    const params = [];

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        setClauses.push(`${field} = ?`);
        params.push(updateData[field]);
      }
    }

    if (setClauses.length === 0) {
      return this.findById(id);
    }

    params.push(id);

    await pool.execute(
      `UPDATE tasks SET ${setClauses.join(', ')} WHERE id = ?`,
      params
    );

    return this.findById(id);
  }

  /**
   * Xóa task.
   * @param {number} id
   * @returns {boolean}
   */
  async deleteById(id) {
    const [result] = await pool.execute(
      'DELETE FROM tasks WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = new TaskRepository();
