const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// All routes require Super Admin authentication
router.use(authenticate);
router.use(authorize('super_admin'));

// GET /api/v1/users - Get all users (with optional filters)
router.get('/', UserController.getAllUsers);

// GET /api/v1/users/:id - Get single user
router.get('/:id', UserController.getUserById);

// POST /api/v1/users - Register new user (Company Admin or Worker)
router.post('/', UserController.registerUser);

// PUT /api/v1/users/:id - Update user
router.put('/:id', UserController.updateUser);

// DELETE /api/v1/users/:id - Delete user
router.delete('/:id', UserController.deleteUser);

// GET /api/v1/users/company/:companyId - Get users by company
router.get('/company/:companyId', UserController.getUsersByCompany);

module.exports = router;
