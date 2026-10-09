const mysql = require('mysql2/promise');
require('dotenv').config();

// Tạo connection pool để quản lý kết nối MySQL hiệu quả
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'task_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Hỗ trợ tiếng Việt
  charset: 'utf8mb4',
});

/**
 * Kiểm tra kết nối database.
 * Được gọi khi khởi động server để đảm bảo MySQL sẵn sàng.
 */
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Kết nối MySQL thành công');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Không thể kết nối MySQL:', error.message);
    return false;
  }
}

module.exports = { pool, testConnection };
