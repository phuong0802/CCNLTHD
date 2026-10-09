# API Endpoints Mapping - Ánh xạ API đến các lớp

## Authentication Routes

### POST /api/auth/register

| Lớp | File | Function/Method |
|-----|------|----------------|
| **Router** | `src/routes/auth.routes.js` | `router.post('/register', ...)` |
| **Validation** | `src/validators/auth.validator.js` | `registerValidation` |
| **Validate Check** | `src/middlewares/validateRequest.js` | `validateRequest()` |
| **Controller** | `src/controllers/auth.controller.js` | `register()` |
| **Service** | `src/services/auth.service.js` | `register()` |
| **Repository** | `src/repositories/user.repository.js` | `findByUsername()`, `findByEmail()`, `create()` |
| **Database** | MySQL | `SELECT`, `INSERT INTO users` |

### POST /api/auth/login

| Lớp | File | Function/Method |
|-----|------|----------------|
| **Router** | `src/routes/auth.routes.js` | `router.post('/login', ...)` |
| **Validation** | `src/validators/auth.validator.js` | `loginValidation` |
| **Validate Check** | `src/middlewares/validateRequest.js` | `validateRequest()` |
| **Controller** | `src/controllers/auth.controller.js` | `login()` |
| **Service** | `src/services/auth.service.js` | `login()` |
| **Repository** | `src/repositories/user.repository.js` | `findByEmail()` |
| **Database** | MySQL | `SELECT FROM users WHERE email = ?` |

### GET /api/auth/me

| Lớp | File | Function/Method |
|-----|------|----------------|
| **Router** | `src/routes/auth.routes.js` | `router.get('/me', ...)` |
| **Auth Middleware** | `src/middlewares/authMiddleware.js` | `authMiddleware()` |
| **Controller** | `src/controllers/auth.controller.js` | `getProfile()` |
| **Service** | `src/services/auth.service.js` | `getProfile()` |
| **Repository** | `src/repositories/user.repository.js` | `findById()` |
| **Database** | MySQL | `SELECT FROM users WHERE id = ?` |

---

## Task Routes

### GET /api/tasks

| Lớp | File | Function/Method |
|-----|------|----------------|
| **Router** | `src/routes/task.routes.js` | `router.get('/', ...)` |
| **Auth Middleware** | `src/middlewares/authMiddleware.js` | `authMiddleware()` |
| **Validation** | `src/validators/task.validator.js` | `listTasksValidation` |
| **Validate Check** | `src/middlewares/validateRequest.js` | `validateRequest()` |
| **Controller** | `src/controllers/task.controller.js` | `getTasks()` |
| **Service** | `src/services/task.service.js` | `getTasks()` |
| **Repository** | `src/repositories/task.repository.js` | `findAllByUserId()` |
| **Database** | MySQL | `SELECT FROM tasks WHERE user_id = ? ... LIMIT OFFSET` |

### GET /api/tasks/:id

| Lớp | File | Function/Method |
|-----|------|----------------|
| **Router** | `src/routes/task.routes.js` | `router.get('/:id', ...)` |
| **Auth Middleware** | `src/middlewares/authMiddleware.js` | `authMiddleware()` |
| **Validation** | `src/validators/task.validator.js` | `taskIdValidation` |
| **Validate Check** | `src/middlewares/validateRequest.js` | `validateRequest()` |
| **Controller** | `src/controllers/task.controller.js` | `getTaskById()` |
| **Service** | `src/services/task.service.js` | `getTaskById()` |
| **Repository** | `src/repositories/task.repository.js` | `findByIdAndUserId()` |
| **Database** | MySQL | `SELECT FROM tasks WHERE id = ? AND user_id = ?` |

### POST /api/tasks

| Lớp | File | Function/Method |
|-----|------|----------------|
| **Router** | `src/routes/task.routes.js` | `router.post('/', ...)` |
| **Auth Middleware** | `src/middlewares/authMiddleware.js` | `authMiddleware()` |
| **Validation** | `src/validators/task.validator.js` | `createTaskValidation` |
| **Validate Check** | `src/middlewares/validateRequest.js` | `validateRequest()` |
| **Controller** | `src/controllers/task.controller.js` | `createTask()` |
| **Service** | `src/services/task.service.js` | `createTask()` |
| **Repository** | `src/repositories/task.repository.js` | `create()` |
| **Database** | MySQL | `INSERT INTO tasks (user_id, title, ...) VALUES (?, ?, ...)` |

### PATCH /api/tasks/:id

| Lớp | File | Function/Method |
|-----|------|----------------|
| **Router** | `src/routes/task.routes.js` | `router.patch('/:id', ...)` |
| **Auth Middleware** | `src/middlewares/authMiddleware.js` | `authMiddleware()` |
| **Validation** | `src/validators/task.validator.js` | `updateTaskValidation` |
| **Validate Check** | `src/middlewares/validateRequest.js` | `validateRequest()` |
| **Controller** | `src/controllers/task.controller.js` | `updateTask()` |
| **Service** | `src/services/task.service.js` | `updateTask()` |
| **Repository** | `src/repositories/task.repository.js` | `findByIdAndUserId()`, `update()` |
| **Database** | MySQL | `UPDATE tasks SET ... WHERE id = ?` |

### PATCH /api/tasks/:id/status

