# HƯỚNG DẪN KHẮC PHỤC SỰ CỐ

## Lỗi khi cài đặt dependencies

### Lỗi: ENOSPC: no space left on device

**Nguyên nhân:** Ổ đĩa không đủ dung lượng.

**Giải pháp:**

1. Kiểm tra dung lượng ổ đĩa:
```bash
# Windows PowerShell
Get-PSDrive C
```

2. Giải phóng dung lượng:
   - Xóa Temp files: `%TEMP%`
   - Dọn dẹp Disk Cleanup
   - Xóa các node_modules cũ trong các dự án khác

3. Xóa cache npm:
```bash
npm cache clean --force
```

4. Cài đặt lại:
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### Lỗi: npm ERR! network

**Giải pháp:**

1. Kiểm tra kết nối internet
2. Thử registry khác:
```bash
npm config set registry https://registry.npmjs.org/
```

3. Hoặc dùng yarn:
```bash
npm install -g yarn
yarn install
```

---

## Lỗi kết nối MySQL

### ❌ Không thể kết nối MySQL

**Triệu chứng:**
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Giải pháp:**

1. Kiểm tra MySQL đang chạy:
```bash
# Windows Services
services.msc
# Tìm "MySQL80" và start
```

2. Kiểm tra port:
```sql
SHOW VARIABLES LIKE 'port';
```

3. Kiểm tra thông tin đăng nhập trong `.env`:
```env
DB_USER=root
DB_PASSWORD=<mật khẩu của bạn>
```

### ❌ Access denied for user

**Triệu chứng:**
```
Error: Access denied for user 'root'@'localhost'
```

**Giải pháp:**

1. Đăng nhập MySQL Workbench với thông tin đúng
2. Cập nhật mật khẩu trong `.env`
3. Hoặc tạo user mới:
```sql
CREATE USER 'taskuser'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON task_management.* TO 'taskuser'@'localhost';
FLUSH PRIVILEGES;
```

---

## Lỗi khi chạy server

### ❌ Error: Cannot find module

**Triệu chứng:**
```
Error: Cannot find module 'express'
```

**Giải pháp:**
```bash
npm install
```

### ❌ Port already in use

**Triệu chứng:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Giải pháp:**

1. Tìm process đang dùng port 3000:
```bash
# Windows PowerShell
netstat -ano | findstr :3000
```

2. Kill process:
```bash
taskkill /PID <PID> /F
```

3. Hoặc đổi PORT trong `.env`:
```env
PORT=3001
```

---

## Lỗi khi chạy test

### ❌ Jest open handle

**Triệu chứng:**
```
Jest did not exit one second after the test run has completed.
```

**Giải pháp:**

Đã xử lý trong code với `afterAll(() => pool.end())`, nhưng nếu vẫn gặp:

```bash
npm test -- --detectOpenHandles --forceExit
```

### ❌ Connection timeout

**Giải pháp:**

Tăng timeout trong `jest.config.js`:
```javascript
module.exports = {
  testTimeout: 30000, // 30 giây
};
```

---

## Lỗi validation

### ❌ 400 Bad Request khi tạo task

**Kiểm tra:**

1. Title không được rỗng
2. Status phải là: TODO, IN_PROGRESS, COMPLETED
3. Priority phải là: LOW, MEDIUM, HIGH
4. due_date đúng định dạng: YYYY-MM-DD

**Ví dụ đúng:**
```json
{
  "title": "Task mới",
  "status": "TODO",
  "priority": "HIGH",
  "due_date": "2026-12-31"
}
```

---

## Lỗi authentication

### ❌ 401 Unauthorized

**Nguyên nhân:**
1. Thiếu token trong header
2. Token không hợp lệ
3. Token hết hạn

**Giải pháo:**

1. Đảm bảo header đúng:
```
Authorization: Bearer <token>
```

2. Đăng nhập lại để lấy token mới

3. Kiểm tra JWT_SECRET trong `.env` không thay đổi

---

## Debug tips

### Xem log chi tiết

Trong file `src/middlewares/errorHandler.js`, uncomment:
```javascript
console.error(err.stack);
```

### Test kết nối database riêng

Tạo file `test-db.js`:
```javascript
const { pool } = require('./src/config/database');

async function test() {
  try {
    const [rows] = await pool.execute('SELECT 1 + 1 AS result');
    console.log('Database OK:', rows);
    process.exit(0);
  } catch (error) {
    console.error('Database Error:', error.message);
    process.exit(1);
  }
}

test();
```

Chạy:
```bash
node test-db.js
```

---

## Liên hệ hỗ trợ

Nếu vẫn gặp vấn đề, vui lòng cung cấp:
1. Thông báo lỗi đầy đủ
2. Node version: `node --version`
3. MySQL version: `mysql --version`
4. Hệ điều hành
5. Các bước đã thử
