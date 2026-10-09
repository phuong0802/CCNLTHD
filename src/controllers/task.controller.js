const taskService = require('../services/task.service');

/**
 * TaskController - Tầng Controller cho quản lý công việc.
 *
 * Đọc params, query, body từ request và thông tin user đã xác thực.
 * Gọi TaskService và trả về HTTP response.
 * Không chứa logic nghiệp vụ hay SQL.
 */
class TaskController {
  /**
   * GET /api/tasks
   * Lấy danh sách công việc với phân trang, tìm kiếm, lọc, sắp xếp.
   */
  async getTasks(req, res, next) {
    const userId = req.user.id;
    const result = await taskService.getTasks(userId, req.query);

    res.status(200).json({
      success: true,
      data: result.tasks,
      pagination: result.pagination,
    });
  }

  /**
   * GET /api/tasks/:id
   * Lấy chi tiết một công việc.
   */
  async getTaskById(req, res, next) {
    const taskId = parseInt(req.params.id, 10);
    const userId = req.user.id;

    const task = await taskService.getTaskById(taskId, userId);

    res.status(200).json({
      success: true,
      data: task,
    });
  }

  /**
   * POST /api/tasks
   * Tạo công việc mới.
   */
  async createTask(req, res, next) {
    const userId = req.user.id;
    const task = await taskService.createTask(userId, req.body);

    res.status(201).json({
      success: true,
      message: 'Tạo công việc thành công',
      data: task,
    });
  }

  /**
   * PATCH /api/tasks/:id
   * Cập nhật công việc.
   */
  async updateTask(req, res, next) {
    const taskId = parseInt(req.params.id, 10);
    const userId = req.user.id;

    const task = await taskService.updateTask(taskId, userId, req.body);

    res.status(200).json({
      success: true,
      message: 'Cập nhật công việc thành công',
      data: task,
    });
  }

  /**
   * PATCH /api/tasks/:id/status
   * Thay đổi trạng thái công việc.
   */
  async updateStatus(req, res, next) {
    const taskId = parseInt(req.params.id, 10);
    const userId = req.user.id;
    const { status } = req.body;

    const task = await taskService.updateTaskStatus(taskId, userId, status);

    res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái thành công',
      data: task,
    });
  }

  /**
   * DELETE /api/tasks/:id
   * Xóa công việc.
   */
  async deleteTask(req, res, next) {
    const taskId = parseInt(req.params.id, 10);
    const userId = req.user.id;

    await taskService.deleteTask(taskId, userId);

    res.status(204).send();
  }
}

module.exports = new TaskController();
