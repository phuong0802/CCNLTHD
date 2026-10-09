const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const {
  taskIdValidation,
  createTaskValidation,
  updateTaskValidation,
  updateStatusValidation,
  listTasksValidation,
} = require('../validators/task.validator');

/**
 * Task Router
 *
 * Tất cả các route đều yêu cầu JWT Authentication.
 * authMiddleware được áp dụng cho toàn bộ router.
 *
 * Luồng:
 *   Router → Auth Middleware → Validation → Controller → Service → Repository → MySQL
 */

// Áp dụng auth middleware cho tất cả task routes
router.use(authMiddleware);

// GET /api/tasks — Lấy danh sách công việc (phân trang, tìm kiếm, lọc, sắp xếp)
router.get(
  '/',
  listTasksValidation,
  validateRequest,
  taskController.getTasks
);

// GET /api/tasks/:id — Lấy chi tiết một công việc
router.get(
  '/:id',
  taskIdValidation,
  validateRequest,
  taskController.getTaskById
);

// POST /api/tasks — Tạo công việc mới
router.post(
  '/',
  createTaskValidation,
  validateRequest,
  taskController.createTask
);

// PATCH /api/tasks/:id — Cập nhật công việc
router.patch(
  '/:id',
  updateTaskValidation,
  validateRequest,
  taskController.updateTask
);

// PATCH /api/tasks/:id/status — Thay đổi trạng thái công việc
router.patch(
  '/:id/status',
  updateStatusValidation,
  validateRequest,
  taskController.updateStatus
);

// DELETE /api/tasks/:id — Xóa công việc
router.delete(
  '/:id',
  taskIdValidation,
  validateRequest,
  taskController.deleteTask
);

module.exports = router;