| Lớp | File | Function/Method |
|-----|------|----------------|
| **Router** | `src/routes/task.routes.js` | `router.patch('/:id/status', ...)` |
| **Auth Middleware** | `src/middlewares/authMiddleware.js` | `authMiddleware()` |
| **Validation** | `src/validators/task.validator.js` | `updateStatusValidation` |
| **Validate Check** | `src/middlewares/validateRequest.js` | `validateRequest()` |
| **Controller** | `src/controllers/task.controller.js` | `updateStatus()` |
| **Service** | `src/services/task.service.js` | `updateTaskStatus()` |
| **Repository** | `src/repositories/task.repository.js` | `findByIdAndUserId()`, `update()` |
| **Database** | MySQL | `UPDATE tasks SET status = ? WHERE id = ?` |

### DELETE /api/tasks/:id

| Lớp | File | Function/Method |
|-----|------|----------------|
| **Router** | `src/routes/task.routes.js` | `router.delete('/:id', ...)` |
| **Auth Middleware** | `src/middlewares/authMiddleware.js` | `authMiddleware()` |
| **Validation** | `src/validators/task.validator.js` | `taskIdValidation` |
| **Validate Check** | `src/middlewares/validateRequest.js` | `validateRequest()` |
| **Controller** | `src/controllers/task.controller.js` | `deleteTask()` |
| **Service** | `src/services/task.service.js` | `deleteTask()` |
| **Repository** | `src/repositories/task.repository.js` | `findByIdAndUserId()`, `deleteById()` |
| **Database** | MySQL | `DELETE FROM tasks WHERE id = ?` |

---

## Middleware Chain - Thứ tự thực thi

### Global Middleware (áp dụng cho tất cả request)

1. `helmet()` - HTTP security headers
2. `cors()` - Cross-Origin Resource Sharing
3. `express.json()` - Parse JSON body
4. `requestLogger()` - Log request (morgan)

### Route-specific Middleware

**Authentication routes:** Validation → Controller

**Task routes:** Auth → Validation → Controller

### Error Handling

- Lỗi từ bất kỳ tầng nào → `errorHandler()` middleware
- Not found → `notFoundHandler()` middleware

---

## Luồng dữ liệu chi tiết - POST /api/tasks

```
1. HTTP Request
   ↓
2. express.json() parse body
   ↓
3. morgan log request
   ↓
4. router match "/api/tasks" POST
   ↓
5. authMiddleware() verify JWT
   ├─ Lấy token từ header "Authorization: Bearer <token>"
   ├─ jwt.verify(token, JWT_SECRET)
   ├─ Gắn user.id vào req.user
   └─ next()
   ↓
6. createTaskValidation (express-validator)
   ├─ Kiểm tra title không rỗng
   ├─ Kiểm tra status hợp lệ
   ├─ Kiểm tra priority hợp lệ
   └─ Kiểm tra due_date format
   ↓
7. validateRequest()
   ├─ Đọc kết quả validation
   ├─ Nếu có lỗi: return 400
   └─ Nếu hợp lệ: next()
   ↓
8. taskController.createTask()
   ├─ Đọc req.user.id (từ JWT)
   ├─ Đọc req.body
   └─ Gọi taskService.createTask(userId, body)
   ↓
9. taskService.createTask()
   ├─ Chuẩn bị taskData với user_id từ JWT
   └─ Gọi taskRepository.create(taskData)
   ↓
10. taskRepository.create()
    ├─ pool.execute("INSERT INTO tasks ...")
    └─ Return task object
    ↓
11. Service → Controller
    ↓
12. Controller trả HTTP 201 + JSON
```

---

## Security Checkpoints

| Điểm kiểm tra | Mục đích |
|---------------|----------|
| **helmet()** | Thiết lập security headers (X-XSS-Protection, etc.) |
| **CORS** | Chặn request từ origin không được phép |
| **JWT verify** | Xác thực user đã đăng nhập |
| **Validation** | Chặn dữ liệu không hợp lệ (XSS, injection) |
| **Parameterized queries** | Chống SQL injection |
| **user_id check** | Đảm bảo user chỉ truy cập task của mình |
| **bcrypt** | Bảo vệ password |

---

## Error Propagation - Cơ chế xử lý lỗi

```
Repository throw Error
    ↓
Service catch và throw ApiError
    ↓
Controller không catch (Express 5 auto catch async)
    ↓
errorHandler middleware
    ↓
HTTP Error Response
```

**Ví dụ:**

```javascript
// Repository
async findById(id) {
  const [rows] = await pool.execute('SELECT * FROM tasks WHERE id = ?', [id]);
  // MySQL error → throw tự động
  return rows[0] || null;
}

// Service
async getTaskById(taskId, userId) {
  const task = await taskRepository.findByIdAndUserId(taskId, userId);
  if (!task) {
    throw ApiError.notFound('Không tìm thấy công việc');
  }
  return task;
}

// Controller (Express 5 auto-catch async errors)
async getTaskById(req, res, next) {
  const task = await taskService.getTaskById(taskId, userId);
  // Lỗi từ service tự động chuyển đến errorHandler
  res.status(200).json({ success: true, data: task });
}

// Error Handler
function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      statusCode: err.statusCode,
    });
  }
  // ...
}
```
