const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');
const { registerValidation, loginValidation } = require('../validators/auth.validator');

/**
 * Auth Router
 *
 * Khai báo endpoint và HTTP method cho Authentication API.
 * Gắn middleware validation và controller.
 * Không chứa logic nghiệp vụ hoặc SQL.
 *
 * Luồng:
 *   Router → Validation Middleware → Controller → Service → Repository → MySQL
 */

// POST /api/auth/register — Đăng ký tài khoản
router.post(
  '/register',
  registerValidation,      // Validation middleware
  validateRequest,         // Kiểm tra kết quả validation
  authController.register  // Controller xử lý
);

// POST /api/auth/login — Đăng nhập
router.post(
  '/login',
  loginValidation,        // Validation middleware
  validateRequest,        // Kiểm tra kết quả validation
  authController.login    // Controller xử lý
);

// GET /api/auth/me — Lấy thông tin tài khoản (yêu cầu JWT)
router.get(
  '/me',
  authMiddleware,          // Authentication middleware
  authController.getProfile
);

// POST /api/auth/logout — Đăng xuất (yêu cầu JWT)
router.post(
  '/logout',
  authMiddleware,          // Authentication middleware
  authController.logout
);

module.exports = router;
