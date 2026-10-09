# HƯỚNG DẪN KIỂM THỬ CHI TIẾT

## Kiểm thử với Postman / Thunder Client

### Setup Collection

#### 1. Tạo Environment

**Name:** Task Management Local

**Variables:**
```
base_url: http://localhost:3000/api
token: <sẽ được set tự động sau login>
```

---

### Test Cases

#### AUTH-01: Đăng ký tài khoản thành công

**Request:**
```http
POST {{base_url}}/auth/register
Content-Type: application/json

{
  "username": "testuser001",
  "email": "testuser001@example.com",
  "password": "Password123!"
}
```

**Expected Response:**
- Status: 201 Created
- Body chứa: `success: true`, `data.id`, `data.username`, `data.email`
- Không có: `password`, `password_hash`

**Kiểm tra trong database:**
```sql
SELECT id, username, email FROM users WHERE username = 'testuser001';
```

---

#### AUTH-02: Đăng ký với username trùng

**Request:**
```http
POST {{base_url}}/auth/register
Content-Type: application/json

{
  "username": "testuser001",
  "email": "different@example.com",
  "password": "Password123!"
}
```

**Expected Response:**
- Status: 409 Conflict
- Body: `message` chứa "Username đã được sử dụng"

---

#### AUTH-03: Đăng nhập thành công

**Request:**
```http
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "testuser001@example.com",
  "password": "Password123!"
}
```

**Expected Response:**
- Status: 200 OK
- Body chứa: `data.user`, `data.token`
- **Lưu token vào environment variable**

**Script (Postman):**
```javascript
const response = pm.response.json();
if (response.data && response.data.token) {
    pm.environment.set("token", response.data.token);
}
```

---

#### TASK-01: Tạo task thành công

**Request:**
```http
POST {{base_url}}/tasks
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "title": "Hoàn thành báo cáo Express.js",
  "description": "Hoàn thiện chương kiến trúc và thực nghiệm",
  "status": "TODO",
  "priority": "HIGH",
  "due_date": "2026-10-20"
}
```

**Expected Response:**
- Status: 201 Created
- Body chứa: `data.id`, `data.title`, `data.user_id`

**Lưu task_id:**
```javascript
const response = pm.response.json();
if (response.data && response.data.id) {
    pm.environment.set("task_id", response.data.id);
}
```

**Kiểm tra database:**
```sql
SELECT * FROM tasks WHERE id = <task_id>;
```

---

#### TASK-02: Tạo task với title rỗng

**Request:**
```http
POST {{base_url}}/tasks
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "title": "",
  "status": "TODO"
}
```

**Expected Response:**
- Status: 400 Bad Request
- Body chứa: validation errors

---

#### TASK-03: Lấy danh sách task

**Request:**
```http
GET {{base_url}}/tasks
Authorization: Bearer {{token}}
```

**Expected Response:**
- Status: 200 OK
- Body chứa: `data` (array), `pagination`

---

#### TASK-04: Tìm kiếm task

**Request:**
```http
GET {{base_url}}/tasks?search=Express
Authorization: Bearer {{token}}
```

**Expected Response:**
- Status: 200 OK
- Các task trong `data` có title chứa "Express"

---

#### TASK-05: Lọc theo status

**Request:**
```http
GET {{base_url}}/tasks?status=TODO&priority=HIGH
Authorization: Bearer {{token}}
```

**Expected Response:**
- Status: 200 OK
- Tất cả task có `status: "TODO"` và `priority: "HIGH"`

---

#### TASK-06: Sắp xếp và phân trang

**Request:**
```http
GET {{base_url}}/tasks?page=1&limit=5&sortBy=created_at&order=desc
Authorization: Bearer {{token}}
```

**Expected Response:**
- Status: 200 OK
- `pagination.page = 1`, `pagination.limit = 5`
- Tasks được sắp xếp theo created_at giảm dần

---

#### TASK-07: Lấy chi tiết task

**Request:**
```http
GET {{base_url}}/tasks/{{task_id}}
Authorization: Bearer {{token}}
```

**Expected Response:**
- Status: 200 OK
- `data.id` khớp với `task_id`

---

#### TASK-08: Cập nhật task

**Request:**
```http
PATCH {{base_url}}/tasks/{{task_id}}
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "status": "IN_PROGRESS",
  "priority": "MEDIUM"
}
```

**Expected Response:**
- Status: 200 OK
- `data.status = "IN_PROGRESS"`
- `data.priority = "MEDIUM"`

**Kiểm tra database:**
```sql
SELECT status, priority FROM tasks WHERE id = {{task_id}};
```

---

#### TASK-09: Thay đổi trạng thái

**Request:**
```http
PATCH {{base_url}}/tasks/{{task_id}}/status
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "status": "COMPLETED"
}
```

**Expected Response:**
- Status: 200 OK
- `data.status = "COMPLETED"`

