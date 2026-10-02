const { z } = require('zod');

const productSchema = z.object({
    name: z.string().min(1, "Tên không được để trống"),
    price: z.number().positive("Giá phải lớn hơn 0")
});

const validateProduct = (req, res, next) => {
    try {
        productSchema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({ message: "Dữ liệu đầu vào sai", errors: error.errors });
    }
};
module.exports = validateProduct;