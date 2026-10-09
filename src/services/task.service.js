const taskRepository = require('../repositories/task.repository');
const ApiError = require('../utils/ApiError');

/**
 * TaskService - Tầng Service cho nghiệp vụ quản lý công việc.
 *
 * Thực hiện logic nghiệp vụ: kiểm tra quyền sở hữu, xác thực
 * dữ liệu nghiệp vụ. Phối hợp với TaskRepository để truy vấn database.
 */
class TaskService {
  /**
   * Lấy danh sách task của user với phân trang, tìm kiếm, lọc, sắp xếp.
   * @param {number} userId
   * @param {object} query - { page, limit, search, status, priority, sortBy, order }
   * @returns {object}
   */
  async getTasks(userId, query) {
    const { tasks, total } = await taskRepository.findAllByUserId(userId, query);

    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const totalPages = Math.ceil(total / limit);

    return {
      tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Lấy chi tiết một task.
   * Kiểm tra quyền sở hữu: chỉ chủ sở hữu mới được xem.
   * @param {number} taskId
   * @param {number} userId
   * @returns {object}
   */
  async getTaskById(taskId, userId) {
    const task = await taskRepository.findByIdAndUserId(taskId, userId);
    if (!task) {
      // Trả 404 cho cả trường hợp task không tồn tại và task thuộc user khác
      // để tránh lộ thông tin
      throw ApiError.notFound('Không tìm thấy công việc');
    }
    return task;
  }

  /**
   * Tạo task mới.
   * @param {number} userId - Từ JWT, không từ client
   * @param {object} data - { title, description, status, priority, due_date }
   * @returns {object}
   */
  async createTask(userId, data) {
    const taskData = {
      user_id: userId,
      title: data.title,
      description: data.description || null,
      status: data.status || 'TODO',
      priority: data.priority || 'MEDIUM',
      due_date: data.due_date || null,
    };

    const task = await taskRepository.create(taskData);
    return task;
  }

  /**
   * Cập nhật task.
   * Kiểm tra quyền sở hữu trước khi cập nhật.
   * @param {number} taskId
   * @param {number} userId
   * @param {object} data - Các trường cần cập nhật
   * @returns {object}
   */
  async updateTask(taskId, userId, data) {
    // Kiểm tra task tồn tại và thuộc user hiện tại
    const existingTask = await taskRepository.findByIdAndUserId(taskId, userId);
    if (!existingTask) {
      throw ApiError.notFound('Không tìm thấy công việc');
    }

    // Lọc các trường được phép cập nhật
    const allowedFields = ['title', 'description', 'status', 'priority', 'due_date'];
    const updateData = {};
    let hasUpdate = false;

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
        hasUpdate = true;
      }
    }

    if (!hasUpdate) {
      throw ApiError.badRequest('Không có trường nào được cập nhật');
    }

    const task = await taskRepository.update(taskId, updateData);
    return task;
  }

  /**
   * Thay đổi trạng thái task.
   * @param {number} taskId
   * @param {number} userId
   * @param {string} status
   * @returns {object}
   */
  async updateTaskStatus(taskId, userId, status) {
    const existingTask = await taskRepository.findByIdAndUserId(taskId, userId);
    if (!existingTask) {
      throw ApiError.notFound('Không tìm thấy công việc');
    }

    const task = await taskRepository.update(taskId, { status });
    return task;
  }

  /**
   * Xóa task.
   * Kiểm tra quyền sở hữu trước khi xóa.
   * @param {number} taskId
   * @param {number} userId
   * @returns {boolean}
   */
  async deleteTask(taskId, userId) {
    const existingTask = await taskRepository.findByIdAndUserId(taskId, userId);
    if (!existingTask) {
      throw ApiError.notFound('Không tìm thấy công việc');
    }

    await taskRepository.deleteById(taskId);
    return true;
  }
}

module.exports = new TaskService();
