const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const authMiddleware = require('../middlewares/auth.middleware');
const validateProduct = require('../middlewares/validation.middleware');

router.post('/', authMiddleware, validateProduct, catchAsync(async (req, res) => {
    const bodyData = req.body;
    res.status(201).json({ message: "Tạo sản phẩm thành công", data: bodyData });
}));

router.get('/:productId', catchAsync(async (req, res) => {
    const productId = req.params.productId;
    const sort = req.query.sort; 
    
    if (productId === "error") {
        throw new Error("Lỗi bất đồng bộ giả lập khi truy vấn Database");
    }

    res.json({ message: "Lấy chi tiết thành công", productId, sort });
}));

module.exports = router;