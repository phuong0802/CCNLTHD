const request = require('supertest');
const app = require('../src/app');
const { pool } = require('../src/config/database');

/**
 * Task API Integration Tests
 *
 * Các test case:
 * 1. Tạo task thành công
 * 2. Tạo task thất bại với title rỗng
 * 3. Tạo task thất bại với status không hợp lệ
 * 4. Tạo task thất bại với priority không hợp lệ
 * 5. Lấy danh sách task thành công
 * 6. Lấy danh sách task với phân trang
 * 7. Tìm kiếm task theo tiêu đề
 * 8. Lọc task theo status
 * 9. Lọc task theo priority
 * 10. Sắp xếp task
 * 11. Lấy chi tiết task thành công
 * 12. Lấy chi tiết task không tồn tại
 * 13. Cập nhật task thành công
 * 14. Cập nhật task với body rỗng
 * 15. Thay đổi trạng thái task thành công
 * 16. Thay đổi trạng thái với giá trị không hợp lệ
 * 17. Xóa task thành công
 * 18. Xóa task không tồn tại
 * 19. User A không được truy cập task của user B
 * 20. Truy cập API được bảo vệ khi thiếu token
 */

describe('Task API Tests', () => {
  let authTokenUserA;
  let authTokenUserB;
  let taskIdUserA;
  let taskIdUserB;

  const userA = {
    username: `usera_${Date.now()}`,
    email: `usera_${Date.now()}@example.com`,
    password: 'Password123!',
  };

  const userB = {
    username: `userb_${Date.now()}`,
    email: `userb_${Date.now()}@example.com`,
    password: 'Password123!',
  };

  // Setup: Đăng ký và đăng nhập 2 user
  beforeAll(async () => {
    // Đăng ký user A
    await request(app).post('/api/auth/register').send(userA);
    const loginA = await request(app).post('/api/auth/login').send({
      email: userA.email,
      password: userA.password,
    });
    authTokenUserA = loginA.body.data.token;

    // Đăng ký user B
    await request(app).post('/api/auth/register').send(userB);
    const loginB = await request(app).post('/api/auth/login').send({
      email: userB.email,
      password: userB.password,
    });
    authTokenUserB = loginB.body.data.token;
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('POST /api/tasks', () => {
    it('TC1: Tạo task thành công với dữ liệu đầy đủ', async () => {
      const taskData = {
        title: 'Hoàn thành báo cáo Express.js',
        description: 'Hoàn thiện chương kiến trúc và thực nghiệm',
        status: 'TODO',
        priority: 'HIGH',
        due_date: '2026-10-20',
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authTokenUserA}`)
        .send(taskData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('thành công');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe(taskData.title);
      expect(response.body.data.status).toBe(taskData.status);
      expect(response.body.data.priority).toBe(taskData.priority);

      // Lưu ID để dùng cho các test sau
      taskIdUserA = response.body.data.id;
    });

    it('TC2: Tạo task thành công chỉ với title (các trường khác optional)', async () => {
      const taskData = {
        title: 'Task tối giản',
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authTokenUserA}`)
        .send(taskData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(taskData.title);
      expect(response.body.data.status).toBe('TODO'); // Default
      expect(response.body.data.priority).toBe('MEDIUM'); // Default
    });

    it('TC3: Tạo task thất bại với title rỗng', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authTokenUserA}`)
        .send({ title: '' })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('không hợp lệ');
    });

    it('TC4: Tạo task thất bại với status không hợp lệ', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authTokenUserA}`)
        .send({
          title: 'Task với status sai',
          status: 'INVALID_STATUS',
        })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('TC5: Tạo task thất bại với priority không hợp lệ', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authTokenUserA}`)
        .send({
          title: 'Task với priority sai',
          priority: 'URGENT',
        })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('TC6: Tạo task thất bại với ngày không hợp lệ', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authTokenUserA}`)
        .send({
          title: 'Task với ngày sai',
          due_date: '2026-13-40', // Tháng 13 không tồn tại
        })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('TC7: Tạo task cho user B', async () => {
      const taskData = {
        title: 'Task của user B',
        description: 'Đây là task của user B',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authTokenUserB}`)
        .send(taskData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      taskIdUserB = response.body.data.id;
    });
  });

  describe('GET /api/tasks', () => {
    it('TC8: Lấy danh sách task thành công', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authTokenUserA}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.pagination).toHaveProperty('page');
      expect(response.body.pagination).toHaveProperty('limit');
      expect(response.body.pagination).toHaveProperty('total');
    });

    it('TC9: Lấy danh sách task với phân trang', async () => {
      const response = await request(app)
        .get('/api/tasks?page=1&limit=5')
        .set('Authorization', `Bearer ${authTokenUserA}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(5);
      expect(response.body.data.length).toBeLessThanOrEqual(5);
    });

    it('TC10: Tìm kiếm task theo tiêu đề', async () => {
      const response = await request(app)
        .get('/api/tasks?search=Express')
        .set('Authorization', `Bearer ${authTokenUserA}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      if (response.body.data.length > 0) {
        expect(response.body.data[0].title).toContain('Express');
      }
    });

    it('TC11: Lọc task theo status', async () => {
      const response = await request(app)
        .get('/api/tasks?status=TODO')
        .set('Authorization', `Bearer ${authTokenUserA}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((task) => {
        expect(task.status).toBe('TODO');
      });
    });

    it('TC12: Lọc task theo priority', async () => {
      const response = await request(app)
        .get('/api/tasks?priority=HIGH')
        .set('Authorization', `Bearer ${authTokenUserA}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((task) => {
        expect(task.priority).toBe('HIGH');
      });
    });

    it('TC13: Sắp xếp task theo created_at tăng dần', async () => {
      const response = await request(app)
        .get('/api/tasks?sortBy=created_at&order=asc')
        .set('Authorization', `Bearer ${authTokenUserA}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      if (response.body.data.length > 1) {
        const firstDate = new Date(response.body.data[0].created_at);
        const secondDate = new Date(response.body.data[1].created_at);
        expect(firstDate.getTime()).toBeLessThanOrEqual(secondDate.getTime());
      }
    });

    it('TC14: Query parameter không hợp lệ bị reject', async () => {
      const response = await request(app)
        .get('/api/tasks?status=INVALID_STATUS')
        .set('Authorization', `Bearer ${authTokenUserA}`)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('TC15: Lấy chi tiết task thành công', async () => {
      const response = await request(app)
        .get(`/api/tasks/${taskIdUserA}`)
        .set('Authorization', `Bearer ${authTokenUserA}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id', taskIdUserA);
      expect(response.body.data).toHaveProperty('title');
      expect(response.body.data).toHaveProperty('status');
    });

    it('TC16: Lấy chi tiết task không tồn tại', async () => {
      const response = await request(app)
        .get('/api/tasks/999999')
        .set('Authorization', `Bearer ${authTokenUserA}`)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Không tìm thấy');
    });

    it('TC17: User A không được truy cập task của user B', async () => {
      const response = await request(app)
        .get(`/api/tasks/${taskIdUserB}`)
        .set('Authorization', `Bearer ${authTokenUserA}`)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Không tìm thấy');
    });

    it('TC18: Lấy chi tiết task với ID không hợp lệ', async () => {
      const response = await request(app)
        .get('/api/tasks/abc')
        .set('Authorization', `Bearer ${authTokenUserA}`)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/tasks/:id', () => {
    it('TC19: Cập nhật task thành công', async () => {
      const updateData = {
        title: 'Tiêu đề đã cập nhật',
        description: 'Mô tả đã cập nhật',
        priority: 'LOW',
      };

      const response = await request(app)
        .patch(`/api/tasks/${taskIdUserA}`)
        .set('Authorization', `Bearer ${authTokenUserA}`)
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.description).toBe(updateData.description);
      expect(response.body.data.priority).toBe(updateData.priority);
    });

    it('TC20: Cập nhật task thất bại với body rỗng', async () => {
      const response = await request(app)
        .patch(`/api/tasks/${taskIdUserA}`)
        .set('Authorization', `Bearer ${authTokenUserA}`)
        .send({})
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Không có trường nào được cập nhật');
    });

    it('TC21: User A không được cập nhật task của user B', async () => {
      const response = await request(app)
        .patch(`/api/tasks/${taskIdUserB}`)
        .set('Authorization', `Bearer ${authTokenUserA}`)
        .send({ title: 'Hack attempt' })
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('TC22: Không được cập nhật user_id', async () => {
      const response = await request(app)
        .patch(`/api/tasks/${taskIdUserA}`)
        .set('Authorization', `Bearer ${authTokenUserA}`)
        .send({ user_id: 999 })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/tasks/:id/status', () => {
    it('TC23: Thay đổi trạng thái task thành công', async () => {
      const response = await request(app)
        .patch(`/api/tasks/${taskIdUserA}/status`)
        .set('Authorization', `Bearer ${authTokenUserA}`)
        .send({ status: 'COMPLETED' })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('COMPLETED');
    });

    it('TC24: Thay đổi trạng thái với giá trị không hợp lệ', async () => {
      const response = await request(app)
        .patch(`/api/tasks/${taskIdUserA}/status`)
        .set('Authorization', `Bearer ${authTokenUserA}`)
        .send({ status: 'INVALID' })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('TC25: User A không được thay đổi trạng thái task của user B', async () => {
      const response = await request(app)
        .patch(`/api/tasks/${taskIdUserB}/status`)
        .set('Authorization', `Bearer ${authTokenUserA}`)
        .send({ status: 'COMPLETED' })
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('TC26: Xóa task thành công', async () => {
      // Tạo task mới để xóa
      const createRes = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authTokenUserA}`)
        .send({ title: 'Task sẽ bị xóa' });

      const taskIdToDelete = createRes.body.data.id;

      const response = await request(app)
        .delete(`/api/tasks/${taskIdToDelete}`)
        .set('Authorization', `Bearer ${authTokenUserA}`)
        .expect(204);

      // Xác nhận task đã bị xóa
      await request(app)
        .get(`/api/tasks/${taskIdToDelete}`)
        .set('Authorization', `Bearer ${authTokenUserA}`)
        .expect(404);
    });

    it('TC27: Xóa task không tồn tại', async () => {
      const response = await request(app)
        .delete('/api/tasks/999999')
        .set('Authorization', `Bearer ${authTokenUserA}`)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('TC28: User A không được xóa task của user B', async () => {
      const response = await request(app)
        .delete(`/api/tasks/${taskIdUserB}`)
        .set('Authorization', `Bearer ${authTokenUserA}`)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Authentication Required', () => {
    it('TC29: Truy cập GET /api/tasks khi thiếu token', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Token không được cung cấp');
    });

    it('TC30: Truy cập POST /api/tasks khi thiếu token', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Test' })
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Endpoint không tồn tại', () => {
    it('TC31: Truy cập endpoint không tồn tại', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Không tìm thấy endpoint');
    });
  });
});
