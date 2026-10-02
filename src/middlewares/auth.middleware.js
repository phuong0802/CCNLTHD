const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Không có quyền truy cập. Thiếu token!' });
    }
    if (token === "SECRET_TOKEN_123") {
        req.user = { id: 1, name: "Admin" };
        next(); 
    } else {
        return res.status(403).json({ message: 'Token không hợp lệ.' });
    }
};
module.exports = authMiddleware;