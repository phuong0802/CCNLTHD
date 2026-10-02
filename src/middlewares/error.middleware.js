const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Lỗi hệ thống nội bộ';
    console.error(`[Error] ${statusCode} - ${message}`);
    
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
};
module.exports = errorHandler;