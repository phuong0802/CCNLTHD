-- ============================================
-- Task Management System - Seed Data
-- Dữ liệu mẫu phục vụ kiểm thử
-- ============================================
-- Lưu ý: Mật khẩu trong seed data đã được băm bằng bcrypt.
-- Mật khẩu gốc của cả hai tài khoản là: Password123!
-- Hash được tạo với saltRounds = 10.

USE task_management;

-- ============================================
-- Dữ liệu mẫu cho bảng users
-- ============================================
INSERT INTO users (username, email, password_hash) VALUES
  ('nguyenvana', 'nguyenvana@example.com', '$2b$10$kIxVp5h5v5G8v5G8v5G8vOhVq9Kz2E5rWxT3fN6mJ1pL4oA8dCy2i'),
  ('tranthib', 'tranthib@example.com', '$2b$10$kIxVp5h5v5G8v5G8v5G8vOhVq9Kz2E5rWxT3fN6mJ1pL4oA8dCy2i');

-- ============================================
-- Dữ liệu mẫu cho bảng tasks
-- ============================================
INSERT INTO tasks (user_id, title, description, status, priority, due_date) VALUES
  -- Công việc của nguyenvana (user_id = 1)
  (1, 'Hoàn thành báo cáo Express.js', 'Hoàn thiện chương kiến trúc và thực nghiệm cho môn CCNLTHD', 'IN_PROGRESS', 'HIGH', '2026-10-20'),
  (1, 'Nghiên cứu Middleware trong Express', 'Tìm hiểu cơ chế next() và thứ tự middleware', 'COMPLETED', 'MEDIUM', '2026-10-10'),
  (1, 'Thiết kế database MySQL', 'Tạo schema cho hệ thống quản lý công việc', 'COMPLETED', 'HIGH', '2026-10-08'),
  (1, 'Viết test cases', 'Viết unit test và integration test cho API', 'TODO', 'MEDIUM', '2026-10-25'),
  (1, 'Review mã nguồn', 'Kiểm tra lại toàn bộ mã nguồn trước khi nộp', 'TODO', 'LOW', '2026-10-28'),

  -- Công việc của tranthib (user_id = 2)
  (2, 'Học Node.js cơ bản', 'Hoàn thành khóa học Node.js trên Udemy', 'COMPLETED', 'HIGH', '2026-10-05'),
  (2, 'Làm bài tập React', 'Bài tập về Component và Props', 'IN_PROGRESS', 'MEDIUM', '2026-10-15'),
  (2, 'Chuẩn bị thuyết trình', 'Chuẩn bị slide cho buổi thuyết trình cuối kỳ', 'TODO', 'HIGH', '2026-10-22');
