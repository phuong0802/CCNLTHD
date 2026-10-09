const { body } = require('express-validator');

/**
 * Validation rules cho Authentication API.
 * Sử dụng express-validator với chain API.
 */

// Validation cho đăng ký
const registerValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username không được để trống')
    .isLength({ min: 3, max: 50 }).withMessage('Username phải từ 3 đến 50 ký tự')
    .isAlphanumeric().withMessage('Username chỉ chứa chữ cái và số'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email không được để trống')
    .isEmail().withMessage('Email không đúng định dạng')
    .isLength({ max: 100 }).withMessage('Email không được quá 100 ký tự')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Mật khẩu không được để trống')
    .isLength({ min: 6, max: 100 }).withMessage('Mật khẩu phải từ 6 đến 100 ký tự'),
];

// Validation cho đăng nhập
const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email không được để trống')
    .isEmail().withMessage('Email không đúng định dạng'),

  body('password')
    .notEmpty().withMessage('Mật khẩu không được để trống'),
];

module.exports = {
  registerValidation,
  loginValidation,
};
