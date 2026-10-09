const app = require('./app');
const { testConnection } = require('./config/database');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

/**
 * Khởi động server.
 *
 * 1. Kiểm tra kết nối MySQL trước.
 * 2. Nếu kết nối thành công, khởi động Express server.
 * 3. Nếu thất bại, ghi log lỗi và thoát.
 */
async function startServer() {
  // Kiểm tra kết nối database
  const dbConnected = await testConnection();
  if (!dbConnected) {
    console.error('⛔ Không thể khởi động server: lỗi kết nối database');
    console.error('💡 Hãy kiểm tra file .env và đảm bảo MySQL đang chạy');
    process.exit(1);
  }

  // Khởi động HTTP server
  app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
    console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📖 API Documentation: http://localhost:${PORT}/api/health`);
  });
}

startServer();
