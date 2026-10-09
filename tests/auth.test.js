const request = require('supertest');
const app = require('../src/app');
const { pool } = require('../src/config/database');

/**
 * Authentication API Integration Tests
 *
 * Các test case:
 * 1. Đăng ký thành công
 * 2. Đăng ký với username trùng lặp
 * 3. Đăng ký với email trùng lặp
 * 4. Đăng ký với dữ liệu không hợp lệ
 * 5. Đăng nhập thành công
 * 6. Đăng nhập với email không tồn tại
 * 7. Đăng nhập với mật khẩu sai
 * 8. Lấy thông tin profile với token hợp lệ
 * 9. Lấy thông tin profile khi thiếu token
 * 10. Lấy thông tin profile với token không hợp lệ
 */

describe('Authentication API Tests', () => {
  let authToken;
  const testUser = {
    username: `testuser_${Date.now()}`,
    email: `testuser_${Date.now()}@example.com`,
    password: 'Password123!',
  };

  // Đóng kết nối database sau khi tất cả test chạy xong
  afterAll(async () => {
    await pool.end();
  });

  describe('POST /api/auth/register', () => {
    it('TC1: Đăng ký thành công với dữ liệu hợp lệ', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('thành công');
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('username', testUser.username);
      expect(response.body.data).toHaveProperty('email', testUser.email);
      expect(response.body.data).not.toHaveProperty('password');
      expect(response.body.data).not.toHaveProperty('password_hash');
    });

    it('TC2: Đăng ký thất bại với username trùng lặp', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect('Content-Type', /json/)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Username đã được sử dụng');
    });

    it('TC3: Đăng ký thất bại với email trùng lặp', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: `different_${Date.now()}`,
          email: testUser.email,
          password: 'Password123!',
        })
        .expect('Content-Type', /json/)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Email đã được sử dụng');
    });

    it('TC4: Đăng ký thất bại với username quá ngắn', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'ab',
          email: 'newuser@example.com',
          password: 'Password123!',
        })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('không hợp lệ');
    });

    it('TC5: Đăng ký thất bại với email không đúng định dạng', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'validuser',
          email: 'invalid-email',
          password: 'Password123!',
        })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('TC6: Đăng ký thất bại với mật khẩu quá ngắn', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'validuser',
          email: 'valid@example.com',
          password: '12345',
        })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('TC7: Đăng nhập thành công với thông tin hợp lệ', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('thành công');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user).not.toHaveProperty('password_hash');

      // Lưu token để dùng cho các test sau
      authToken = response.body.data.token;
    });

    it('TC8: Đăng nhập thất bại với email không tồn tại', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'notexist@example.com',
          password: 'Password123!',
        })
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('không chính xác');
    });

    it('TC9: Đăng nhập thất bại với mật khẩu sai', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123!',
        })
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('không chính xác');
    });

    it('TC10: Đăng nhập thất bại khi thiếu email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'Password123!',
        })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('TC11: Lấy thông tin profile thành công với token hợp lệ', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('username', testUser.username);
      expect(response.body.data).toHaveProperty('email', testUser.email);
      expect(response.body.data).not.toHaveProperty('password_hash');
    });

    it('TC12: Lấy thông tin profile thất bại khi thiếu token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Token không được cung cấp');
    });

    it('TC13: Lấy thông tin profile thất bại với token không hợp lệ', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid_token_here')
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('không hợp lệ');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('TC14: Đăng xuất thành công với token hợp lệ', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('thành công');
    });
  });
});
