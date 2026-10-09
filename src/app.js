const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const requestLogger = require('./middlewares/requestLogger');
const notFoundHandler = require('./middlewares/notFoundHandler');
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');

require('dotenv').config();

const app = express();

/**
 * ============================================
 * THỨ TỰ ĐĂNG KÝ MIDDLEWARE
 * ============================================
 *
 * 1. helmet()        — Thiết lập HTTP security headers.
 * 2. cors()          — Cấu hình Cross-Origin Resource Sharing.
 * 3. express.json()  — Parse JSON body (thay thế body-parser trong Express 5).
 * 4. requestLogger() — Ghi log mỗi HTTP request (morgan).
 *
 * Sau đó đăng ký các Router:
 * 5. /api/auth       — Authentication routes.
 * 6. /api/tasks      — Task CRUD routes (yêu cầu JWT).
 *
 * Cuối cùng là các handler cho lỗi:
 * 7. notFoundHandler — Xử lý endpoint không tồn tại (404).
 * 8. errorHandler    — Xử lý lỗi tập trung (4xx, 5xx).
 *
 * Cơ chế next():
 * - Mỗi middleware gọi next() để chuyển request đến middleware/route tiếp theo.
 * - Khi gọi next(error) hoặc throw error (Express 5 tự bắt async error),
 *   Express bỏ qua các middleware thường và chuyển đến error handler
 *   (middleware có 4 tham số: err, req, res, next).
 */

// 1. Security headers
app.use(helmet());

// 2. CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// 3. JSON parser
app.use(express.json());

// 4. Request logging
app.use(requestLogger());

// 5. Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server đang hoạt động', timestamp: new Date().toISOString() });
});

// 7. Not found handler — phải đăng ký SAU tất cả route
app.use(notFoundHandler);

// 8. Error handler — phải đăng ký CUỐI CÙNG
app.use(errorHandler);

module.exports = app;
