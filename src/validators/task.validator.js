const { body, param, query } = require('express-validator');

/**
 * Validation rules cho Task API.
 * Sử dụng express-validator với chain API.
 */

// Các giá trị hợp lệ
const VALID_STATUSES = ['TODO', 'IN_PROGRESS', 'COMPLETED'];
const VALID_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];
const VALID_SORT_COLUMNS = ['created_at', 'updated_at', 'due_date', 'title', 'status', 'priority'];

// Validation cho param :id
const taskIdValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID phải là số nguyên dương'),
];

// Validation cho tạo task
const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Tiêu đề không được để trống')
    .isLength({ max: 255 }).withMessage('Tiêu đề không được quá 255 ký tự'),

  body('description')
    .optional({ values: 'null' })
    .isLength({ max: 5000 }).withMessage('Mô tả không được quá 5000 ký tự'),

  body('status')
    .optional()
    .isIn(VALID_STATUSES).withMessage(`Trạng thái phải là: ${VALID_STATUSES.join(', ')}`),

  body('priority')
    .optional()
    .isIn(VALID_PRIORITIES).withMessage(`Mức ưu tiên phải là: ${VALID_PRIORITIES.join(', ')}`),

  body('due_date')
    .optional({ values: 'null' })
    .isISO8601({ strict: true }).withMessage('Ngày hạn hoàn thành không đúng định dạng (YYYY-MM-DD)'),
];

// Validation cho cập nhật task
const updateTaskValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID phải là số nguyên dương'),

  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Tiêu đề không được để trống')
    .isLength({ max: 255 }).withMessage('Tiêu đề không được quá 255 ký tự'),

  body('description')
    .optional({ values: 'null' })
    .isLength({ max: 5000 }).withMessage('Mô tả không được quá 5000 ký tự'),

  body('status')
    .optional()
    .isIn(VALID_STATUSES).withMessage(`Trạng thái phải là: ${VALID_STATUSES.join(', ')}`),

  body('priority')
    .optional()
    .isIn(VALID_PRIORITIES).withMessage(`Mức ưu tiên phải là: ${VALID_PRIORITIES.join(', ')}`),

  body('due_date')
    .optional({ values: 'null' })
    .isISO8601({ strict: true }).withMessage('Ngày hạn hoàn thành không đúng định dạng (YYYY-MM-DD)'),

  // Không cho phép cập nhật id, user_id
  body('id').not().exists().withMessage('Không được cập nhật ID'),
  body('user_id').not().exists().withMessage('Không được cập nhật user_id'),
];

// Validation cho thay đổi trạng thái
const updateStatusValidation = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID phải là số nguyên dương'),

  body('status')
    .notEmpty().withMessage('Trạng thái không được để trống')
    .isIn(VALID_STATUSES).withMessage(`Trạng thái phải là: ${VALID_STATUSES.join(', ')}`),
];

// Validation cho query parameters khi lấy danh sách
const listTasksValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page phải là số nguyên dương'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit phải từ 1 đến 100'),

  query('status')
    .optional()
    .isIn(VALID_STATUSES).withMessage(`Trạng thái phải là: ${VALID_STATUSES.join(', ')}`),

  query('priority')
    .optional()
    .isIn(VALID_PRIORITIES).withMessage(`Mức ưu tiên phải là: ${VALID_PRIORITIES.join(', ')}`),

  query('sortBy')
    .optional()
    .isIn(VALID_SORT_COLUMNS).withMessage(`Chỉ được sắp xếp theo: ${VALID_SORT_COLUMNS.join(', ')}`),

  query('order')
    .optional()
    .isIn(['asc', 'desc']).withMessage('Thứ tự sắp xếp phải là asc hoặc desc'),

  query('search')
    .optional()
    .isLength({ max: 255 }).withMessage('Từ khóa tìm kiếm không được quá 255 ký tự'),
];

module.exports = {
  taskIdValidation,
  createTaskValidation,
  updateTaskValidation,
  updateStatusValidation,
  listTasksValidation,
};