---

#### TASK-10: Xóa task

**Request:**
```http
DELETE {{base_url}}/tasks/{{task_id}}
Authorization: Bearer {{token}}
```

**Expected Response:**
- Status: 204 No Content
- Không có body

**Kiểm tra đã xóa:**
```http
GET {{base_url}}/tasks/{{task_id}}
Authorization: Bearer {{token}}
```
- Kết quả: 404 Not Found

---

#### SECURITY-01: Truy cập API không có token

**Request:**
```http
GET {{base_url}}/tasks
```

**Expected Response:**
- Status: 401 Unauthorized
- Message: "Token không được cung cấp"

---

#### SECURITY-02: Token không hợp lệ

**Request:**
```http
GET {{base_url}}/tasks
Authorization: Bearer invalid_token_here
```

**Expected Response:**
- Status: 401 Unauthorized
- Message: "Token không hợp lệ"

---

#### SECURITY-03: User A không truy cập task của User B

**Setup:**
1. Đăng ký user B
2. Đăng nhập user B, lưu token_b
3. Tạo task cho user B, lưu task_id_b

**Request (dùng token của user A):**
```http
GET {{base_url}}/tasks/{{task_id_b}}
Authorization: Bearer {{token}}
```

**Expected Response:**
- Status: 404 Not Found
- Message: "Không tìm thấy công việc"

---

## Checklist kiểm thử hoàn chỉnh

### Authentication (6 test cases)

- [ ] TC1: Đăng ký thành công
- [ ] TC2: Đăng ký username trùng → 409
- [ ] TC3: Đăng ký email trùng → 409
- [ ] TC4: Đăng ký dữ liệu không hợp lệ → 400
- [ ] TC5: Đăng nhập thành công → 200 + token
- [ ] TC6: Đăng nhập sai thông tin → 401

### Task CRUD (15 test cases)

- [ ] TC7: Tạo task thành công → 201
- [ ] TC8: Tạo task title rỗng → 400
- [ ] TC9: Tạo task status không hợp lệ → 400
- [ ] TC10: Lấy danh sách task → 200
- [ ] TC11: Phân trang → 200
- [ ] TC12: Tìm kiếm → 200
- [ ] TC13: Lọc status → 200
- [ ] TC14: Lọc priority → 200
- [ ] TC15: Sắp xếp → 200
- [ ] TC16: Lấy chi tiết task → 200
- [ ] TC17: Lấy task không tồn tại → 404
- [ ] TC18: Cập nhật task → 200
- [ ] TC19: Cập nhật body rỗng → 400
- [ ] TC20: Thay đổi trạng thái → 200
- [ ] TC21: Xóa task → 204

### Security (5 test cases)

- [ ] TC22: Truy cập API thiếu token → 401
- [ ] TC23: Token không hợp lệ → 401
- [ ] TC24: User A không xem task của B → 404
- [ ] TC25: User A không cập nhật task của B → 404
- [ ] TC26: User A không xóa task của B → 404

### Error Handling (3 test cases)

- [ ] TC27: Endpoint không tồn tại → 404
- [ ] TC28: JSON không hợp lệ → 400
- [ ] TC29: Validation lỗi trả đúng format

---

## Kiểm thử tự động với Jest

### Chạy tất cả test

```bash
npm test
```

### Chạy test cụ thể

```bash
npm test -- auth.test.js
npm test -- task.test.js
```

### Xem coverage

```bash
npm test -- --coverage
```

---

## Ghi chép kết quả

### Template báo cáo

| Test ID | Mô tả | Kết quả | Ghi chú |
|---------|-------|---------|---------|
| AUTH-01 | Đăng ký thành công | ✅ Pass | |
| AUTH-02 | Username trùng | ✅ Pass | |
| TASK-01 | Tạo task | ✅ Pass | Đã kiểm tra database |
| ... | ... | ... | ... |

### Ảnh chụp màn hình cần có

1. **Postman collection** với tất cả request
2. **Request/Response** của các API chính (Register, Login, Create Task, Get Tasks)
3. **MySQL Workbench** hiển thị dữ liệu sau khi tạo task
4. **Terminal** chạy server thành công
5. **Jest test results** với tất cả test pass
6. **Lỗi validation** (400 Bad Request)
7. **Lỗi unauthorized** (401)
8. **Luồng hoàn chỉnh**: Register → Login → Create → Read → Update → Delete

---

## Tips kiểm thử

1. **Dùng seed data:** Username và email trong seed.sql để test login nhanh
2. **Postman Environment:** Lưu token và task_id để tái sử dụng
3. **Kiểm tra database song song:** Dùng MySQL Workbench để verify dữ liệu
4. **Test negative cases:** Đừng chỉ test trường hợp thành công
5. **Document mọi thứ:** Chụp ảnh, ghi log, lưu response
